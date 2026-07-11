import { animate, scroll } from "https://cdn.jsdelivr.net/npm/motion@latest/+esm"

const title = document.getElementById("welcome");
const hi = document.getElementById("hi");
const surname = document.getElementById("surname");
const navbar = document.getElementById("navbar");
const contacts = document.getElementById("contacts");

animate(
    title,
    { opacity: [0, 1], filter: ["blur(2px)", "blur(0px)"] },
    { duration: 0.4, easing: "ease-out" }
);

scroll((progress) => {
    const p = Math.min(progress / 0.25, 1);
    title.style.left = `${50 - 46 * p}%`;
    title.style.top = `${50 - 50 * p}%`;

    title.style.transform = `translate(${-45}%, ${-50 + 50 * p}%)`;
    title.style.opacity = 1;

     // Fade out "Hi, I'm"
    hi.style.opacity = 1 - p;
    hi.style.transform = `translateY(${-20 * p}px)`;

    // Fade in "K"
    surname.style.opacity = p;
    surname.style.transform = `translateY(${20 * (1 - p)}px)`;

    
    navbar.style.backgroundColor=`rgba(226,226,226,${p})`;
    contacts.style.opacity = 1 - p;

    if (p > 0.98) {
        navbar.classList.add("nav");
        contacts.style.opacity = 1;
    } else {
        navbar.classList.remove("nav");
    }

});
