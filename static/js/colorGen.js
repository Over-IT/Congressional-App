let currentPalette = {};

function applyPalette(tokens) {
    currentPalette = tokens;
    for (let label in tokens) {
        document.documentElement.style.setProperty(tokens[label].var, tokens[label].color);
    }
    window.dispatchEvent(new CustomEvent('paletteUpdated'));
}

function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}

// Mathematical recommendation engine based on base color metrics
function recommendHarmony(col) {
    const base = new Color(col);
    const h = base.hsl.h || 0;
    const s = base.hsl.s || 0;
    const l = base.hsl.l || 0;

    if (s < 25 || l > 85 || l < 20) {
        return { mode: "monochrome", name: "Monochrome" };
    } else if (s > 65 && l >= 35 && l <= 65) {
        return { mode: "complementary", name: "Complementary" };
    } else if ((h >= 30 && h <= 95) || (h >= 190 && h <= 270)) {
        return { mode: "triadic", name: "Triadic" };
    } else {
        return { mode: "analogous", name: "Analogous" };
    }
}

// 1. Monochrome Formula (Single Hue H)
function monochrome(col) {
    const base = new Color(col);
    const h = base.hsl.h || 0;
    const s = base.hsl.s ?? 50;

    const c1 = base.clone(); c1.hsl.h = h; c1.hsl.s = clamp(s, 40, 85); c1.hsl.l = 28;
    const c2 = base.clone(); c2.hsl.h = h; c2.hsl.s = clamp(s * 0.2, 5, 20); c2.hsl.l = 96;
    const c3 = base.clone(); c3.hsl.h = h; c3.hsl.s = clamp(s * 0.35, 10, 30); c3.hsl.l = 88;
    const c4 = base.clone(); c4.hsl.h = h; c4.hsl.s = clamp(s * 1.25, 50, 100); c4.hsl.l = 45;
    const c5 = base.clone(); c5.hsl.h = h; c5.hsl.s = clamp(s * 0.3, 10, 35); c5.hsl.l = 12;

    applyPalette({
        "Color 1": { var: "--test-color-1", color: c1, desc: "Header" },
        "Color 2": { var: "--test-color-2", color: c2, desc: "Background" },
        "Color 3": { var: "--test-color-3", color: c3, desc: "Cards" },
        "Color 4": { var: "--test-color-4", color: c4, desc: "Accent/CTA" },
        "Color 5": { var: "--test-color-5", color: c5, desc: "Text" }
    });
}

// 2. Complementary Formula (H and H + 180deg)
function complementary(col) {
    const base = new Color(col);
    const h = base.hsl.h || 0;
    const compH = (h + 180) % 360;
    const s = base.hsl.s ?? 50;

    const c1 = base.clone(); c1.hsl.h = h; c1.hsl.s = clamp(s, 40, 85); c1.hsl.l = 28;
    // Tint background with soft complementary tone
    const c2 = base.clone(); c2.hsl.h = compH; c2.hsl.s = clamp(s * 0.25, 8, 25); c2.hsl.l = 95;
    const c3 = base.clone(); c3.hsl.h = h; c3.hsl.s = clamp(s * 0.3, 10, 30); c3.hsl.l = 89;
    // High-contrast vibrant complementary CTA
    const c4 = base.clone(); c4.hsl.h = compH; c4.hsl.s = clamp(s * 1.3, 60, 100); c4.hsl.l = 45;
    const c5 = base.clone(); c5.hsl.h = h; c5.hsl.s = clamp(s * 0.3, 10, 30); c5.hsl.l = 12;

    applyPalette({
        "Color 1": { var: "--test-color-1", color: c1, desc: "Header" },
        "Color 2": { var: "--test-color-2", color: c2, desc: "Background" },
        "Color 3": { var: "--test-color-3", color: c3, desc: "Cards" },
        "Color 4": { var: "--test-color-4", color: c4, desc: "Accent/CTA" },
        "Color 5": { var: "--test-color-5", color: c5, desc: "Text" }
    });
}

// 3. Analogous Formula (H - 30deg, H, H + 30deg)
function analagous(col) {
    const base = new Color(col);
    const h = base.hsl.h || 0;
    const analog1 = (h + 30) % 360;
    const analog2 = (h + 330) % 360;
    const s = base.hsl.s ?? 50;

    const c1 = base.clone(); c1.hsl.h = analog1; c1.hsl.s = clamp(s, 40, 85); c1.hsl.l = 28;
    const c2 = base.clone(); c2.hsl.h = h; c2.hsl.s = clamp(s * 0.2, 5, 20); c2.hsl.l = 96;
    const c3 = base.clone(); c3.hsl.h = analog2; c3.hsl.s = clamp(s * 0.4, 15, 35); c3.hsl.l = 88;
    const c4 = base.clone(); c4.hsl.h = analog1; c4.hsl.s = clamp(s * 1.2, 55, 100); c4.hsl.l = 45;
    const c5 = base.clone(); c5.hsl.h = h; c5.hsl.s = clamp(s * 0.3, 10, 30); c5.hsl.l = 12;

    applyPalette({
        "Color 1": { var: "--test-color-1", color: c1, desc: "Header" },
        "Color 2": { var: "--test-color-2", color: c2, desc: "Background" },
        "Color 3": { var: "--test-color-3", color: c3, desc: "Cards" },
        "Color 4": { var: "--test-color-4", color: c4, desc: "Accent/CTA" },
        "Color 5": { var: "--test-color-5", color: c5, desc: "Text" }
    });
}

// 4. Triadic Formula (H, H + 120deg, H + 240deg)
function triadic(col) {
    const base = new Color(col);
    const h = base.hsl.h || 0;
    const triad1 = (h + 120) % 360;
    const triad2 = (h + 240) % 360;
    const s = base.hsl.s ?? 50;

    const c1 = base.clone(); c1.hsl.h = h; c1.hsl.s = clamp(s, 40, 85); c1.hsl.l = 26;
    // Background tinted with 2nd triadic hue (+240 deg)
    const c2 = base.clone(); c2.hsl.h = triad2; c2.hsl.s = clamp(s * 0.25, 8, 25); c2.hsl.l = 95;
    const c3 = base.clone(); c3.hsl.h = h; c3.hsl.s = clamp(s * 0.35, 12, 32); c3.hsl.l = 88;
    // Accent button uses 1st triadic hue (+120 deg)
    const c4 = base.clone(); c4.hsl.h = triad1; c4.hsl.s = clamp(s * 1.25, 60, 100); c4.hsl.l = 44;
    const c5 = base.clone(); c5.hsl.h = h; c5.hsl.s = clamp(s * 0.3, 10, 30); c5.hsl.l = 12;

    applyPalette({
        "Color 1": { var: "--test-color-1", color: c1, desc: "Header" },
        "Color 2": { var: "--test-color-2", color: c2, desc: "Background" },
        "Color 3": { var: "--test-color-3", color: c3, desc: "Cards" },
        "Color 4": { var: "--test-color-4", color: c4, desc: "Accent/CTA" },
        "Color 5": { var: "--test-color-5", color: c5, desc: "Text" }
    });
}

monochrome("#2563eb");