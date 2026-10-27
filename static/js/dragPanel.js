document.addEventListener("DOMContentLoaded", () => {
    const panel = document.getElementById("panel");
    const panelHead = document.getElementById("panelHead");
    if (!panel || !panelHead) return;

    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    panelHead.addEventListener('mousedown', (e) => {
        isDragging = true;
        panel.classList.add('dragging');

        startX = e.clientX;
        startY = e.clientY;

        const rect = panel.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;

        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        let newLeft = initialLeft + dx;
        let newTop = initialTop + dy;

        const maxLeft = window.innerWidth - panel.offsetWidth;
        const maxTop = window.innerHeight - panel.offsetHeight;

        newLeft = Math.max(0, Math.min(newLeft, maxLeft));
        newTop = Math.max(0, Math.min(newTop, maxTop));

        panel.style.left = `${newLeft}px`;
        panel.style.top = `${newTop}px`;
    });

    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        panel.classList.remove('dragging');

        const rect = panel.getBoundingClientRect();
        const currentMid = rect.left + (panel.offsetWidth / 2);
        const midPoint = window.innerWidth / 2;

        const targetLeft = currentMid < midPoint ? 10 : window.innerWidth - panel.offsetWidth - 10;

        let currentTop = rect.top;
        const maxTop = window.innerHeight - panel.offsetHeight;
        currentTop = Math.max(10, Math.min(currentTop, maxTop - 10));

        panel.style.left = `${targetLeft}px`;
        panel.style.top = `${currentTop}px`;
    });

    function formatColor(colorObj, format) {
        const srgb = colorObj.to("srgb");
        const r = Math.round(Math.max(0, Math.min(1, srgb.coords[0])) * 255);
        const g = Math.round(Math.max(0, Math.min(1, srgb.coords[1])) * 255);
        const b = Math.round(Math.max(0, Math.min(1, srgb.coords[2])) * 255);

        if (format === "rgb") {
            return `rgb(${r}, ${g}, ${b})`;
        }
        if (format === "hsl") {
            const hsl = colorObj.to("hsl");
            const h = Math.round((hsl.coords[0] || 0) % 360);
            const s = Math.round(Math.max(0, Math.min(100, hsl.coords[1])));
            const l = Math.round(Math.max(0, Math.min(100, hsl.coords[2])));
            return `hsl(${h}, ${s}%, ${l}%)`;
        }
        return colorObj.to("srgb").toString({ format: "hex" });
    }

    function renderPalette() {
        const list = document.getElementById("paletteList");
        const formatPicker = document.getElementById("formatPicker");
        if (!list) return;

        const fmt = formatPicker ? formatPicker.value : "hex";
        list.innerHTML = "";

        for (let label in currentPalette) {
            const item = currentPalette[label];
            const hexVal = item.color.to("srgb").toString({ format: "hex" });
            const valStr = formatColor(item.color, fmt);

            const row = document.createElement("div");
            row.className = "paletteRow";
            row.title = `${label}: ${item.desc}`;
            row.innerHTML = `
                <span class="swatch" style="background:${hexVal}"></span>
                <span class="roleLabel">${label} <small class="descLabel">(${item.desc})</small></span>
                <span class="valLabel">${valStr}</span>
            `;
            list.appendChild(row);
        }
    }

    document.addEventListener("mouseover", (e) => {
        const target = e.target.closest("[data-color-var]");
        if (target) {
            const cssVar = target.dataset.colorVar;
            for (let label in currentPalette) {
                if (currentPalette[label].var === cssVar) {
                    const fmt = document.getElementById("formatPicker")?.value || "hex";
                    target.title = `${label} (${currentPalette[label].desc}): ${formatColor(currentPalette[label].color, fmt)}`;
                    break;
                }
            }
        }
    });

    window.addEventListener("paletteUpdated", renderPalette);

    const formatPicker = document.getElementById("formatPicker");
    if (formatPicker) {
        formatPicker.addEventListener("change", renderPalette);
    }
    renderPalette();
});