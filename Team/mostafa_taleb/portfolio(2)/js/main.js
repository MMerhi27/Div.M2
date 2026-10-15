const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const year = document.getElementById("year");

if (year) {
year.textContent = new Date().getFullYear();
}

if (menuToggle && navLinks) {
const menuIcon = menuToggle.querySelector("i");
const links = navLinks.querySelectorAll('a[href^="#"]');
const header = document.querySelector(".navbar");
const mobileQuery = window.matchMedia("(max-width: 760px)");

function setMenuOpen(isOpen) {
    navLinks.classList.toggle("open", isOpen);

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close menu" : "Open menu"
    );

    if (menuIcon) {
    menuIcon.classList.toggle("fa-bars", !isOpen);
    menuIcon.classList.toggle("fa-xmark", isOpen);
    }
}

function setActiveLink(sectionId) {
    links.forEach(function (link) {
    const isActive =
        link.getAttribute("href") === `#${sectionId}`;

    link.classList.toggle("active", isActive);

    if (isActive) {
        link.setAttribute("aria-current", "location");
    } else {
        link.removeAttribute("aria-current");
    }
    });
}

menuToggle.addEventListener("click", function () {
    setMenuOpen(!navLinks.classList.contains("open"));
});

links.forEach(function (link) {
    link.addEventListener("click", function () {
    setMenuOpen(false);
    setActiveLink(link.getAttribute("href").slice(1));
    });
});

document.addEventListener("click", function (event) {
    if (
    !navLinks.contains(event.target) &&
    !menuToggle.contains(event.target)
    ) {
    setMenuOpen(false);
    }
});

document.addEventListener("keydown", function (event) {
    if (
    event.key === "Escape" &&
    navLinks.classList.contains("open")
    ) {
    setMenuOpen(false);
    menuToggle.focus();
    }
});

mobileQuery.addEventListener("change", function (event) {
    if (!event.matches) {
    setMenuOpen(false);
    }
});

const sections = Array.from(links)
    .map(function (link) {
    return document.getElementById(
        link.getAttribute("href").slice(1)
    );
    })
    .filter(Boolean);

function updateActiveSection() {
    if (!sections.length) return;

    const offset = (header ? header.offsetHeight : 82) + 40;
    let currentSection = sections[0];

    sections.forEach(function (section) {
    if (section.getBoundingClientRect().top <= offset) {
        currentSection = section;
    }
    });

    const reachedBottom =
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight - 2;

    if (reachedBottom) {
    currentSection = sections[sections.length - 1];
    }

    setActiveLink(currentSection.id);
}

let scheduled = false;

window.addEventListener(
    "scroll",
    function () {
    if (scheduled) return;

    scheduled = true;

    window.requestAnimationFrame(function () {
        updateActiveSection();
        scheduled = false;
    });
    },
    { passive: true }
);

window.addEventListener("resize", updateActiveSection);
window.addEventListener("load", updateActiveSection);

setMenuOpen(false);
updateActiveSection();
}