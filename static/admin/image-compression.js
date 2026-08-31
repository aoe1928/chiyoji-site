(() => {
  "use strict";

  const SETTINGS = Object.freeze({
    maxLongEdge: 2560,
    minLongEdge: 1280,
    targetBytes: 1500000,
    hardLimitBytes: 2097152,
    qualities: [0.84, 0.76, 0.68, 0.6, 0.54],
    compressibleTypes: new Set(["image/jpeg", "image/png", "image/webp"]),
    unsupportedPhoneTypes: new Set(["image/heic", "image/heif"]),
  });

  const replayingInputs = new WeakSet();
  let activeImageWidgetRoot = null;
  let lastSelectedMediaName = "";
  let lastCopiedMediaPath = "";

  const nativeClipboardWrite = navigator.clipboard?.writeText?.bind(navigator.clipboard);
  if (nativeClipboardWrite) {
    try {
      navigator.clipboard.writeText = async (value) => {
        if (typeof value === "string" && /\.(jpe?g|png|webp|gif|svg)$/i.test(value)) {
          lastCopiedMediaPath = value;
        }
        return nativeClipboardWrite(value);
      };
    } catch {
      // Some browsers expose clipboard methods as read-only. The filename fallback below still works.
    }
  }

  function formatMegabytes(bytes) {
    return `${(bytes / 1000000).toFixed(1)}MB`;
  }

  function showStatus(message, kind = "working", duration = 0) {
    let status = document.getElementById("chiyoji-image-compression-status");
    if (!status) {
      status = document.createElement("div");
      status.id = "chiyoji-image-compression-status";
      status.setAttribute("role", "status");
      status.setAttribute("aria-live", "polite");
      Object.assign(status.style, {
        position: "fixed",
        right: "20px",
        bottom: "20px",
        zIndex: "2147483647",
        maxWidth: "min(420px, calc(100vw - 40px))",
        padding: "12px 16px",
        borderRadius: "8px",
        color: "#fff",
        font: "600 14px/1.5 system-ui, sans-serif",
        boxShadow: "0 6px 24px rgba(0, 0, 0, 0.25)",
      });
      document.body.appendChild(status);
    }

    status.textContent = message;
    status.style.background = kind === "error" ? "#b42318" : kind === "done" ? "#087443" : "#334155";
    status.hidden = false;
    window.clearTimeout(status.hideTimer);
    if (duration) {
      status.hideTimer = window.setTimeout(() => {
        status.hidden = true;
      }, duration);
    }
  }

  function isHeic(file) {
    return (
      SETTINGS.unsupportedPhoneTypes.has(file.type.toLowerCase()) ||
      /\.(heic|heif)$/i.test(file.name)
    );
  }

  function isCompressible(file) {
    return (
      SETTINGS.compressibleTypes.has(file.type.toLowerCase()) ||
      /\.(jpe?g|png|webp)$/i.test(file.name)
    );
  }

  function isWebp(file) {
    return file.type.toLowerCase() === "image/webp" || /\.webp$/i.test(file.name);
  }

  function webpName(originalName) {
    const stem = originalName.replace(/\.[^.]+$/, "") || "image";
    return `${stem}.webp`;
  }

  async function decodeImage(file) {
    if ("createImageBitmap" in window) {
      return window.createImageBitmap(file, { imageOrientation: "from-image" });
    }

    const objectUrl = URL.createObjectURL(file);
    try {
      const image = new Image();
      image.decoding = "async";
      image.src = objectUrl;
      await image.decode();
      return image;
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  }

  function imageSize(image) {
    return {
      width: image.naturalWidth || image.width,
      height: image.naturalHeight || image.height,
    };
  }

  function dimensionsFor(width, height, longEdge) {
    const scale = Math.min(1, longEdge / Math.max(width, height));
    return {
      width: Math.max(1, Math.round(width * scale)),
      height: Math.max(1, Math.round(height * scale)),
    };
  }

  function canvasToBlob(canvas, quality) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("WebPへの変換に失敗しました。"))),
        "image/webp",
        quality,
      );
    });
  }

  async function encodeAtSize(image, width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) throw new Error("画像処理用のCanvasを利用できません。");
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(image, 0, 0, width, height);

    let blob;
    for (const quality of SETTINGS.qualities) {
      blob = await canvasToBlob(canvas, quality);
      if (blob.size <= SETTINGS.targetBytes) break;
    }
    canvas.width = 1;
    canvas.height = 1;
    return blob;
  }

  async function compressFile(file) {
    if (isHeic(file)) {
      throw new Error(`${file.name} はHEIC形式です。端末でJPEGに変換してから追加してください。`);
    }
    if (!isCompressible(file)) {
      return { file, changed: false, reason: "unsupported" };
    }

    const image = await decodeImage(file);
    try {
      const source = imageSize(image);
      const requiresResize = Math.max(source.width, source.height) > SETTINGS.maxLongEdge;
      if (isWebp(file) && !requiresResize && file.size <= SETTINGS.targetBytes) {
        return { file, changed: false, source, output: source };
      }

      let longEdge = Math.min(SETTINGS.maxLongEdge, Math.max(source.width, source.height));
      let output = dimensionsFor(source.width, source.height, longEdge);
      let blob = await encodeAtSize(image, output.width, output.height);

      while (blob.size > SETTINGS.targetBytes && longEdge > SETTINGS.minLongEdge) {
        const ratio = Math.sqrt(SETTINGS.targetBytes / blob.size) * 0.92;
        longEdge = Math.max(SETTINGS.minLongEdge, Math.round(longEdge * Math.min(0.9, Math.max(0.65, ratio))));
        output = dimensionsFor(source.width, source.height, longEdge);
        blob = await encodeAtSize(image, output.width, output.height);
      }

      if (blob.size > SETTINGS.hardLimitBytes) {
        throw new Error(`${file.name} を2MB以下にできませんでした。先に端末側で小さくしてください。`);
      }

      if (isWebp(file) && blob.size >= file.size && file.size <= SETTINGS.hardLimitBytes) {
        return { file, changed: false, source, output: source };
      }

      const compressed = new File([blob], webpName(file.name), {
        type: "image/webp",
        lastModified: file.lastModified,
      });
      return { file: compressed, changed: true, source, output };
    } finally {
      if (typeof image.close === "function") image.close();
    }
  }

  async function compressFiles(files) {
    const results = [];
    for (const file of files) results.push(await compressFile(file));
    return results;
  }

  function filesDataTransfer(results) {
    const transfer = new DataTransfer();
    for (const result of results) transfer.items.add(result.file);
    return transfer;
  }

  function padNumber(value) {
    return String(value).padStart(2, "0");
  }

  function clipboardImageName(file, index) {
    if (/^(?:19|20)\d{6}/.test(file.name || "")) return file.name;
    const now = new Date();
    const timestamp = [
      now.getFullYear(),
      padNumber(now.getMonth() + 1),
      padNumber(now.getDate()),
      "_",
      padNumber(now.getHours()),
      padNumber(now.getMinutes()),
      padNumber(now.getSeconds()),
    ].join("");
    const extensionByType = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif",
      "image/svg+xml": "svg",
    };
    const originalExtension = file.name?.match(/\.([a-z0-9]+)$/i)?.[1]?.toLowerCase();
    const extension = extensionByType[file.type.toLowerCase()] || originalExtension || "png";
    const suffix = index ? `_${padNumber(index + 1)}` : "";
    return `${timestamp}${suffix}.${extension}`;
  }

  function clipboardImageFiles(clipboardData) {
    const itemFiles = Array.from(clipboardData?.items || [])
      .filter((item) => item.kind === "file" && item.type.startsWith("image/"))
      .map((item) => item.getAsFile())
      .filter((file) => file instanceof File);
    const files = itemFiles.length ? itemFiles : Array.from(clipboardData?.files || [])
      .filter((file) => file instanceof File && file.type.startsWith("image/"));
    return files.map((file, index) => new File([file], clipboardImageName(file, index), {
      type: file.type,
      lastModified: Date.now(),
    }));
  }

  function mediaDialogFor(target) {
    if (!(target instanceof Element)) return null;
    const dialog = target.closest('[role="dialog"], [aria-modal="true"]');
    if (!dialog) return null;
    const text = dialog.textContent || "";
    return /メディア|画像|media|image/i.test(text) && /アップロード|upload/i.test(text) ? dialog : null;
  }

  function currentMediaDialog() {
    return Array.from(document.querySelectorAll('[role="dialog"], [aria-modal="true"]')).find(
      (dialog) => mediaDialogFor(dialog) === dialog,
    ) || null;
  }

  function mediaUploadInput(dialog) {
    const dialogInput = dialog.querySelector('input[type="file"]');
    if (dialogInput instanceof HTMLInputElement) return dialogInput;
    return Array.from(document.querySelectorAll('input[type="file"]')).find(
      (input) => input instanceof HTMLInputElement && /image|jpe?g|png|webp/i.test(input.accept || "image"),
    ) || null;
  }

  function addPreparedFilesToMedia(dialog, results) {
    const input = mediaUploadInput(dialog);
    if (!input) {
      throw new Error("アップロード欄を見つけられませんでした。画面上部の「アップロードする」を一度押してください。");
    }
    input.multiple = true;
    input.files = filesDataTransfer(results).files;
    replayingInputs.add(input);
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function showMediaDropOverlay(dialog) {
    let overlay = document.getElementById("chiyoji-media-drop-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "chiyoji-media-drop-overlay";
      overlay.innerHTML = "<strong>写真をここへドロップ</strong><span>WebPへ変換してメディアへ追加します</span>";
      Object.assign(overlay.style, {
        position: "fixed",
        zIndex: "2147483646",
        display: "none",
        placeContent: "center",
        gap: "8px",
        border: "3px dashed #16746a",
        borderRadius: "12px",
        color: "#0d574f",
        background: "rgba(223, 244, 239, 0.94)",
        textAlign: "center",
        font: "600 15px/1.5 system-ui, sans-serif",
        pointerEvents: "none",
        boxShadow: "inset 0 0 0 5px rgba(255, 255, 255, 0.7)",
      });
      overlay.querySelector("strong").style.fontSize = "20px";
      document.body.appendChild(overlay);
    }
    const rect = dialog.getBoundingClientRect();
    Object.assign(overlay.style, {
      left: `${rect.left + 14}px`,
      top: `${rect.top + 14}px`,
      width: `${Math.max(0, rect.width - 28)}px`,
      height: `${Math.max(0, rect.height - 28)}px`,
    });
    overlay.hidden = false;
    overlay.style.display = "grid";
  }

  function hideMediaDropOverlay() {
    const overlay = document.getElementById("chiyoji-media-drop-overlay");
    if (overlay) {
      overlay.hidden = true;
      overlay.style.display = "none";
    }
  }

  function compactText(element) {
    return (element?.textContent || "").replace(/\s+/g, "").trim();
  }

  function isUrlButton(button) {
    return /URLを(入力|変更)|enterurl|replaceurl/i.test(compactText(button));
  }

  function imageWidgetRootFor(button) {
    let element = button?.parentElement;
    for (let depth = 0; element && depth < 9; depth += 1, element = element.parentElement) {
      if (!element.closest('[role="dialog"], [aria-modal="true"]')) {
        const urlButton = Array.from(element.querySelectorAll("button")).find(isUrlButton);
        if (urlButton) return element;
      }
    }
    return null;
  }

  function mediaNameFromClick(target, dialog) {
    let element = target instanceof Element ? target : null;
    while (element && element !== dialog) {
      const label = Array.from(element.children || []).find(
        (child) => child.tagName === "P" && /\.(jpe?g|png|webp|gif|svg)$/i.test(compactText(child)),
      );
      if (label) return compactText(label);
      element = element.parentElement;
    }
    return "";
  }

  function normalizeMediaUrl(value, fallbackName = "") {
    let path = String(value || fallbackName || "").trim().replace(/\\/g, "/");
    if (!path) return "";

    if (/^https?:\/\//i.test(path)) {
      try {
        path = new URL(path).pathname;
      } catch {
        // Keep the original value and normalize it below.
      }
    }

    path = path.split(/[?#]/, 1)[0];
    while (path.startsWith("./")) path = path.slice(2);
    path = path.replace(/^\/+/, "").replace(/^static\//i, "");

    if (/^images\/blog\//i.test(path)) return `/${path}`;
    if (/^[^/]+\.(jpe?g|png|webp|gif|svg)$/i.test(path)) return `/images/blog/${path}`;
    return path ? `/${path}` : "";
  }

  function selectedMediaNameFromStyles(dialog) {
    const cards = Array.from(dialog.querySelectorAll("p"))
      .filter((label) => /\.(jpe?g|png|webp|gif|svg)$/i.test(compactText(label)))
      .map((label) => ({ name: compactText(label), card: label.parentElement }))
      .filter(({ card }) => card);
    if (cards.length === 1) return cards[0].name;
    const colorCounts = new Map();
    for (const { card } of cards) {
      const color = getComputedStyle(card).borderColor;
      colorCounts.set(color, (colorCounts.get(color) || 0) + 1);
    }
    const majority = Math.max(0, ...colorCounts.values());
    return cards.find(({ card }) => colorCounts.get(getComputedStyle(card).borderColor) < majority)?.name || "";
  }

  function wait(milliseconds) {
    return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
  }

  async function insertSelectedMediaAsUrl(dialog) {
    if (!activeImageWidgetRoot) {
      throw new Error("URLの入力先を見つけられませんでした。画像欄の「他の画像を選択」から開き直してください。");
    }

    const selectedName = lastSelectedMediaName || selectedMediaNameFromStyles(dialog);
    lastCopiedMediaPath = "";
    const buttons = Array.from(dialog.querySelectorAll("button"));
    const copyButton = buttons.find((button) => /パスをコピー|名前をコピー|copy(path|name|url)/i.test(compactText(button)));
    if (copyButton && !copyButton.disabled) copyButton.click();
    await wait(80);

    let path = lastCopiedMediaPath;
    if (!path && navigator.clipboard?.readText) {
      try {
        const copied = await navigator.clipboard.readText();
        if (/\.(jpe?g|png|webp|gif|svg)$/i.test(copied)) path = copied;
      } catch {
        // Clipboard reading may be blocked; use the selected card's filename.
      }
    }
    path = normalizeMediaUrl(path, selectedName);
    if (!path) throw new Error("選択した画像のパスを取得できませんでした。「パスをコピー」を一度押してから選択してください。");

    const closeButton = buttons.find((button) => /閉じる|close/i.test(button.getAttribute("aria-label") || ""));
    if (!closeButton) throw new Error("画像一覧を閉じられませんでした。");
    closeButton.click();
    await wait(380);

    const urlButton = Array.from(activeImageWidgetRoot.querySelectorAll("button")).find(isUrlButton);
    if (!urlButton) throw new Error("画像のURL入力ボタンを見つけられませんでした。");
    const nativePrompt = window.prompt;
    window.prompt = () => path;
    try {
      urlButton.click();
    } finally {
      window.prompt = nativePrompt;
    }
    activeImageWidgetRoot = null;
    lastSelectedMediaName = "";
    showStatus(`URLとして挿入しました：${path}`, "done", 7000);
  }

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target instanceof Element ? event.target : null;
      const button = target?.closest("button");
      const dialog = mediaDialogFor(target);

      if (!dialog && button) {
        const root = imageWidgetRootFor(button);
        if (root) {
          activeImageWidgetRoot = root;
          lastSelectedMediaName = "";
          lastCopiedMediaPath = "";
        }
        return;
      }

      if (!dialog) return;
      const mediaName = mediaNameFromClick(target, dialog);
      if (mediaName) lastSelectedMediaName = mediaName;

      if (button && /^選択する$|^choose(selected)?$/i.test(compactText(button))) {
        event.preventDefault();
        event.stopImmediatePropagation();
        insertSelectedMediaAsUrl(dialog).catch((error) => {
          showStatus(error.message || "画像URLの入力に失敗しました。", "error", 10000);
        });
      }
    },
    true,
  );

  function successMessage(results) {
    const changed = results.filter((result) => result.changed);
    if (!changed.length) return "画像はすでに公開向けサイズです。";
    const before = changed.reduce((sum, result) => sum + result.originalSize, 0);
    const after = changed.reduce((sum, result) => sum + result.file.size, 0);
    return `${changed.length}枚を圧縮しました（${formatMegabytes(before)} → ${formatMegabytes(after)}）`;
  }

  async function prepareFiles(files) {
    showStatus("公開用の画像を圧縮しています…");
    const results = await compressFiles(files);
    for (let index = 0; index < results.length; index += 1) {
      results[index].originalSize = files[index].size;
    }
    showStatus(successMessage(results), "done", 6000);
    return results;
  }

  document.addEventListener(
    "change",
    (event) => {
      const input = event.target;
      if (!(input instanceof HTMLInputElement) || input.type !== "file" || !input.files?.length) return;
      if (replayingInputs.has(input)) {
        replayingInputs.delete(input);
        return;
      }

      const files = Array.from(input.files);
      if (!files.some((file) => isCompressible(file) || isHeic(file))) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      const editorMediaUpload = Boolean(activeImageWidgetRoot && (mediaDialogFor(input) || currentMediaDialog()));

      prepareFiles(files)
        .then((results) => {
          if (editorMediaUpload && results.length === 1) {
            lastSelectedMediaName = results[0].file.name;
          }
          input.files = filesDataTransfer(results).files;
          replayingInputs.add(input);
          input.dispatchEvent(new Event("change", { bubbles: true }));
          if (editorMediaUpload) {
            showStatus("アップロード後、写真を選んで「選択する」を押してください。", "done", 9000);
          }
        })
        .catch((error) => {
          input.value = "";
          showStatus(error.message || "画像の圧縮に失敗しました。", "error", 10000);
        });
    },
    true,
  );

  document.addEventListener(
    "paste",
    (event) => {
      const dialog = mediaDialogFor(event.target) || currentMediaDialog();
      if (!dialog) return;
      const files = clipboardImageFiles(event.clipboardData);
      if (!files.length) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      prepareFiles(files)
        .then((results) => {
          if (activeImageWidgetRoot && results.length === 1) {
            lastSelectedMediaName = results[0].file.name;
          }
          addPreparedFilesToMedia(dialog, results);
          showStatus(`${results.length}枚の画像を貼り付けてメディア追加を開始しました。`, "done", 7000);
        })
        .catch((error) => {
          showStatus(error.message || "コピーした画像の貼り付けに失敗しました。", "error", 10000);
        });
    },
    true,
  );

  document.addEventListener(
    "dragover",
    (event) => {
      if (!event.dataTransfer?.types?.includes("Files")) return;
      const dialog = mediaDialogFor(event.target);
      if (!dialog) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
      showMediaDropOverlay(dialog);
    },
    true,
  );

  document.addEventListener(
    "dragleave",
    (event) => {
      const dialog = mediaDialogFor(event.target);
      if (!dialog || (event.relatedTarget instanceof Node && dialog.contains(event.relatedTarget))) return;
      window.setTimeout(hideMediaDropOverlay, 80);
    },
    true,
  );

  document.addEventListener(
    "drop",
    (event) => {
      if (event.chiyojiCompressedDrop || !event.dataTransfer?.files?.length) return;
      const files = Array.from(event.dataTransfer.files);
      if (!files.some((file) => isCompressible(file) || isHeic(file))) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      const target = event.target;
      const mediaDialog = mediaDialogFor(target);
      hideMediaDropOverlay();

      prepareFiles(files)
        .then((results) => {
          if (mediaDialog) {
            addPreparedFilesToMedia(mediaDialog, results);
            showStatus(`${results.length}枚のメディア追加を開始しました。`, "done", 7000);
            return;
          }
          const replay = new DragEvent("drop", {
            bubbles: true,
            cancelable: true,
            dataTransfer: filesDataTransfer(results),
          });
          Object.defineProperty(replay, "chiyojiCompressedDrop", { value: true });
          target.dispatchEvent(replay);
        })
        .catch((error) => {
          showStatus(error.message || "画像の圧縮に失敗しました。", "error", 10000);
        });
    },
    true,
  );

  window.ChiyojiImageCompression = Object.freeze({ clipboardImageName, compressFile, settings: SETTINGS });
})();
