(() => {
  "use strict";

  const DB_NAME = "chiyoji-local-writer";
  const DB_VERSION = 1;
  const DRAFT_ID = "current";
  const REPO = "aoe1928/chiyoji-site";
  const BRANCH = "codex/decap-cms-trial";
  const AUTH_ORIGIN = "https://chiyoji-decap-oauth.chiyoji0762.workers.dev";
  const MAX_FILES = 20;
  const IMAGE_SETTINGS = Object.freeze({
    maxLongEdge: 2560,
    minLongEdge: 1280,
    targetBytes: 1500000,
    hardLimitBytes: 2097152,
    qualities: [0.84, 0.76, 0.68, 0.6, 0.54],
  });

  const elements = {
    title: document.getElementById("title"),
    date: document.getElementById("date"),
    slug: document.getElementById("slug"),
    draft: document.getElementById("draft"),
    categories: Array.from(document.querySelectorAll('.categories input[type="checkbox"]')),
    dropzone: document.getElementById("dropzone"),
    imageInput: document.getElementById("image-input"),
    blockList: document.getElementById("block-list"),
    addText: document.getElementById("add-text"),
    saveState: document.getElementById("save-state"),
    newDraft: document.getElementById("new-draft"),
    publish: document.getElementById("publish"),
    previewTitle: document.getElementById("preview-title"),
    previewDate: document.getElementById("preview-date"),
    previewBody: document.getElementById("preview-body"),
    toast: document.getElementById("toast"),
    confirmDialog: document.getElementById("confirm-dialog"),
    confirmTitle: document.getElementById("confirm-title"),
    confirmMessage: document.getElementById("confirm-message"),
  };

  let database;
  let saveTimer;
  let toastTimer;
  let githubToken = null;
  let publishing = false;
  const assets = new Map();
  const objectUrls = new Map();
  let state = createEmptyDraft();

  function localToday() {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  }

  function uid(prefix) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  function createEmptyDraft() {
    return {
      id: DRAFT_ID,
      title: "",
      date: localToday(),
      slug: "",
      draft: true,
      categories: [],
      blocks: [{ id: uid("text"), type: "text", text: "" }],
      publishedPath: "",
      publishedAssetPaths: [],
      updatedAt: Date.now(),
    };
  }

  function openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains("drafts")) db.createObjectStore("drafts", { keyPath: "id" });
        if (!db.objectStoreNames.contains("assets")) {
          const store = db.createObjectStore("assets", { keyPath: "id" });
          store.createIndex("draftId", "draftId", { unique: false });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("端末保存を開始できませんでした。"));
    });
  }

  function dbRequest(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("端末保存に失敗しました。"));
    });
  }

  async function loadLocalDraft() {
    const draft = await dbRequest(database.transaction("drafts").objectStore("drafts").get(DRAFT_ID));
    if (draft) state = draft;
    const records = await dbRequest(
      database.transaction("assets").objectStore("assets").index("draftId").getAll(DRAFT_ID),
    );
    for (const record of records) {
      assets.set(record.id, record);
      objectUrls.set(record.id, URL.createObjectURL(record.blob));
    }
  }

  function saveDraftNow() {
    return new Promise((resolve, reject) => {
      state.updatedAt = Date.now();
      const transaction = database.transaction("drafts", "readwrite");
      transaction.objectStore("drafts").put(state);
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error || new Error("下書きの保存に失敗しました。"));
    });
  }

  function scheduleSave() {
    if (!database) return;
    window.clearTimeout(saveTimer);
    elements.saveState.textContent = "端末へ保存中…";
    saveTimer = window.setTimeout(async () => {
      try {
        await saveDraftNow();
        elements.saveState.textContent = `端末に保存済み ${new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}`;
      } catch (error) {
        elements.saveState.textContent = "端末保存エラー";
        showToast(error.message, "error", 8000);
      }
    }, 500);
  }

  function saveAsset(record) {
    return new Promise((resolve, reject) => {
      const transaction = database.transaction("assets", "readwrite");
      transaction.objectStore("assets").put(record);
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error || new Error("画像を端末へ保存できませんでした。"));
    });
  }

  function deleteAsset(assetId) {
    return new Promise((resolve, reject) => {
      const transaction = database.transaction("assets", "readwrite");
      transaction.objectStore("assets").delete(assetId);
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error || new Error("画像を削除できませんでした。"));
    });
  }

  async function clearLocalDraft() {
    const transaction = database.transaction(["drafts", "assets"], "readwrite");
    transaction.objectStore("drafts").delete(DRAFT_ID);
    const assetStore = transaction.objectStore("assets");
    const cursorRequest = assetStore.index("draftId").openCursor(IDBKeyRange.only(DRAFT_ID));
    cursorRequest.onsuccess = () => {
      const cursor = cursorRequest.result;
      if (!cursor) return;
      cursor.delete();
      cursor.continue();
    };
    await new Promise((resolve, reject) => {
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error || new Error("下書きを消去できませんでした。"));
    });
    for (const url of objectUrls.values()) URL.revokeObjectURL(url);
    objectUrls.clear();
    assets.clear();
  }

  function showToast(message, kind = "normal", duration = 5000) {
    window.clearTimeout(toastTimer);
    elements.toast.textContent = message;
    elements.toast.style.background = kind === "error" ? "#b42318" : kind === "done" ? "#087443" : "#344054";
    elements.toast.hidden = false;
    if (duration) {
      toastTimer = window.setTimeout(() => {
        elements.toast.hidden = true;
      }, duration);
    }
  }

  function formatMegabytes(bytes) {
    return `${(bytes / 1000000).toFixed(1)}MB`;
  }

  function decodeImage(file) {
    if ("createImageBitmap" in window) return window.createImageBitmap(file, { imageOrientation: "from-image" });
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const image = new Image();
      image.onload = () => {
        URL.revokeObjectURL(url);
        resolve(image);
      };
      image.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error(`${file.name} を読み込めませんでした。`));
      };
      image.src = url;
    });
  }

  function dimensionsFor(width, height, longEdge) {
    const scale = Math.min(1, longEdge / Math.max(width, height));
    return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
  }

  function canvasToBlob(canvas, quality) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        blob => blob ? resolve(blob) : reject(new Error("WebPへの変換に失敗しました。")),
        "image/webp",
        quality,
      );
    });
  }

  async function compressImage(file) {
    if (/\.(heic|heif)$/i.test(file.name) || /image\/(heic|heif)/i.test(file.type)) {
      throw new Error(`${file.name} はHEIC形式です。先にJPEGへ変換してください。`);
    }
    if (!/\.(jpe?g|png|webp)$/i.test(file.name) && !/^image\/(jpeg|png|webp)$/i.test(file.type)) {
      throw new Error(`${file.name} は対応していない画像形式です。`);
    }

    const image = await decodeImage(file);
    try {
      const width = image.naturalWidth || image.width;
      const height = image.naturalHeight || image.height;
      const alreadyWebp = file.type.toLowerCase() === "image/webp" || /\.webp$/i.test(file.name);
      if (alreadyWebp && Math.max(width, height) <= IMAGE_SETTINGS.maxLongEdge && file.size <= IMAGE_SETTINGS.targetBytes) {
        return { blob: file, width, height, originalSize: file.size };
      }

      let longEdge = Math.min(IMAGE_SETTINGS.maxLongEdge, Math.max(width, height));
      let output = dimensionsFor(width, height, longEdge);
      let blob;
      while (true) {
        const canvas = document.createElement("canvas");
        canvas.width = output.width;
        canvas.height = output.height;
        const context = canvas.getContext("2d", { alpha: true });
        if (!context) throw new Error("画像処理を開始できませんでした。");
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";
        context.drawImage(image, 0, 0, output.width, output.height);
        for (const quality of IMAGE_SETTINGS.qualities) {
          blob = await canvasToBlob(canvas, quality);
          if (blob.size <= IMAGE_SETTINGS.targetBytes) break;
        }
        canvas.width = 1;
        canvas.height = 1;
        if (blob.size <= IMAGE_SETTINGS.targetBytes || longEdge <= IMAGE_SETTINGS.minLongEdge) break;
        const ratio = Math.sqrt(IMAGE_SETTINGS.targetBytes / blob.size) * 0.92;
        longEdge = Math.max(IMAGE_SETTINGS.minLongEdge, Math.round(longEdge * Math.min(0.9, Math.max(0.65, ratio))));
        output = dimensionsFor(width, height, longEdge);
      }
      if (blob.size > IMAGE_SETTINGS.hardLimitBytes) {
        throw new Error(`${file.name} を2MB以下にできませんでした。`);
      }
      return { blob, width: output.width, height: output.height, originalSize: file.size };
    } finally {
      if (typeof image.close === "function") image.close();
    }
  }

  function assetName(name) {
    const stem = name.replace(/\.[^.]+$/, "").normalize("NFKC").replace(/[^\p{L}\p{N}_-]+/gu, "-").replace(/^-+|-+$/g, "").slice(0, 60);
    return `${stem || "photo"}.webp`;
  }

  async function addImages(fileList) {
    const files = Array.from(fileList).slice(0, MAX_FILES);
    if (!files.length) return;
    if (fileList.length > MAX_FILES) showToast(`一度に追加できるのは${MAX_FILES}枚までです。`, "error", 7000);
    elements.imageInput.value = "";
    elements.dropzone.setAttribute("aria-busy", "true");
    try {
      if (navigator.storage?.persist) navigator.storage.persist().catch(() => {});
      for (let index = 0; index < files.length; index += 1) {
        showToast(`${index + 1}/${files.length}枚目をWebPへ変換しています…`, "normal", 0);
        const file = files[index];
        const compressed = await compressImage(file);
        const id = uid("asset");
        const record = {
          id,
          draftId: DRAFT_ID,
          name: assetName(file.name),
          originalName: file.name,
          blob: compressed.blob,
          width: compressed.width,
          height: compressed.height,
          originalSize: compressed.originalSize,
          createdAt: Date.now(),
        };
        await saveAsset(record);
        assets.set(id, record);
        objectUrls.set(id, URL.createObjectURL(record.blob));
        state.blocks.push({ id: uid("image"), type: "image", assetId: id, alt: "", title: "" });
      }
      if (state.blocks[state.blocks.length - 1]?.type !== "text") {
        state.blocks.push({ id: uid("text"), type: "text", text: "" });
      }
      renderBlocks();
      renderPreview();
      scheduleSave();
      showToast(`${files.length}枚をWebPにして端末へ保存しました。`, "done", 6000);
    } catch (error) {
      showToast(error.message || "画像の追加に失敗しました。", "error", 9000);
    } finally {
      elements.dropzone.removeAttribute("aria-busy");
    }
  }

  function blockHead(label, blockId, allowDelete = true) {
    const head = document.createElement("div");
    head.className = "block-head";
    const title = document.createElement("div");
    title.className = "block-label";
    title.textContent = label;
    const actions = document.createElement("div");
    actions.className = "block-actions";
    actions.append(
      actionButton("↑", "上へ移動", () => moveBlock(blockId, -1)),
      actionButton("↓", "下へ移動", () => moveBlock(blockId, 1)),
    );
    if (allowDelete) actions.append(actionButton("削除", "ブロックを削除", () => removeBlock(blockId), true));
    head.append(title, actions);
    return head;
  }

  function actionButton(text, label, handler, danger = false) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `icon-button${danger ? " icon-button--danger" : ""}`;
    button.textContent = text;
    button.setAttribute("aria-label", label);
    button.addEventListener("click", handler);
    return button;
  }

  function renderBlocks() {
    elements.blockList.replaceChildren();
    state.blocks.forEach((block, index) => {
      if (block.type === "text") {
        const article = document.createElement("article");
        article.className = "text-block";
        article.append(blockHead(`本文 ${index + 1}`, block.id, state.blocks.length > 1));
        const textarea = document.createElement("textarea");
        textarea.rows = 8;
        textarea.value = block.text;
        textarea.placeholder = "旅の記録を書きます。Markdownも使えます。";
        textarea.addEventListener("input", () => {
          block.text = textarea.value;
          renderPreview();
          scheduleSave();
        });
        article.append(textarea);
        elements.blockList.append(article);
      } else if (block.type === "image") {
        const record = assets.get(block.assetId);
        if (!record) return;
        const article = document.createElement("article");
        article.className = "image-block";
        article.append(blockHead(`画像 ${index + 1}`, block.id));
        const content = document.createElement("div");
        content.className = "image-block__content";
        const image = document.createElement("img");
        image.src = objectUrls.get(record.id);
        image.alt = block.alt || "追加した画像";
        const fields = document.createElement("div");
        fields.className = "image-block__fields";
        fields.append(
          imageField("代替テキスト", block.alt, value => { block.alt = value; renderPreview(); scheduleSave(); }),
          imageField("画像下のキャプション", block.title, value => { block.title = value; renderPreview(); scheduleSave(); }),
        );
        const meta = document.createElement("div");
        meta.className = "image-meta";
        meta.textContent = `${record.width}×${record.height}px・${formatMegabytes(record.blob.size)}・WebP`;
        fields.append(meta);
        content.append(image, fields);
        article.append(content);
        elements.blockList.append(article);
      }
    });
  }

  function imageField(labelText, value, onInput) {
    const label = document.createElement("label");
    label.textContent = labelText;
    const input = document.createElement("input");
    input.type = "text";
    input.value = value;
    input.addEventListener("input", () => onInput(input.value));
    label.append(input);
    return label;
  }

  function moveBlock(id, direction) {
    const index = state.blocks.findIndex(block => block.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= state.blocks.length) return;
    [state.blocks[index], state.blocks[target]] = [state.blocks[target], state.blocks[index]];
    renderBlocks();
    renderPreview();
    scheduleSave();
  }

  async function removeBlock(id) {
    const index = state.blocks.findIndex(block => block.id === id);
    if (index < 0) return;
    const [block] = state.blocks.splice(index, 1);
    if (block.type === "image") {
      const stillUsed = state.blocks.some(candidate => candidate.type === "image" && candidate.assetId === block.assetId);
      if (!stillUsed) {
        URL.revokeObjectURL(objectUrls.get(block.assetId));
        objectUrls.delete(block.assetId);
        assets.delete(block.assetId);
        await deleteAsset(block.assetId);
      }
    }
    if (!state.blocks.length) state.blocks.push({ id: uid("text"), type: "text", text: "" });
    renderBlocks();
    renderPreview();
    scheduleSave();
  }

  function addTextBlock() {
    state.blocks.push({ id: uid("text"), type: "text", text: "" });
    renderBlocks();
    renderPreview();
    scheduleSave();
    elements.blockList.lastElementChild?.querySelector("textarea")?.focus();
  }

  function renderInline(text) {
    return escapeHtml(text)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>");
  }

  function renderMarkdown(container, markdown) {
    const lines = markdown.replace(/\r\n/g, "\n").split("\n");
    let paragraph = [];
    let list = [];
    const flushParagraph = () => {
      if (!paragraph.length) return;
      const p = document.createElement("p");
      p.innerHTML = renderInline(paragraph.join("\n")).replace(/\n/g, "<br>");
      container.append(p);
      paragraph = [];
    };
    const flushList = () => {
      if (!list.length) return;
      const ul = document.createElement("ul");
      for (const item of list) {
        const li = document.createElement("li");
        li.innerHTML = renderInline(item);
        ul.append(li);
      }
      container.append(ul);
      list = [];
    };
    for (const line of lines) {
      const heading = line.match(/^(#{1,3})\s+(.+)$/);
      const bullet = line.match(/^[-*]\s+(.+)$/);
      if (heading) {
        flushParagraph();
        flushList();
        const element = document.createElement(heading[1].length === 1 ? "h2" : "h3");
        element.innerHTML = renderInline(heading[2]);
        container.append(element);
      } else if (bullet) {
        flushParagraph();
        list.push(bullet[1]);
      } else if (!line.trim()) {
        flushParagraph();
        flushList();
      } else {
        flushList();
        paragraph.push(line);
      }
    }
    flushParagraph();
    flushList();
  }

  function renderPreview() {
    elements.previewTitle.textContent = state.title.trim() || "旅先で見つけたもの";
    elements.previewDate.textContent = state.date || "今日";
    elements.previewBody.replaceChildren();
    let hasContent = false;
    for (const block of state.blocks) {
      if (block.type === "text" && block.text.trim()) {
        hasContent = true;
        renderMarkdown(elements.previewBody, block.text);
      } else if (block.type === "image") {
        const record = assets.get(block.assetId);
        const url = objectUrls.get(block.assetId);
        if (!record || !url) continue;
        hasContent = true;
        const figure = document.createElement("figure");
        figure.className = "preview__figure";
        const image = document.createElement("img");
        image.src = url;
        image.alt = block.alt;
        figure.append(image);
        if (block.title.trim()) {
          const caption = document.createElement("figcaption");
          caption.textContent = block.title;
          figure.append(caption);
        }
        elements.previewBody.append(figure);
      }
    }
    if (!hasContent) {
      const placeholder = document.createElement("p");
      placeholder.className = "preview__lead";
      placeholder.textContent = "文章と写真は、GitHubへ保存するまでこの端末だけに残ります。";
      elements.previewBody.append(placeholder);
    }
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character]);
  }

  function syncFormFromState() {
    elements.title.value = state.title;
    elements.date.value = state.date;
    elements.slug.value = state.slug;
    elements.draft.checked = state.draft;
    for (const checkbox of elements.categories) checkbox.checked = state.categories.includes(checkbox.value);
    updatePublishLabel();
  }

  function updatePublishLabel() {
    elements.publish.textContent = state.draft ? "GitHubへ保存" : "ブログへ公開";
  }

  function confirmAction(title, message) {
    elements.confirmTitle.textContent = title;
    elements.confirmMessage.textContent = message;
    elements.confirmDialog.showModal();
    return new Promise(resolve => {
      elements.confirmDialog.addEventListener("close", () => resolve(elements.confirmDialog.returnValue === "confirm"), { once: true });
    });
  }

  function sanitizeSlug(value) {
    return value.trim().replace(/^\/+|\/+$/g, "");
  }

  function fileStem() {
    const date = state.date.replaceAll("-", "") || localToday().replaceAll("-", "");
    const source = sanitizeSlug(state.slug) || state.title.trim();
    const safe = source.normalize("NFKC")
      .replace(/[<>:"/\\|?*\u0000-\u001F]+/g, "-")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 90);
    return `${date}-${safe || "blog"}`;
  }

  function yamlString(value) {
    return JSON.stringify(String(value));
  }

  function escapeMarkdownAlt(value) {
    return value.replace(/\\/g, "\\\\").replace(/\]/g, "\\]").replace(/\n/g, " ");
  }

  function escapeMarkdownTitle(value) {
    return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, " ");
  }

  function publicationFiles() {
    const stem = fileStem();
    const articlePath = state.publishedPath || `src/posts/${stem}.mdx`;
    const imageBlocks = state.blocks.filter(block => block.type === "image" && assets.has(block.assetId));
    const imagePaths = new Map();
    imageBlocks.forEach(block => {
      if (imagePaths.has(block.assetId)) return;
      const record = assets.get(block.assetId);
      const suffix = String(imagePaths.size + 1).padStart(2, "0");
      imagePaths.set(block.assetId, `static/images/blog/${stem}-${suffix}-${record.name}`);
    });

    const frontmatter = [
      "---",
      `title: ${yamlString(state.title.trim())}`,
      `date: ${state.date}`,
      `draft: ${state.draft ? "true" : "false"}`,
    ];
    if (sanitizeSlug(state.slug)) frontmatter.push(`slug: ${yamlString(sanitizeSlug(state.slug))}`);
    if (state.categories.length) {
      frontmatter.push("categories:");
      for (const category of state.categories) frontmatter.push(`  - ${category}`);
    } else {
      frontmatter.push("categories: []");
    }
    frontmatter.push("---", "");

    const body = [];
    for (const block of state.blocks) {
      if (block.type === "text" && block.text.trim()) {
        body.push(block.text.trim(), "");
      } else if (block.type === "image" && imagePaths.has(block.assetId)) {
        const publicPath = imagePaths.get(block.assetId).replace(/^static/, "");
        const title = block.title.trim() ? ` "${escapeMarkdownTitle(block.title.trim())}"` : "";
        body.push(`![${escapeMarkdownAlt(block.alt.trim())}](${publicPath}${title})`, "");
      }
    }

    return {
      articlePath,
      articleText: `${frontmatter.join("\n")}${body.join("\n").trim()}\n`,
      images: Array.from(imagePaths, ([assetId, path]) => ({ assetId, path, record: assets.get(assetId) })),
    };
  }

  function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let offset = 0; offset < bytes.length; offset += 32768) {
      binary += String.fromCharCode(...bytes.subarray(offset, offset + 32768));
    }
    return btoa(binary);
  }

  async function githubApi(path, options = {}) {
    const response = await fetch(`https://api.github.com/repos/${REPO}${path}`, {
      ...options,
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${githubToken}`,
        "X-GitHub-Api-Version": "2022-11-28",
        ...(options.headers || {}),
      },
    });
    if (!response.ok) {
      const details = await response.json().catch(() => ({}));
      const error = new Error(details.message || `GitHub APIエラー (${response.status})`);
      error.status = response.status;
      throw error;
    }
    return response.status === 204 ? null : response.json();
  }

  function connectGitHub() {
    if (githubToken) return Promise.resolve(githubToken);
    return new Promise((resolve, reject) => {
      let settled = false;
      const popup = window.open(`${AUTH_ORIGIN}/auth`, "chiyoji-writer-github", "popup,width=720,height=760");
      if (!popup) {
        reject(new Error("GitHubログイン画面を開けませんでした。ポップアップを許可してください。"));
        return;
      }
      const finish = (error, token) => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeout);
        window.clearInterval(closed);
        window.removeEventListener("message", receive);
        if (!popup.closed) popup.close();
        if (error) reject(error); else resolve(token);
      };
      const receive = event => {
        if (event.origin !== AUTH_ORIGIN || event.source !== popup || typeof event.data !== "string") return;
        if (event.data === "authorizing:github") {
          popup.postMessage("chiyoji-writer-ready", AUTH_ORIGIN);
          return;
        }
        const prefix = "authorization:github:success:";
        if (!event.data.startsWith(prefix)) return;
        try {
          const result = JSON.parse(event.data.slice(prefix.length));
          if (!result.token) throw new Error("GitHubトークンを受け取れませんでした。");
          githubToken = result.token;
          finish(null, githubToken);
        } catch (error) {
          finish(error);
        }
      };
      const timeout = window.setTimeout(() => finish(new Error("GitHubログインが時間切れになりました。")), 5 * 60 * 1000);
      const closed = window.setInterval(() => {
        if (popup.closed) finish(new Error("GitHubログインがキャンセルされました。"));
      }, 500);
      window.addEventListener("message", receive);
    });
  }

  async function createBlob(content, encoding = "utf-8") {
    return githubApi("/git/blobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, encoding }),
    });
  }

  async function commitPublication(files) {
    const ref = await githubApi(`/git/ref/heads/${BRANCH}`);
    const parentSha = ref.object.sha;
    const parent = await githubApi(`/git/commits/${parentSha}`);
    const entries = [];

    for (let index = 0; index < files.images.length; index += 1) {
      const image = files.images[index];
      showToast(`${index + 1}/${files.images.length}枚目をGitHubへ準備しています…`, "normal", 0);
      const content = arrayBufferToBase64(await image.record.blob.arrayBuffer());
      const blob = await createBlob(content, "base64");
      entries.push({ path: image.path, mode: "100644", type: "blob", sha: blob.sha });
    }

    const articleBlob = await createBlob(files.articleText);
    entries.push({ path: files.articlePath, mode: "100644", type: "blob", sha: articleBlob.sha });
    for (const oldPath of state.publishedAssetPaths || []) {
      if (!files.images.some(image => image.path === oldPath)) entries.push({ path: oldPath, mode: "100644", type: "blob", sha: null });
    }
    if (state.publishedPath && state.publishedPath !== files.articlePath) {
      entries.push({ path: state.publishedPath, mode: "100644", type: "blob", sha: null });
    }

    const tree = await githubApi("/git/trees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base_tree: parent.tree.sha, tree: entries }),
    });
    const commit = await githubApi("/git/commits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `${state.draft ? "Save draft" : "Publish post"} “${state.title.trim()}”`,
        tree: tree.sha,
        parents: [parentSha],
      }),
    });
    await githubApi(`/git/refs/heads/${BRANCH}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sha: commit.sha, force: false }),
    });
    return commit;
  }

  async function publish() {
    if (publishing) return;
    if (!state.title.trim()) {
      elements.title.focus();
      showToast("タイトルを入力してください。", "error");
      return;
    }
    if (!state.date) {
      elements.date.focus();
      showToast("公開日を入力してください。", "error");
      return;
    }
    if (state.slug && !/^[a-z0-9][a-z0-9-]*$/.test(sanitizeSlug(state.slug))) {
      elements.slug.focus();
      showToast("URLは半角英小文字・数字・ハイフンで入力してください。", "error", 7000);
      return;
    }
    const files = publicationFiles();
    const confirmed = await confirmAction(
      state.draft ? "下書きをGitHubへ保存しますか？" : "ブログへ公開しますか？",
      state.draft
        ? "記事と画像を1つのコミットで保存します。通常のブログには表示されません。"
        : "記事と画像を1つのコミットで公開します。完了後、サイトの反映まで数分かかります。",
    );
    if (!confirmed) return;

    publishing = true;
    elements.publish.disabled = true;
    elements.newDraft.disabled = true;
    try {
      await saveDraftNow();
      showToast("GitHubへログインしています…", "normal", 0);
      await connectGitHub();
      const commit = await commitPublication(files);
      state.publishedPath = files.articlePath;
      state.publishedAssetPaths = files.images.map(image => image.path);
      state.lastCommitSha = commit.sha;
      await saveDraftNow();
      elements.saveState.textContent = "GitHubへ保存済み";
      showToast(
        state.draft
          ? "下書きを保存しました。数分後に合言葉付きプレビューへ反映されます。"
          : "公開しました。数分後にブログへ反映されます。",
        "done",
        10000,
      );
    } catch (error) {
      const message = error.status === 422
        ? "別の更新が先に保存されました。少し待ってからもう一度押してください。"
        : error.message || "GitHubへの保存に失敗しました。";
      showToast(message, "error", 12000);
    } finally {
      publishing = false;
      elements.publish.disabled = false;
      elements.newDraft.disabled = false;
    }
  }

  async function startNewDraft() {
    const hasContent = state.title.trim() || state.blocks.some(block => block.type === "image" || block.text?.trim());
    if (hasContent) {
      const confirmed = await confirmAction("新しい下書きを始めますか？", "現在の端末内下書きと画像は削除されます。GitHubへ保存済みの記事は削除されません。");
      if (!confirmed) return;
    }
    await clearLocalDraft();
    state = createEmptyDraft();
    syncFormFromState();
    renderBlocks();
    renderPreview();
    await saveDraftNow();
    elements.saveState.textContent = "新しい下書きを端末に保存済み";
    elements.title.focus();
  }

  function bindEvents() {
    elements.title.addEventListener("input", () => { state.title = elements.title.value; renderPreview(); scheduleSave(); });
    elements.date.addEventListener("input", () => { state.date = elements.date.value; renderPreview(); scheduleSave(); });
    elements.slug.addEventListener("input", () => { state.slug = elements.slug.value; scheduleSave(); });
    elements.draft.addEventListener("change", () => { state.draft = elements.draft.checked; updatePublishLabel(); scheduleSave(); });
    for (const checkbox of elements.categories) {
      checkbox.addEventListener("change", () => {
        state.categories = elements.categories.filter(input => input.checked).map(input => input.value);
        scheduleSave();
      });
    }
    elements.dropzone.addEventListener("click", () => elements.imageInput.click());
    elements.dropzone.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        elements.imageInput.click();
      }
    });
    elements.imageInput.addEventListener("change", () => addImages(elements.imageInput.files));
    for (const eventName of ["dragenter", "dragover"]) {
      elements.dropzone.addEventListener(eventName, event => {
        event.preventDefault();
        elements.dropzone.classList.add("is-dragging");
      });
    }
    for (const eventName of ["dragleave", "drop"]) {
      elements.dropzone.addEventListener(eventName, event => {
        event.preventDefault();
        elements.dropzone.classList.remove("is-dragging");
      });
    }
    elements.dropzone.addEventListener("drop", event => addImages(event.dataTransfer.files));
    elements.addText.addEventListener("click", addTextBlock);
    elements.newDraft.addEventListener("click", startNewDraft);
    elements.publish.addEventListener("click", publish);
  }

  async function initialize() {
    try {
      database = await openDatabase();
      await loadLocalDraft();
      syncFormFromState();
      renderBlocks();
      renderPreview();
      bindEvents();
      elements.saveState.textContent = state.updatedAt
        ? `端末に保存済み ${new Date(state.updatedAt).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}`
        : "この端末に自動保存";
      await saveDraftNow();
    } catch (error) {
      elements.saveState.textContent = "端末保存を利用できません";
      showToast(error.message || "端末保存を開始できませんでした。", "error", 12000);
    }
  }

  initialize();
})();
