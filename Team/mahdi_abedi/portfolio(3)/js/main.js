"use strict";

/* ===== THEME ===== */

const root = document.documentElement;
const themeButton = document.getElementById("theme");
const themeIcon = document.getElementById("themeIcon");

function applyTheme(theme) {
    const selectedTheme = theme === "light" ? "light" : "dark";

    root.dataset.theme = selectedTheme;

    const isDark = selectedTheme === "dark";
    const label = isDark
        ? "Switch to light theme"
        : "Switch to dark theme";

    if (themeButton) {
        themeButton.setAttribute("aria-label", label);
        themeButton.title = label;
    }

    if (themeIcon) {
        themeIcon.className = isDark
            ? "fa-solid fa-sun"
            : "fa-solid fa-moon";
    }
}

let savedTheme = "dark";

try {
    const storedTheme = localStorage.getItem("theme");

    if (storedTheme === "dark" || storedTheme === "light") {
        savedTheme = storedTheme;
    }
} catch {
    // Use the default theme when storage is unavailable.
}

applyTheme(savedTheme);

if (themeButton) {
    themeButton.addEventListener("click", () => {
        const nextTheme =
            root.dataset.theme === "dark" ? "light" : "dark";

        applyTheme(nextTheme);

        try {
            localStorage.setItem("theme", nextTheme);
        } catch {
            // Theme switching still works without storage.
        }
    });

    themeButton.hidden = false;
}

/* ===== MOBILE MENU ===== */

const header = document.querySelector(".header");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const mobileViewport = window.matchMedia("(max-width: 900px)");

function updateHeaderOffset() {
    if (!header) return;

    root.style.setProperty(
        "--header-offset",
        `${header.getBoundingClientRect().height + 16}px`
    );
}

if (menuToggle && navLinks) {
    const menuIcon = menuToggle.querySelector("i");

    function setMenuState(isOpen, returnFocus = false) {
        navLinks.classList.toggle("is-open", isOpen);

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close menu" : "Open menu"
        );

        if (menuIcon) {
            menuIcon.className = isOpen
                ? "fa-solid fa-xmark"
                : "fa-solid fa-bars";
        }

        if (returnFocus) {
            menuToggle.focus();
        }

        updateHeaderOffset();
    }

    menuToggle.addEventListener("click", () => {
        const isOpen =
            menuToggle.getAttribute("aria-expanded") === "true";

        setMenuState(!isOpen);
    });

    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            setMenuState(false);

            // Move focus to the destination before hiding the mobile link.
            if (mobileViewport.matches) {
                const target = document.querySelector(
                    link.getAttribute("href")
                );

                if (target) {
                    target.setAttribute("tabindex", "-1");
                    target.focus({ preventScroll: true });

                    target.addEventListener(
                        "blur",
                        () => target.removeAttribute("tabindex"),
                        { once: true }
                    );
                }
            }
        });
    });

    document.addEventListener("keydown", (event) => {
        if (
            event.key === "Escape" &&
            navLinks.classList.contains("is-open")
        ) {
            setMenuState(false, true);
        }
    });

    document.addEventListener("click", (event) => {
        if (
            !navLinks.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            setMenuState(false);
        }
    });

    document.addEventListener("focusin", (event) => {
        if (
            !navLinks.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            setMenuState(false);
        }
    });

    function resetMenuOnResize() {
        const focusInNav = navLinks.contains(document.activeElement);
        const focusOnToggle = document.activeElement === menuToggle;

        setMenuState(false);

        if (mobileViewport.matches && focusInNav) {
            menuToggle.focus();
        } else if (!mobileViewport.matches && focusOnToggle) {
            navLinks.querySelector("a")?.focus();
        }
    }

    if (typeof mobileViewport.addEventListener === "function") {
        mobileViewport.addEventListener("change", resetMenuOnResize);
    }

    menuToggle.hidden = false;
    root.classList.add("menu-ready");
}

updateHeaderOffset();

if (header && "ResizeObserver" in window) {
    const headerObserver = new ResizeObserver(updateHeaderOffset);
    headerObserver.observe(header);
} else {
    window.addEventListener("resize", updateHeaderOffset);
}

/* ===== WORD HOVER EFFECT ===== */

/* Use data-words on plain text elements only. */

document.querySelectorAll("[data-words]").forEach((element) => {
    const text = element.textContent.trim();

    if (!text) return;

    const words = text.split(/\s+/);
    const fragment = document.createDocumentFragment();

    words.forEach((word, index) => {
        const span = document.createElement("span");

        span.className = "w";
        span.textContent = word;

        fragment.appendChild(span);

        if (index < words.length - 1) {
            fragment.appendChild(document.createTextNode(" "));
        }
    });

    element.replaceChildren(fragment);
});

/* ===== SCROLL REVEAL ===== */

const revealItems = document.querySelectorAll(".reveal");
const motionPreference = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
);

let revealObserver = null;

function showAllItems() {
    if (revealObserver) {
        revealObserver.disconnect();
    }

    revealItems.forEach((item) => {
        item.classList.remove("reveal-pending");
        item.classList.add("show");
    });
}

if (
    "IntersectionObserver" in window &&
    !motionPreference.matches
) {
    try {
        revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    entry.target.classList.add("show");
                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.1
            }
        );

        revealItems.forEach((item) => {
            item.classList.add("reveal-pending");
            revealObserver.observe(item);
        });
    } catch {
        showAllItems();
    }
} else {
    showAllItems();
}

if (typeof motionPreference.addEventListener === "function") {
    motionPreference.addEventListener("change", (event) => {
        if (event.matches) {
            showAllItems();
        }
    });
}

/* ===== FOOTER YEAR ===== */

const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}