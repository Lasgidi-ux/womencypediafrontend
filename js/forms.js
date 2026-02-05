/**
 * Form Handler for Womencypedia Contribution Forms
 * Handles submission of nominations and stories with validation and API integration.
 */

const FormHandler = {
    /**
     * Initialize form handlers
     */
    init() {
        this.setupNominationForm();
        this.setupStoryForm();
    },

    /**
     * Set up nomination form handler
     */
    setupNominationForm() {
        const form = document.getElementById('nomination-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleNominationSubmit(form);
        });
    },

    /**
     * Set up story form handler
     */
    setupStoryForm() {
        const form = document.getElementById('story-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleStorySubmit(form);
        });
    },

    /**
     * Handle nomination form submission
     * @param {HTMLFormElement} form 
     */
    async handleNominationSubmit(form) {
        const submitBtn = form.querySelector('[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Validate form
        if (!this.validateForm(form)) {
            return;
        }

        // Collect form data
        const formData = {
            nomineeName: form.querySelector('#nomineeName').value,
            era: form.querySelector('#era').value,
            region: form.querySelector('#region').value,
            collection: form.querySelector('#collection').value,
            bio: form.querySelector('#bio').value,
            sources: form.querySelector('#sources').value,
            submitterName: form.querySelector('#yourName').value,
            submitterEmail: form.querySelector('#yourEmail').value,
            type: 'nomination',
            status: Auth.isAdmin() ? 'approved' : 'pending'
        };

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span class="material-symbols-outlined animate-spin">refresh</span>
            Submitting...
        `;

        try {
            await API.contributions.submitNomination(formData);

            // Show success message
            this.showSuccessMessage(form, {
                title: 'Nomination Submitted!',
                message: Auth.isAdmin()
                    ? 'The nomination has been added to the database.'
                    : 'Thank you for your nomination. Our editorial team will review it and contact you if we need additional information.',
                icon: 'person_add'
            });

            // Reset form
            form.reset();

        } catch (error) {
            // Show error message
            UI.showToast('Failed to submit nomination: ' + error.message, 'error');

            // Restore button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    },

    /**
     * Handle story form submission
     * @param {HTMLFormElement} form 
     */
    async handleStorySubmit(form) {
        const submitBtn = form.querySelector('[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Validate form
        if (!this.validateForm(form)) {
            return;
        }

        // Validate story length
        const story = form.querySelector('#story').value;
        if (story.split(/\s+/).length < 50) {
            UI.showToast('Please write at least 50 words for your story.', 'warning');
            form.querySelector('#story').focus();
            return;
        }

        // Check permission checkbox
        const permission = form.querySelector('[name="permission"]');
        if (!permission.checked) {
            UI.showToast('Please confirm the permission checkbox to submit your story.', 'warning');
            permission.focus();
            return;
        }

        // Collect form data
        const storyType = form.querySelector('[name="storyType"]:checked');
        const formData = {
            storyType: storyType ? storyType.value : 'other',
            subjectName: form.querySelector('#subjectName').value,
            relationship: form.querySelector('#relationship').value,
            region: form.querySelector('#storyRegion').value,
            theme: form.querySelector('#theme').value,
            story: story,
            lessons: form.querySelector('#lessons').value,
            contactName: form.querySelector('#contactName').value,
            contactEmail: form.querySelector('#contactEmail').value,
            permissionGranted: true,
            type: 'story',
            status: Auth.isAdmin() ? 'approved' : 'pending'
        };

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span class="material-symbols-outlined animate-spin">refresh</span>
            Submitting...
        `;

        try {
            await API.contributions.submitStory(formData);

            // Show success message
            this.showSuccessMessage(form, {
                title: 'Story Submitted!',
                message: Auth.isAdmin()
                    ? 'The story has been added to the database.'
                    : 'Thank you for sharing this story. Our editorial team will review it and may reach out for additional details or verification.',
                icon: 'auto_stories'
            });

            // Reset form
            form.reset();

        } catch (error) {
            // Show error message
            UI.showToast('Failed to submit story: ' + error.message, 'error');

            // Restore button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    },

    /**
     * Validate form fields
     * @param {HTMLFormElement} form 
     * @returns {boolean}
     */
    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            // Remove previous error styling
            field.classList.remove('border-red-500');

            if (!field.value.trim()) {
                field.classList.add('border-red-500');
                isValid = false;
            }

            // Email validation
            if (field.type === 'email' && field.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value)) {
                    field.classList.add('border-red-500');
                    isValid = false;
                }
            }
        });

        if (!isValid) {
            UI.showToast('Please fill in all required fields.', 'warning');

            // Focus first invalid field
            const firstInvalid = form.querySelector('.border-red-500');
            if (firstInvalid) {
                firstInvalid.focus();
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }

        return isValid;
    },

    /**
     * Show success message after form submission
     * @param {HTMLFormElement} form 
     * @param {Object} options 
     */
    showSuccessMessage(form, options) {
        const formContainer = form.closest('.bg-white');
        if (!formContainer) return;

        const { title, message, icon } = options;

        formContainer.innerHTML = `
            <div class="text-center py-12">
                <div class="size-20 rounded-full bg-accent-teal/20 flex items-center justify-center mx-auto mb-6">
                    <span class="material-symbols-outlined text-accent-teal text-4xl">${icon}</span>
                </div>
                <h2 class="font-serif text-2xl font-bold text-text-main mb-4">${title}</h2>
                <p class="text-text-secondary max-w-md mx-auto mb-8">${message}</p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="browse.html" class="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2">
                        <span class="material-symbols-outlined text-[18px]">library_books</span>
                        Browse Encyclopedia
                    </a>
                    <button onclick="window.location.reload()" class="px-6 py-3 border border-border-light rounded-lg font-bold hover:bg-background-cream transition-colors inline-flex items-center justify-center gap-2">
                        <span class="material-symbols-outlined text-[18px]">add</span>
                        Submit Another
                    </button>
                </div>
            </div>
        `;
    }
};

// Initialize form handlers when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    FormHandler.init();
});

// Also check for forms that might be dynamically loaded
if (document.getElementById('nomination-form') || document.getElementById('story-form')) {
    FormHandler.init();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormHandler;
}
