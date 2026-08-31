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

  function dateInputStyle() {
    return "width:132px;padding:6px 8px;border:1px solid #aebbc1;border-radius:6px;background:#fff;color:#253238;font:inherit";
  }

  function dateKey(value) {
    return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value.replaceAll("-", "") : "";
  }

  function isDateInRange(date, from, to) {
    if (date.key === "unknown") return !from && !to;
    const fromKey = dateKey(from);
    const toKey = dateKey(to);
    return (!fromKey || date.key >= fromKey) && (!toKey || date.key <= toKey);
  }

  function ensureToolbar(dialog, grid, fileTypes) {
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
        <div role="group" aria-label="写真の日付範囲" style="${controlStyle}">
          <span>日付</span>
          <label style="${controlStyle}">開始
            <input type="date" data-control="date-from" aria-label="開始日" style="${dateInputStyle()}">
          </label>
          <span aria-hidden="true">〜</span>
          <label style="${controlStyle}">終了
            <input type="date" data-control="date-to" aria-label="終了日" style="${dateInputStyle()}">
          </label>
        </div>
        <label style="${controlStyle}">種類
          <select data-control="type" aria-label="写真をファイル種類で絞り込む" style="${selectStyle()}"></select>
        </label>
        <button type="button" data-reset style="padding:7px 11px;border:1px solid #aebbc1;border-radius:6px;background:#fff;color:#253238;font:inherit;cursor:pointer">解除</button>
        <span data-count style="margin-left:auto;color:#5f6f76;white-space:nowrap"></span>
      `;
      const anchor = grid.parentElement;
      anchor.insertBefore(toolbar, grid);
      toolbar.addEventListener("change", (event) => {
        const control = event.target;
        if (!(control instanceof HTMLSelectElement || control instanceof HTMLInputElement)) return;
        if (control.dataset.control === "sort") dialog.dataset.chiyojiMediaSort = control.value;
        if (control.dataset.control === "date-from") dialog.dataset.chiyojiMediaDateFrom = control.value;
        if (control.dataset.control === "date-to") dialog.dataset.chiyojiMediaDateTo = control.value;
        if (control.dataset.control === "type") dialog.dataset.chiyojiMediaType = control.value;
        organizeDialog(dialog);
      });
      toolbar.querySelector("[data-reset]").addEventListener("click", () => {
        dialog.dataset.chiyojiMediaSort = "date-desc";
        dialog.dataset.chiyojiMediaDateFrom = "";
        dialog.dataset.chiyojiMediaDateTo = "";
        dialog.dataset.chiyojiMediaType = "all";
        organizeDialog(dialog);
      });
    }

    const sortSelect = toolbar.querySelector('[data-control="sort"]');
    const dateFromInput = toolbar.querySelector('[data-control="date-from"]');
    const dateToInput = toolbar.querySelector('[data-control="date-to"]');
    const typeSelect = toolbar.querySelector('[data-control="type"]');
    setSelectOptions(typeSelect, fileTypes, "すべての種類");

    const requested = {
      sort: dialog.dataset.chiyojiMediaSort || "date-desc",
      dateFrom: dialog.dataset.chiyojiMediaDateFrom || "",
      dateTo: dialog.dataset.chiyojiMediaDateTo || "",
      type: dialog.dataset.chiyojiMediaType || "all",
    };
    if (!SORT_LABELS[requested.sort]) requested.sort = "date-desc";
    if (!dateKey(requested.dateFrom)) requested.dateFrom = "";
    if (!dateKey(requested.dateTo)) requested.dateTo = "";
    if (!Array.from(typeSelect.options).some((option) => option.value === requested.type)) requested.type = "all";
    for (const [key, value] of Object.entries(requested)) {
      dialog.dataset[`chiyojiMedia${key[0].toUpperCase()}${key.slice(1)}`] = value;
    }
    sortSelect.value = requested.sort;
    dateFromInput.value = requested.dateFrom;
    dateToInput.value = requested.dateTo;
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

  function originalPosition(wrapper) {
    const currentLeft = wrapper.style.left;
    const currentTop = wrapper.style.top;
    const assignedLeft = wrapper.dataset.chiyojiAssignedLeft;
    const assignedTop = wrapper.dataset.chiyojiAssignedTop;
    if (
      wrapper.dataset.chiyojiOriginalLeft === undefined ||
      (assignedLeft !== undefined && currentLeft !== assignedLeft) ||
      (assignedTop !== undefined && currentTop !== assignedTop)
    ) {
      wrapper.dataset.chiyojiOriginalLeft = currentLeft;
      wrapper.dataset.chiyojiOriginalTop = currentTop;
    }
    return {
      left: wrapper.dataset.chiyojiOriginalLeft,
      top: wrapper.dataset.chiyojiOriginalTop,
    };
  }

  function positionEntries(entries, sortedVisible, topOffset) {
    const slots = entries
      .map(({ wrapper }) => originalPosition(wrapper))
      .map(({ left, top }) => ({
        left,
        top,
        leftNumber: Number.parseFloat(left) || 0,
        topNumber: Number.parseFloat(top) || 0,
      }))
      .sort((left, right) => left.topNumber - right.topNumber || left.leftNumber - right.leftNumber);

    sortedVisible.forEach((entry, index) => {
      const slot = slots[index];
      if (!slot) return;
      entry.wrapper.style.left = slot.left;
      entry.wrapper.style.top = `${slot.topNumber + topOffset}px`;
      entry.wrapper.dataset.chiyojiAssignedLeft = entry.wrapper.style.left;
      entry.wrapper.dataset.chiyojiAssignedTop = entry.wrapper.style.top;
    });
  }

  function organizeDialog(dialog) {
    const { grid, entries } = findMediaEntries(dialog);
    if (!grid || !entries.length) return;

    const datedEntries = entries.filter(({ name }) => name !== ".gitkeep");
    const fileTypes = Array.from(new Map(
      datedEntries
        .map(({ fileType }) => fileType)
        .sort((left, right) => left.label.localeCompare(right.label, "ja"))
        .map((fileType) => [fileType.key, fileType]),
    ).values());
    const toolbar = ensureToolbar(dialog, grid, fileTypes);
    const selectedSort = dialog.dataset.chiyojiMediaSort || "date-desc";
    const selectedDateFrom = dialog.dataset.chiyojiMediaDateFrom || "";
    const selectedDateTo = dialog.dataset.chiyojiMediaDateTo || "";
    const selectedType = dialog.dataset.chiyojiMediaType || "all";
    const sorted = sortEntries(datedEntries, selectedSort);
    const visibleEntries = sorted.filter(({ date, fileType }) => (
      isDateInRange(date, selectedDateFrom, selectedDateTo) &&
      (selectedType === "all" || fileType.key === selectedType)
    ));
    const toolbarOffset = Math.ceil(toolbar.getBoundingClientRect().height) + 10;
    grid.style.boxSizing = "content-box";
    grid.style.paddingBottom = `${toolbarOffset}px`;
    positionEntries(entries, visibleEntries, toolbarOffset);
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

  window.ChiyojiMediaOrganizer = Object.freeze({ dateFromName, fileTypeFromName, isDateInRange, sortEntries });
})();
