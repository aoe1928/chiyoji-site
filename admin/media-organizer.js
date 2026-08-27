(() => {
  "use strict";

  const IMAGE_NAME = /\.(jpe?g|png|webp|gif|svg)$/i;
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
    return /メディア|media/i.test(text) && /アップロード|upload/i.test(text) ? dialog : null;
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

  function findMediaEntries(dialog) {
    const labels = Array.from(dialog.querySelectorAll("p"))
      .map((label) => ({ label, name: compactText(label), card: label.parentElement }))
      .filter(({ name, card }) => card && (IMAGE_NAME.test(name) || name === ".gitkeep"));

    if (!labels.length) return { grid: null, entries: [] };

    const parentCounts = new Map();
    for (const { card } of labels) {
      const parent = card.parentElement;
      if (parent) parentCounts.set(parent, (parentCounts.get(parent) || 0) + 1);
    }
    const grid = Array.from(parentCounts).sort((left, right) => right[1] - left[1])[0]?.[0] || null;
    const entries = labels
      .filter(({ card }) => card.parentElement === grid)
      .map((entry) => ({ ...entry, date: dateFromName(entry.name) }));
    return { grid, entries };
  }

  function setSelectOptions(select, dates) {
    const signature = dates.map(({ key }) => key).join(",");
    if (select.dataset.signature === signature) return;

    const selected = select.value || "all";
    select.replaceChildren(new Option("すべての日付", "all"));
    for (const date of dates) select.add(new Option(date.label, date.key));
    if (Array.from(select.options).some((option) => option.value === selected)) select.value = selected;
    select.dataset.signature = signature;
  }

  function ensureToolbar(dialog, grid, dates) {
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
      });
      toolbar.innerHTML = '<label style="display:flex;align-items:center;gap:8px">撮影日 <select aria-label="写真を日付で絞り込む" style="min-width:160px;padding:7px 30px 7px 10px;border:1px solid #aebbc1;border-radius:6px;background:#fff;color:#253238"></select></label><span data-count style="margin-left:auto;color:#5f6f76"></span>';
      const anchor = grid.parentElement;
      anchor.insertBefore(toolbar, grid);
      toolbar.querySelector("select").addEventListener("change", (event) => {
        dialog.dataset.chiyojiMediaDate = event.target.value;
        organizeDialog(dialog);
      });
    }

    setSelectOptions(toolbar.querySelector("select"), dates);
    const requestedDate = dialog.dataset.chiyojiMediaDate || "all";
    if (!Array.from(toolbar.querySelector("select").options).some((option) => option.value === requestedDate)) {
      dialog.dataset.chiyojiMediaDate = "all";
      toolbar.querySelector("select").value = "all";
    }
    return toolbar;
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
    const toolbar = ensureToolbar(dialog, grid, dates);
    const selectedDate = dialog.dataset.chiyojiMediaDate || "all";
    const sorted = [...datedEntries].sort((left, right) => right.date.sortKey.localeCompare(left.date.sortKey));

    for (const entry of entries) {
      if (entry.name === ".gitkeep") {
        entry.card.hidden = true;
        continue;
      }
      entry.card.style.position = "relative";
      entry.card.style.order = String(sorted.indexOf(entry));
      entry.card.hidden = selectedDate !== "all" && entry.date.key !== selectedDate;
      addDateBadge(entry.card, entry.date);
    }

    const visibleCount = sorted.filter(({ date }) => selectedDate === "all" || date.key === selectedDate).length;
    const countLabel = `${visibleCount}枚・新しい順`;
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

  window.ChiyojiMediaOrganizer = Object.freeze({ dateFromName });
})();
