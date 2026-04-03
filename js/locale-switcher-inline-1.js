// Initialize locale switcher when DOM is ready
    document.addEventListener('DOMContentLoaded', function () {
        if (typeof I18N !== 'undefined') {
            I18N.createLocaleSwitcher('locale-switcher');
        } else {
            
        }
    });