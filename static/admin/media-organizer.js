(() => {
  "use strict";

  const IMAGE_NAME = /\.(jpe?g|png|webp|gif|svg)$/i;
  const FILE_TYPE_LABELS = Object.freeze({
    webp: "WebP",
    jpeg: "JPEG",
    png: "PNG",
    gif: "GIF",
    svg: "SVG",
  });
  const SORT_LABELS = Object.freeze({
    "date-desc": "日付（新しい順）",
    "date-asc": "日付（古い順）",
    "name-asc": "名前（昇順）",
    "name-desc": "名前（降順）",
  });
  const organizerClass = "chiyoji-media-organizer";
  let scanScheduled = false;

  function compactText(element) {
    return (element?.textContent || "").replace(/\s+/g, " ").trim();
  }

  function mediaDialog(element) {
    if (!(element instanceof Element)) return null;
    const dialog = element.closest('[role="dialog"], [aria-modal="true"]');
    if (!dialog) return null;
    const text = compactText(dialog);
    return /メディア|画像|media|image/i.test(text) && /アップロード|upload/i.test(text) ? dialog : null;
  }

  function dateFromName(name) {
    const match = name.match(/^((?:19|20)\d{2})(0[1-9]|1[0-2])([0-2]\d|3[01])(?:[_-]?(\d{2})(\d{2})(\d{2})?)?/);
    if (!match) {
      return { key: "unknown", label: "日付不明", sortKey: `00000000-${name}` };
    }

    const [, year, month, day, hour = "00", minute = "00", second = "00"] = match;
    return {
      key: `${year}${month}${day}`,
      label: `${year}/${month}/${day}`,
      sortKey: `${year}${month}${day}${hour}${minute}${second}-${name}`,
    };
  }

  function fileTypeFromName(name) {
    const extension = name.match(/\.([^.]+)$/)?.[1]?.toLowerCase() || "";
    const key = extension === "jpg" || extension === "jpeg" ? "jpeg" : extension;
    return { key, label: FILE_TYPE_LABELS[key] || extension.toUpperCase() || "不明" };
  }

  function findMediaEntries(dialog) {
    const labels = Array.from(dialog.querySelectorAll("p"))
      .map((label) => ({
        label,
        name: compactText(label),
        card: label.parentElement,
        wrapper: label.parentElement?.parentElement,
      }))
      .filter(({ name, card, wrapper }) => card && wrapper && (IMAGE_NAME.test(name) || name === ".gitkeep"));

    if (!labels.length) return { grid: null, entries: [] };

    const parentCounts = new Map();
    for (const { wrapper } of labels) {
      const parent = wrapper.parentElement;
      if (parent) parentCounts.set(parent, (parentCounts.get(parent) || 0) + 1);
    }
    const grid = Array.from(parentCounts).sort((left, right) => right[1] - left[1])[0]?.[0] || null;
    const entries = labels
      .filter(({ wrapper }) => wrapper.parentElement === grid)
      .map((entry) => ({
        ...entry,
        date: dateFromName(entry.name),
        fileType: fileTypeFromName(entry.name),
      }));
    return { grid, entries };
  }

  function setSelectOptions(select, options, allLabel) {
    const signature = options.map(({ key, label }) => `${key}:${label}`).join(",");
    if (select.dataset.signature === signature) return;

    const selected = select.value || "all";
    select.replaceChildren(new Option(allLabel, "all"));
    for (const option of options) select.add(new Option(option.label, option.key));
    if (Array.from(select.options).some((option) => option.value === selected)) select.value = selected;
    select.dataset.signature = signature;
  }

  function selectStyle() {
    return "min-width:142px;padding:7px 30px 7px 10px;border:1px solid #aebbc1;border-radius:6px;background:#fff;color:#253238";
  }

  function ensureToolbar(dialog, grid, dates, fileTypes) {
    let toolbar = dialog.querySelector(`.${organizerClass}`);
    if (!toolbar) {
      toolbar = document.createElement("div");
      toolbar.className = organizerClass;
      Object.assign(toolbar.style, {
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "10px",
        margin: "0 0 14px",
        padding: "10px 12px",
        border: "1px solid #d7dee2",
        borderRadius: "8px",
        background: "#f7faf9",
        color: "#253238",
        font: "600 13px/1.4 system-ui, sans-serif",
        position: "sticky",
        top: "0",
        zIndex: "5",
      });
      const controlStyle = "display:flex;align-items:center;gap:7px";
      toolbar.innerHTML = `
        <label style="${controlStyle}">並び替え
          <select data-control="sort" aria-label="写真の並び替え" style="${selectStyle()}">
            <option value="date-desc">日付（新しい順）</option>
            <option value="date-asc">日付（古い順）</option>
            <option value="name-asc">名前（昇順）</option>
            <option value="name-desc">名前（降順）</option>
          </select>
        </label>
        <label style="${controlStyle}">日付
          <select data-control="date" aria-label="写真を日付で絞り込む" style="${selectStyle()}"></select>
        </label>
        <label style="${controlStyle}">種類
          <select data-control="type" aria-label="写真をファイル種類で絞り込む" style="${selectStyle()}"></select>
        </label>
        <button type="button" data-reset style="padding:7px 11px;border:1px solid #aebbc1;border-radius:6px;background:#fff;color:#253238;font:inherit;cursor:pointer">解除</button>
        <span data-count style="margin-left:auto;color:#5f6f76;white-space:nowrap"></span>
      `;
      const anchor = grid.parentElement;
      anchor.insertBefore(toolbar, grid);
      toolbar.addEventListener("change", (event) => {
        const select = event.target;
        if (!(select instanceof HTMLSelectElement)) return;
        if (select.dataset.control === "sort") dialog.dataset.chiyojiMediaSort = select.value;
        if (select.dataset.control === "date") dialog.dataset.chiyojiMediaDate = select.value;
        if (select.dataset.control === "type") dialog.dataset.chiyojiMediaType = select.value;
        organizeDialog(dialog);
      });
      toolbar.querySelector("[data-reset]").addEventListener("click", () => {
        dialog.dataset.chiyojiMediaSort = "date-desc";
        dialog.dataset.chiyojiMediaDate = "all";
        dialog.dataset.chiyojiMediaType = "all";
        organizeDialog(dialog);
      });
    }

    const sortSelect = toolbar.querySelector('[data-control="sort"]');
    const dateSelect = toolbar.querySelector('[data-control="date"]');
    const typeSelect = toolbar.querySelector('[data-control="type"]');
    setSelectOptions(dateSelect, dates, "すべての日付");
    setSelectOptions(typeSelect, fileTypes, "すべての種類");

    const requested = {
      sort: dialog.dataset.chiyojiMediaSort || "date-desc",
      date: dialog.dataset.chiyojiMediaDate || "all",
      type: dialog.dataset.chiyojiMediaType || "all",
    };
    if (!SORT_LABELS[requested.sort]) requested.sort = "date-desc";
    if (!Array.from(dateSelect.options).some((option) => option.value === requested.date)) requested.date = "all";
    if (!Array.from(typeSelect.options).some((option) => option.value === requested.type)) requested.type = "all";
    for (const [key, value] of Object.entries(requested)) {
      dialog.dataset[`chiyojiMedia${key[0].toUpperCase()}${key.slice(1)}`] = value;
    }
    sortSelect.value = requested.sort;
    dateSelect.value = requested.date;
    typeSelect.value = requested.type;
    return toolbar;
  }

  function sortEntries(entries, mode) {
    const [field, direction] = mode.split("-");
    const multiplier = direction === "desc" ? -1 : 1;
    return [...entries].sort((left, right) => {
      const leftValue = field === "name" ? left.name : left.date.sortKey;
      const rightValue = field === "name" ? right.name : right.date.sortKey;
      return leftValue.localeCompare(rightValue, "ja", { numeric: true, sensitivity: "base" }) * multiplier;
    });
  }

  function addDateBadge(card, date) {
    let badge = card.querySelector(":scope > .chiyoji-media-date-badge");
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "chiyoji-media-date-badge";
      Object.assign(badge.style, {
        position: "absolute",
        top: "8px",
        left: "8px",
        zIndex: "2",
        padding: "4px 7px",
        borderRadius: "999px",
        background: "rgba(19, 35, 39, 0.82)",
        color: "#fff",
        font: "700 11px/1.2 system-ui, sans-serif",
        pointerEvents: "none",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
      });
      card.appendChild(badge);
    }
    if (badge.textContent !== date.label) badge.textContent = date.label;
  }

  function setEntryVisible(entry, visible) {
    const element = entry.wrapper;
    if (element.dataset.chiyojiOriginalDisplay === undefined) {
      element.dataset.chiyojiOriginalDisplay = element.style.display || "";
    }
    element.hidden = !visible;
    element.style.display = visible ? element.dataset.chiyojiOriginalDisplay : "none";
  }

  function positionEntries(entries, sortedVisible) {
    const slots = entries
      .map(({ wrapper }) => ({
        left: wrapper.style.left,
        top: wrapper.style.top,
        leftNumber: Number.parseFloat(wrapper.style.left) || 0,
        topNumber: Number.parseFloat(wrapper.style.top) || 0,
      }))
      .sort((left, right) => left.topNumber - right.topNumber || left.leftNumber - right.leftNumber);

    sortedVisible.forEach((entry, index) => {
      const slot = slots[index];
      if (!slot) return;
      entry.wrapper.style.left = slot.left;
      entry.wrapper.style.top = slot.top;
    });
  }

  function organizeDialog(dialog) {
    const { grid, entries } = findMediaEntries(dialog);
    if (!grid || !entries.length) return;

    const datedEntries = entries.filter(({ name }) => name !== ".gitkeep");
    const dates = Array.from(new Map(
      datedEntries
        .map(({ date }) => date)
        .sort((left, right) => right.sortKey.localeCompare(left.sortKey))
        .map((date) => [date.key, date]),
    ).values());
    const fileTypes = Array.from(new Map(
      datedEntries
        .map(({ fileType }) => fileType)
        .sort((left, right) => left.label.localeCompare(right.label, "ja"))
        .map((fileType) => [fileType.key, fileType]),
    ).values());
    const toolbar = ensureToolbar(dialog, grid, dates, fileTypes);
    const selectedSort = dialog.dataset.chiyojiMediaSort || "date-desc";
    const selectedDate = dialog.dataset.chiyojiMediaDate || "all";
    const selectedType = dialog.dataset.chiyojiMediaType || "all";
    const sorted = sortEntries(datedEntries, selectedSort);
    const visibleEntries = sorted.filter(({ date, fileType }) => (
      (selectedDate === "all" || date.key === selectedDate) &&
      (selectedType === "all" || fileType.key === selectedType)
    ));
    positionEntries(entries, visibleEntries);
    const visibleCards = new Set(visibleEntries.map(({ card }) => card));

    for (const entry of entries) {
      if (entry.name === ".gitkeep") {
        setEntryVisible(entry, false);
        continue;
      }
      entry.card.style.position = "relative";
      entry.card.style.removeProperty("order");
      setEntryVisible(entry, visibleCards.has(entry.card));
      addDateBadge(entry.card, entry.date);
    }

    const visibleCount = visibleEntries.length;
    const countLabel = `${visibleCount}/${sorted.length}枚・${SORT_LABELS[selectedSort]}`;
    const countElement = toolbar.querySelector("[data-count]");
    if (countElement.textContent !== countLabel) countElement.textContent = countLabel;
  }

  function scan() {
    scanScheduled = false;
    document.querySelectorAll('[role="dialog"], [aria-modal="true"]').forEach((dialog) => {
      if (mediaDialog(dialog) === dialog) organizeDialog(dialog);
    });
  }

  function scheduleScan() {
    if (scanScheduled) return;
    scanScheduled = true;
    window.requestAnimationFrame(scan);
  }

  new MutationObserver(scheduleScan).observe(document.documentElement, { childList: true, subtree: true });
  scheduleScan();

  window.ChiyojiMediaOrganizer = Object.freeze({ dateFromName, fileTypeFromName, sortEntries });
})();
