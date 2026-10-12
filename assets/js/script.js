const themeBtn = document.querySelector(".theme-btn");

if (themeBtn) {
    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        const icon = themeBtn.querySelector("i");

        if (icon) {
            const isDarkMode = document.body.classList.contains("dark-mode");
            icon.classList.toggle("fa-sun", isDarkMode);
            icon.classList.toggle("fa-moon", !isDarkMode);
        }
    });
}

const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");

if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
        const isExpanded = menuBtn.getAttribute("aria-expanded") === "true";

        navLinks.classList.toggle("mobile-active", !isExpanded);
        menuBtn.setAttribute("aria-expanded", String(!isExpanded));
    });
}

const currentYear = document.querySelector("[data-current-year]");

if (currentYear) {
    currentYear.textContent = String(new Date().getFullYear());
}

const filterButtons = document.querySelectorAll(".filter-btn");
const courseCards = document.querySelectorAll(".course-card");
const courseSearch = document.querySelector("#courseSearch");
const noCourseResults = document.querySelector("#courseNoResults");

if (filterButtons.length > 0 && courseCards.length > 0) {
    const availableCategories = new Set(
        Array.from(filterButtons, (button) => button.dataset.filter)
    );
    const requestedCategory =
        new URLSearchParams(window.location.search).get("category");
    let activeCategory =
        requestedCategory && availableCategories.has(requestedCategory)
            ? requestedCategory
            : "all";

    const updateCourses = () => {
        const searchTerm =
            courseSearch?.value.trim().toLocaleLowerCase() ?? "";
        let visibleCourses = 0;

        courseCards.forEach((card) => {
            const matchesCategory =
                activeCategory === "all" ||
                card.dataset.category === activeCategory;
            const searchableText =
                `${card.dataset.name ?? ""} ${card.textContent ?? ""}`
                    .toLocaleLowerCase();
            const isVisible =
                matchesCategory && searchableText.includes(searchTerm);

            card.hidden = !isVisible;
            visibleCourses += Number(isVisible);
        });

        if (noCourseResults) {
            noCourseResults.hidden = visibleCourses > 0;
        }
    };

    filterButtons.forEach((button) => {
        const isActive = button.dataset.filter === activeCategory;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));

        button.addEventListener("click", () => {
            activeCategory = button.dataset.filter ?? "all";

            filterButtons.forEach((filterButton) => {
                const isActive = filterButton === button;
                filterButton.classList.toggle("active", isActive);
                filterButton.setAttribute("aria-pressed", String(isActive));
            });

            updateCourses();
        });
    });

    courseSearch?.addEventListener("input", updateCourses);
    updateCourses();
}

(() => {
    const certificateModal = document.getElementById("certificateModal");
    const certificateImage = document.getElementById("modalCertificateImage");
    const certificateTitle = document.getElementById("modalCertificateTitle");
    const verifyModal = document.getElementById("verifyModal");
    const certificateId = document.getElementById("verifiedCertificateId");
    let previousFocus = null;

    const openModal = (modal, trigger) => {
        if (!modal) return;
        previousFocus = trigger;
        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
        modal.querySelector("button")?.focus();
    };

    const closeModal = (modal) => {
        if (!modal) return;
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
        if (!document.querySelector(".certificate-modal.active, .verify-modal.active")) {
            document.body.classList.remove("modal-open");
        }
        previousFocus?.focus();
        previousFocus = null;
    };

    if (certificateModal && certificateImage && certificateTitle) {
        document.querySelectorAll(".certificate-view-btn, .view-btn").forEach((button) => {
            button.addEventListener("click", () => {
                const { image, title } = button.dataset;
                if (!image || !title) {
                    console.error("Certificate view button is missing its image or title.");
                    return;
                }
                certificateImage.src = image;
                certificateImage.alt = title;
                certificateTitle.textContent = title;
                openModal(certificateModal, button);
            });
        });
        document.getElementById("certificateModalClose")?.addEventListener("click", () => closeModal(certificateModal));
        certificateModal.querySelector(".certificate-modal-overlay")?.addEventListener("click", () => closeModal(certificateModal));
    }

    if (verifyModal && certificateId) {
        document.querySelectorAll(".verify-btn").forEach((button) => {
            button.addEventListener("click", () => {
                if (!button.dataset.id) {
                    console.error("Certificate verification button is missing its certificate ID.");
                    return;
                }
                certificateId.textContent = button.dataset.id;
                openModal(verifyModal, button);
            });
        });
        document.getElementById("verifyModalClose")?.addEventListener("click", () => closeModal(verifyModal));
        verifyModal.querySelector(".verify-modal-overlay")?.addEventListener("click", () => closeModal(verifyModal));
    }

    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        closeModal(certificateModal?.classList.contains("active") ? certificateModal : verifyModal);
    });
})();

/* =====================================================
   TAWANA CONTACT FORM
   Front-end validation only.
   No message is sent without a backend or email service.
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("contactForm");
    const status = document.getElementById("formStatus");
    const message = document.getElementById("message");
    const characterCount = document.getElementById("characterCount");

    if (!form || !status || !message || !characterCount) {
        return;
    }

    // Fields that must be completed.
    const requiredFields = [
        document.getElementById("fullName"),
        document.getElementById("email"),
        document.getElementById("subject"),
        message
    ];

    // Update the message character counter.
    function updateCharacterCount() {
        characterCount.textContent =
            `${message.value.length} / 3000`;
    }

    message.addEventListener("input", updateCharacterCount);

    // Display a status message accessibly.
    function showStatus(text, type) {
        status.textContent = text;
        status.className = `form-status visible ${type}`;
        status.focus();
    }

    // Remove previous validation indicators.
    function clearValidationErrors() {
        requiredFields.forEach(function (field) {
            field.removeAttribute("aria-invalid");
        });

        status.textContent = "";
        status.className = "form-status";
    }

    // Validate required fields and message length.
    function validateForm() {
        clearValidationErrors();

        let firstInvalidField = null;

        requiredFields.forEach(function (field) {
            if (!field.checkValidity()) {
                field.setAttribute("aria-invalid", "true");

                if (!firstInvalidField) {
                    firstInvalidField = field;
                }
            }
        });

        if (firstInvalidField) {
            showStatus(
                "Please check the highlighted fields and enter valid information.",
                "error"
            );

            firstInvalidField.focus();
            return false;
        }

        return true;
    }

    // Clear an individual field's error as the user edits it.
    requiredFields.forEach(function (field) {
        field.addEventListener("input", function () {
            if (field.checkValidity()) {
                field.removeAttribute("aria-invalid");
            }
        });

        field.addEventListener("change", function () {
            if (field.checkValidity()) {
                field.removeAttribute("aria-invalid");
            }
        });
    });

    // Handle the form submission.
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        /*
          IMPORTANT:
          This form is not connected to a backend yet.
          Do not show a fake "message sent" success message.

          When a backend or email service is configured,
          send the validated form data to that service here.
        */

        showStatus(
            "Your information is valid, but this demo form is not connected to a message delivery service yet. Please contact Tawana through an official communication channel.",
            "notice"
        );
    });

    // Initial counter value.
    updateCharacterCount();

});


// =========================================
// TAWANA FOOTER FUNCTIONALITY
// Add this code to your existing JavaScript file.
// =========================================

// Automatically display the current year.
const currentYearElement = document.querySelector(
  ".site-footer [data-current-year]"
);

if (currentYearElement) {
  currentYearElement.textContent = new Date().getFullYear();
}

// Newsletter form: front-end validation only.
// No subscription is stored or sent to a server.
const footerNewsletter = document.getElementById("footer-newsletter");
const footerEmail = document.getElementById("footer-email");
const footerMessage = document.getElementById("footer-form-message");

if (footerNewsletter && footerEmail && footerMessage) {
  footerNewsletter.addEventListener("submit", (event) => {
    event.preventDefault();

    footerMessage.textContent = "";
    footerMessage.removeAttribute("role");

    if (!footerEmail.checkValidity()) {
      footerEmail.reportValidity();
      return;
    }

    footerMessage.textContent =
      "Your email is valid, but newsletter subscriptions are not connected yet.";

    footerMessage.setAttribute("role", "status");
  });
}
