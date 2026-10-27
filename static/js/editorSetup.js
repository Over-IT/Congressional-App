document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("tryButton");
    const picker = document.getElementById("colorPicker");
    const style = document.getElementById("stylePicker");
    const recBox = document.getElementById("recText");

    const styles = new Map();
    styles.set("monochrome", monochrome);
    styles.set("complementary", complementary);
    styles.set("analogous", analagous);
    styles.set("triadic", triadic);

    function updateRecommendation() {
        if (!picker || !recBox) return;
        const rec = recommendHarmony(picker.value);
        recBox.innerHTML = `<strong>Suggested:</strong> ${rec.name}`;
    }

    if (picker) {
        picker.addEventListener("input", updateRecommendation);
        updateRecommendation();
    }

    if (button) {
        button.onclick = () => {
            const fn = styles.get(style.value) || monochrome;
            fn(picker.value);
        };
    }
});