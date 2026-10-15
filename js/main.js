/* 1. Navbar Scroll Effect */

const header = document.querySelector("header");

function updateHeader() {
    if (!header) return;

    header.classList.toggle("active", window.scrollY >= 50);
}

window.addEventListener("scroll", updateHeader);
updateHeader();


/* 2. Responsive Mobile Menu */

const menuToggle = document.getElementById("menu_toggle");
const navLinks = document.getElementById("links");

function closeMenu() {
    if (!menuToggle || !navLinks) return;

    navLinks.classList.remove("active");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");

    const icon = menuToggle.querySelector("i");

    if (icon) {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
    }
}

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", function () {

        const isOpen = navLinks.classList.contains("active");

        if (isOpen) {
            closeMenu();
        } else {
            navLinks.classList.add("active");

            menuToggle.setAttribute("aria-expanded", "true");
            menuToggle.setAttribute("aria-label", "Close menu");

            const icon = menuToggle.querySelector("i");

            if (icon) {
                icon.classList.remove("fa-bars");
                icon.classList.add("fa-xmark");
            }
        }
    });

    // Close menu when clicking a navigation link
    navLinks.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", closeMenu);
    });

    // Close menu when switching to desktop
    window.addEventListener("resize", function () {
        if (window.innerWidth > 992) {
            closeMenu();
        }
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (event) {
        const isOpen = navLinks.classList.contains("active");

        if (
            isOpen &&
            !navLinks.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            closeMenu();
        }
    });
}


/* 3. Portfolio Message */

const portfolioBtn = document.getElementById("view_portfolio_btn");
const portfolioMessage = document.getElementById("portfolio_message");

let portfolioTimer;

if (portfolioBtn && portfolioMessage) {

    portfolioBtn.addEventListener("click", function (event) {

        event.preventDefault();

        portfolioMessage.classList.add("show");

        clearTimeout(portfolioTimer);

        portfolioTimer = setTimeout(function () {
            portfolioMessage.classList.remove("show");
        }, 4000);
    });
}


/* 4. Project Request Popup */

const openProjectForm = document.getElementById("open_project_form");
const closeProjectForm = document.getElementById("close_button");
const modalOverlay = document.getElementById("modal_overlay");

let previousBodyOverflow = "";
let previousFocusedElement = null;

// Open popup
function openModal() {
    if (!modalOverlay) return;

    if (modalOverlay.classList.contains("active")) return;

    closeMenu();

    previousBodyOverflow = document.body.style.overflow;
    previousFocusedElement = document.activeElement;

    modalOverlay.classList.add("active");
    document.body.style.overflow = "hidden";

    if (closeProjectForm) {
        closeProjectForm.focus();
    }
}

// Close popup
function closeModal() {
    if (!modalOverlay) return;

    const wasOpen = modalOverlay.classList.contains("active");

    if (!wasOpen) return;

    modalOverlay.classList.remove("active");
    document.body.style.overflow = previousBodyOverflow;

    if (
        previousFocusedElement &&
        typeof previousFocusedElement.focus === "function"
    ) {
        previousFocusedElement.focus();
    }
}

// Open popup button
if (openProjectForm && modalOverlay) {
    openProjectForm.addEventListener("click", openModal);
}

// Close popup button
if (closeProjectForm) {
    closeProjectForm.addEventListener("click", closeModal);
}

// Close popup when clicking outside
if (modalOverlay) {
    modalOverlay.addEventListener("click", function (event) {
        if (event.target === modalOverlay) {
            closeModal();
        }
    });
}

// Close popup or menu with ESC
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeModal();
        closeMenu();
    }
});


/* 5. Book a Meeting Popup */

const openMeetingBtn = document.getElementById("open_meeting_form");
const closeMeetingBtn = document.getElementById("close_meeting_form");
const meetingOverlay = document.getElementById("meeting_overlay");
const meetingForm = document.getElementById("meeting_form");
const meetingDate = document.getElementById("meeting_date");

let meetingPreviousFocus = null;
let meetingPreviousOverflow = "";

// Prevent choosing past dates
function updateMeetingMinDate() {
    if (!meetingDate) return;

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    meetingDate.min = `${year}-${month}-${day}`;
}

updateMeetingMinDate();

// Open Meeting Popup
function openMeetingModal() {
    if (!meetingOverlay) return;
    if (meetingOverlay.classList.contains("active")) return;

    closeMenu();
    closeModal();

    meetingPreviousFocus = document.activeElement;
    meetingPreviousOverflow = document.body.style.overflow;

    updateMeetingMinDate();

    meetingOverlay.classList.add("active");
    document.body.style.overflow = "hidden";

    if (closeMeetingBtn) {
        closeMeetingBtn.focus();
    }
}

// Close Meeting Popup
function closeMeetingModal() {
    if (!meetingOverlay) return;
    if (!meetingOverlay.classList.contains("active")) return;

    meetingOverlay.classList.remove("active");
    document.body.style.overflow = meetingPreviousOverflow;

    if (meetingPreviousFocus &&
        typeof meetingPreviousFocus.focus === "function") {
        meetingPreviousFocus.focus();
    }
}

// Button Events
if (openMeetingBtn) {
    openMeetingBtn.addEventListener("click", openMeetingModal);
}

if (closeMeetingBtn) {
    closeMeetingBtn.addEventListener("click", closeMeetingModal);
}

// Close when clicking outside
if (meetingOverlay) {
    meetingOverlay.addEventListener("click", function(event) {
        if (event.target === meetingOverlay) {
            closeMeetingModal();
        }
    });
}

// Close with ESC
document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        closeMeetingModal();
    }
});

// Validate Meeting Request
if (meetingForm) {
    meetingForm.addEventListener("submit", function(event) {
        const dateValue = meetingDate.value;
        const timeValue = document.getElementById("meeting_time").value;
        const whatsapp = document.getElementById("meeting_whatsapp").value.trim();

        const digits = whatsapp.replace(/\D/g, "");

        if (digits.length < 8 || digits.length > 15) {
            event.preventDefault();
            alert("Please enter a valid WhatsApp number with country code.");
            return;
        }

        const selectedDateTime = new Date(`${dateValue}T${timeValue}`);

        if (Number.isNaN(selectedDateTime.getTime()) ||
            selectedDateTime <= new Date()) {
            event.preventDefault();
            alert("Please choose a future meeting date and time.");
            return;
        }

        // Prevent submitting until SheetMonkey is connected
        if (meetingForm.action.includes("YOUR_MEETING_SHEETMONKEY_URL")) {
            event.preventDefault();
            alert("Meeting requests are not connected yet.");
        }
    });
}



/* 6. Projects Coming Soon Message */

const projectButtons = document.querySelectorAll(
    ".projects .project_heading a"
);

const projectComingSoon = document.getElementById(
    "project_coming_soon"
);

let projectMessageTimer;

projectButtons.forEach(function(button) {
    button.addEventListener("click", function(event) {
        event.preventDefault();

        if (!projectComingSoon) return;

        projectComingSoon.classList.add("show");

        clearTimeout(projectMessageTimer);

        projectMessageTimer = setTimeout(function() {
            projectComingSoon.classList.remove("show");
        }, 4000);
    });
});
