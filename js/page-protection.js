/**
 * Womencypedia Page Protection Module
 * 
 * Enforces authentication and role-based access control on protected pages.
 */

const PageProtection = {
    /**
     * Check if page protection has already been applied
     * @returns {boolean} True if protection has been applied
     */
    isProtected() {
        return window._pageProtectionActive === true;
    },

    /**
     * Protect current page - requires authentication
     * @param {string} requiredRole - Optional role requirement (e.g., 'admin')
     */
    protect(requiredRole = null) {
        // Idempotent check - prevent double protection
        if (this.isProtected()) {
            
            return;
        }

        // Mark as protected
        window._pageProtectionActive = true;

        // Wait for Auth to initialize
        if (typeof Auth === 'undefined') {
            
            window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.pathname);
            return;
        }

        // Check authentication
        if (!Auth.isAuthenticated()) {
            window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.pathname);
            return;
        }

        // Check role if required
        if (requiredRole && requiredRole !== 'contributor') {
            if (requiredRole === 'admin' && !Auth.isAdmin()) {
                window.location.href = '403.html';
                return;
            }
        }

        
    },

    /**
     * Protect page - redirect to login if not authenticated
     * @param {string} redirectTo - Page to redirect after login
     */
    requireAuth(redirectTo = null) {
        // Check if Auth module is loaded
        if (typeof Auth === 'undefined') {
            
            const redirect = redirectTo || window.location.pathname;
            window.location.href = 'login.html?redirect=' + encodeURIComponent(redirect);
            return;
        }

        if (!Auth.isAuthenticated()) {
            const redirect = redirectTo || window.location.pathname;
            window.location.href = 'login.html?redirect=' + encodeURIComponent(redirect);
        }
    },

    /**
     * Protect page - require admin role
     */
    requireAdmin() {
        // Idempotent check - prevent double protection
        if (this.isProtected()) {
            
            return;
        }

        // Mark as protected
        window._pageProtectionActive = true;

        if (typeof Auth === 'undefined') {
            
            window.location.href = '403.html';
            return;
        }
        if (!Auth.isAuthenticated() || !Auth.isAdmin()) {
            window.location.href = '403.html';
        }
    }
};

// Auto-protect if data-protection attribute is on body
document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;

    if (body.hasAttribute('data-protection')) {
        const role = body.getAttribute('data-protection');
        if (role === 'admin') {
            PageProtection.requireAdmin();
        } else if (role === 'auth') {
            PageProtection.protect();
        }
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PageProtection;
}
