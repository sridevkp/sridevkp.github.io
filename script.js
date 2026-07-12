import { animate, scroll } from "https://cdn.jsdelivr.net/npm/motion@latest/+esm"

const title = document.getElementById("welcome");
const hi = document.getElementById("hi");
const surname = document.getElementById("surname");
const navbar = document.getElementById("navbar");
const contacts = document.getElementById("contacts");
const mobileTransitionEnd = window.matchMedia("(max-width: 700px)").matches ? 0.18 : 0.25;

const updateSectionStickyOffset = () => {
    const offset = navbar.offsetHeight;
    document.documentElement.style.setProperty("--navbar-sticky-offset", `${offset}px`);
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

});

window.addEventListener("resize", updateSectionStickyOffset);

new ResizeObserver(updateSectionStickyOffset).observe(navbar);

window.onload = () => {
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme) {
        document.body.setAttribute("data-theme", currentTheme);
    }

    updateSectionStickyOffset();
};


window.addEventListener("dblclick", () => {
    const currentTheme = document.body.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "" : "dark";
    document.body.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
});
