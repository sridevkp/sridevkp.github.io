import { animate, scroll } from "https://cdn.jsdelivr.net/npm/motion@latest/+esm"

const title = document.getElementById("welcome");
const hi = document.getElementById("hi");
const surname = document.getElementById("surname");
const navbar = document.getElementById("navbar");
const contacts = document.getElementById("contacts");
const sections = Array.from(document.querySelectorAll(".resume-section[data-bg]"));
const mobileTransitionEnd = 0.1//window.matchMedia("(max-width: 700px)").matches ? 0.1 : 0.1;

const activeBackground = { value: document.body.getAttribute("data-active-background") || "education" };

const updateSectionStickyOffset = () => {
    const offset = navbar.offsetHeight;
    document.documentElement.style.setProperty("--navbar-sticky-offset", `${offset}px`);
};

const updateActiveBackground = () => {
    if (!sections.length) {
        return;
    }

    let bestSection = sections[0];
    let bestScore = 0;

    for (const section of sections) {
        const rect = section.getBoundingClientRect();
        const visibleTop = Math.max(rect.top, 0);
        const visibleBottom = Math.min(rect.bottom, window.innerHeight);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const score = visibleHeight / Math.max(rect.height, 1);

        if (score > bestScore) {
            bestScore = score;
            bestSection = section;
        }
    }

    const nextBackground = bestScore > 0 ? (bestSection.dataset.bg || activeBackground.value) : "";

    if (nextBackground !== activeBackground.value) {
        activeBackground.value = nextBackground;
        document.body.setAttribute("data-active-background", nextBackground);
    }
};

animate(
    title,
    { opacity: [0, 1], filter: ["blur(2px)", "blur(0px)"] },
    { duration: 0.4, easing: "ease-out" }
);

scroll((progress) => {
    const p = Math.min(progress / mobileTransitionEnd, 1);
    title.style.left = `${50 - 46 * p}%`;
    title.style.top = `${50 - 50 * p}%`;

    title.style.transform = `translate(${-45}%, ${-50 + 50 * p}%)`;
    title.style.opacity = 1;

    hi.style.opacity = 1 - p;
    hi.style.transform = `translateY(${-20 * p}px)`;

    surname.style.opacity = p;
    surname.style.transform = `translateY(${20 * (1 - p)}px)`;

    navbar.style.setProperty('--bg-opacity', `${p}`);
    contacts.style.opacity = 1 - p;

    if (p > 0.98) {
        navbar.classList.add("nav");
        contacts.style.opacity = 1;
    } else {
        navbar.classList.remove("nav");
    }

    updateSectionStickyOffset();
    updateActiveBackground();

});

window.addEventListener("resize", updateSectionStickyOffset);
window.addEventListener("resize", updateActiveBackground);

new ResizeObserver(updateSectionStickyOffset).observe(navbar);
new ResizeObserver(updateActiveBackground).observe(document.body);

window.onload = () => {
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme) {
        document.body.setAttribute("data-theme", currentTheme);
    }

    updateSectionStickyOffset();
    updateActiveBackground();
};


window.addEventListener("dblclick", () => {
    const currentTheme = document.body.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "" : "dark";
    document.body.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
});
