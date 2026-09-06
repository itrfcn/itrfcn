function initTooltip() {
  const tooltip = document.querySelector(".custom-tooltip");
  if (!tooltip) return;

  let hideTimer = null;
  const hasHover = matchMedia("(hover: hover)").matches;

  // 保证默认内联属性存在
  tooltip.style.maxWidth ||= "200px";
  tooltip.style.whiteSpace ||= "pre-wrap";
  tooltip.style.overflowWrap ||= "break-word";
  tooltip.style.opacity ||= "0";

  // 当前激活的目标与冻结位置
  let activeTarget = null;
  let frozenPos = { top: null, left: null };

  function computePosition(el) {
    // 先移出视口，避免测量受当前位置影响
    tooltip.style.top = "-9999px";
    tooltip.style.left = "-9999px";
    tooltip.classList.remove("bottom");
    void tooltip.offsetHeight; // 强制 reflow

    const rect = el.getBoundingClientRect();
    const ttRect = tooltip.getBoundingClientRect();
    const offset = 10;

    let top = rect.top - ttRect.height - offset; // 默认在上方
    if (rect.top <= ttRect.height + offset) {
      tooltip.classList.add("bottom");
      top = rect.bottom + offset; // 改为下方
    }

    let left = rect.left + rect.width / 2 - ttRect.width / 2;
    const minPad = 8;
    left = Math.max(minPad, Math.min(left, window.innerWidth - ttRect.width - minPad));

    return { top: Math.round(top), left: Math.round(left) };
  }

  function applyFrozen() {
    if (frozenPos.top == null || frozenPos.left == null) return;
    tooltip.style.top = `${frozenPos.top}px`;
    tooltip.style.left = `${frozenPos.left}px`;
  }

  function showTooltip(el, text) {
    clearTimeout(hideTimer);
    activeTarget = el;
    tooltip.textContent = text;
    tooltip.style.opacity = "1";

    // 仅计算一次位置并“冻结”，后续滚动不再更新
    frozenPos = computePosition(el);
    applyFrozen();
  }

  function hideTooltip() {
    hideTimer = setTimeout(() => {
      tooltip.style.opacity = "0";
      tooltip.classList.remove("bottom");
      activeTarget = null;
      frozenPos = { top: null, left: null };
    }, 80);
  }

  function bindTargets(root = document) {
    root.querySelectorAll("[gbtip], [data-tooltip]").forEach(el => {
      if (el.dataset.tooltipBound) return; // 防止重复绑定
      el.dataset.tooltipBound = "true";

      const tipText = el.getAttribute("gbtip") || el.getAttribute("data-tooltip");
      if (!tipText) return;

      if (hasHover) {
        el.addEventListener("mouseenter", () => showTooltip(el, tipText));
        el.addEventListener("mouseleave", hideTooltip);
      } else {
        el.addEventListener("touchstart", () => {
          showTooltip(el, tipText);
          clearTimeout(hideTimer);
          hideTimer = setTimeout(hideTooltip, 1500); // 触屏自动隐藏
        }, { passive: true });

        el.addEventListener("touchend", hideTooltip, { passive: true });
      }
    });
  }

  // 全局滚动/缩放：固定元素保持显示；普通元素移出视口则隐藏；不更新位置
  function onViewportChange() {
    if (!activeTarget || tooltip.style.opacity === "0" || !activeTarget.isConnected) return;

    const rect = activeTarget.getBoundingClientRect();
    const style = window.getComputedStyle(activeTarget);
    const isFixedOrSticky = style.position === "fixed" || style.position === "sticky";

    const inViewport =
      rect.bottom > 0 &&
      rect.right > 0 &&
      rect.top < window.innerHeight &&
      rect.left < window.innerWidth;

    if (isFixedOrSticky || inViewport) {
      // 按你的需求：位置保持不变，不做 placeTooltip
      // 若你希望在 resize 时避免完全越界，可启用一次轻微“夹取”
      // const minPad = 8;
      // frozenPos.left = Math.max(minPad, Math.min(frozenPos.left, window.innerWidth - tooltip.offsetWidth - minPad));
      // frozenPos.top  = Math.max(minPad, Math.min(frozenPos.top,  window.innerHeight - tooltip.offsetHeight - minPad));
      applyFrozen();
    } else {
      hideTooltip();
    }
  }

  // 初次绑定
  bindTargets();

  // 全局监听一次即可，避免为每个元素重复加监听
  window.addEventListener("scroll", onViewportChange, { passive: true });
  window.addEventListener("resize", onViewportChange, { passive: true });

  // anzhiyu PJAX：切换前隐藏；切换后重新绑定
  window.addEventListener("pjax:send", hideTooltip);
  window.addEventListener("pjax:success", () => {
    bindTargets(document);
  });
}

document.addEventListener("DOMContentLoaded", initTooltip);
