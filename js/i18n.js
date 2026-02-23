/**
 * Womencypedia Internationalization (i18n) Module
 * 
 * Provides multi-language support for the frontend.
 * Works with Strapi's i18n system for content localization.
 * 
 * Supported Locales:
 * - en: English (default)
 * - fr: French - West/Central Africa
 * - pt: Portuguese - Lusophone Africa
 * - sw: Swahili - East Africa
 * - ha: Hausa - West Africa
 * - yo: Yoruba - Nigeria
 * - ar: Arabic - North Africa
 * - es: Spanish - International
 * - zh: Chinese - International
 * - hi: Hindi - International
 */

const I18N = {
    // Current active locale
    currentLocale: 'en',

    // All supported locales with metadata
    supportedLocales: [
        { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr', flag: '🇬🇧' },
        { code: 'fr', name: 'French', nativeName: 'Français', dir: 'ltr', flag: '🇫🇷' },
        { code: 'pt', name: 'Portuguese', nativeName: 'Português', dir: 'ltr', flag: '🇵🇹' },
        { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', dir: 'ltr', flag: '🇹🇿' },
        { code: 'ha', name: 'Hausa', nativeName: 'Hausa', dir: 'ltr', flag: '🇳🇬' },
        { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', dir: 'ltr', flag: '🇳🇬' },
        { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl', flag: '🇸🇦' },
        { code: 'es', name: 'Spanish', nativeName: 'Español', dir: 'ltr', flag: '🇪🇸' },
        { code: 'zh', name: 'Chinese', nativeName: '中文', dir: 'ltr', flag: '🇨🇳' },
        { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', dir: 'ltr', flag: '🇮🇳' }
    ],

    // Translation storage
    translations: {},

    // Fallback locale when translation not found
    fallbackLocale: 'en',

    // Storage key for locale preference
    STORAGE_KEY: 'womencypedia_locale',

    /**
     * Initialize i18n system
     * Detects user's preferred locale and loads translations
     */
    async init() {
        // Get stored preference, browser language, or default
        const stored = localStorage.getItem(this.STORAGE_KEY);
        const browserLang = navigator.language.split('-')[0];
        const defaultLocale = this.supportedLocales.find(l => l.code === browserLang)?.code;

        this.currentLocale = stored || defaultLocale || this.fallbackLocale;

        // Load translations
        await this.loadTranslations(this.currentLocale);

        // Apply translations to DOM
        this.applyTranslations();

        // Update HTML lang attribute
        this.updateDocumentLocale();

        // Dispatch ready event
        window.dispatchEvent(new CustomEvent('i18n:ready', {
            detail: { locale: this.currentLocale }
        }));

        console.info(`[I18N] Initialized with locale: ${this.currentLocale}`);
    },

    /**
     * Load translations for a specific locale
     * @param {string} locale - Locale code (e.g., 'en', 'fr')
     */
    async loadTranslations(locale) {
        // Try to load from local JSON file first
        try {
            const response = await fetch(`locales/${locale}.json`);
            if (response.ok) {
                this.translations = await response.json();
                return;
            }
        } catch (error) {
            console.warn(`[I18N] Local translations not found for ${locale}`);
        }

        // Fallback to embedded translations for common UI elements
        this.translations = this.getEmbeddedTranslations(locale);

        // If still not found and not fallback, load fallback
        if (Object.keys(this.translations).length === 0 && locale !== this.fallbackLocale) {
            await this.loadTranslations(this.fallbackLocale);
        }
    },

    /**
     * Get embedded translations for critical UI elements
     * These serve as fallbacks when translation files aren't available
     */
    getEmbeddedTranslations(locale) {
        const translations = {
            en: {
                // Navigation
                'nav.home': 'Home',
                'nav.browse': 'Browse',
                'nav.featured': 'Featured',
                'nav.collections': 'Collections',
                'nav.timelines': 'Timelines',
                'nav.education': 'Education',
                'nav.enterprises': 'Enterprises',
                'nav.research': 'Research',
                'nav.publications': 'Publications',
                'nav.resources': 'Resources',
                'nav.about': 'About',
                'nav.contact': 'Contact',
                'nav.donate': 'Donate',
                'nav.login': 'Login',
                'nav.signup': 'Sign Up',
                'nav.profile': 'Profile',
                'nav.settings': 'Settings',
                'nav.logout': 'Logout',

                // Search
                'search.placeholder': 'Search women, cultures, eras…',
                'search.no_results': 'No results found',
                'search.results': '{count} results found',

                // Browse
                'browse.title': 'Browse Biographies',
                'browse.filter.region': 'Region',
                'browse.filter.era': 'Era',
                'browse.filter.category': 'Category',
                'browse.filter.all': 'All',
                'browse.load_more': 'Load More',

                // Biography
                'biography.early_life': 'Early Life',
                'biography.path_to_influence': 'Path to Influence',
                'biography.contributions': 'Contributions',
                'biography.legacy': 'Legacy',
                'biography.sources': 'Sources',
                'biography.related': 'Related Women',
                'biography.share': 'Share this story',

                // Auth
                'auth.login.title': 'Login',
                'auth.login.email': 'Email',
                'auth.login.password': 'Password',
                'auth.login.forgot': 'Forgot password?',
                'auth.login.submit': 'Login',
                'auth.login.no_account': "Don't have an account?",
                'auth.signup.title': 'Create Account',
                'auth.signup.name': 'Full Name',
                'auth.signup.confirm_password': 'Confirm Password',
                'auth.signup.submit': 'Create Account',
                'auth.signup.have_account': 'Already have an account?',

                // Forms
                'form.submit': 'Submit',
                'form.cancel': 'Cancel',
                'form.saving': 'Saving…',
                'form.success': 'Success!',
                'form.error': 'An error occurred',
                'form.required': 'This field is required',
                'form.email.invalid': 'Please enter a valid email',
                'form.password.short': 'Password must be at least 8 characters',
                'form.password.mismatch': 'Passwords do not match',

                // Common
                'common.loading': 'Loading…',
                'common.error': 'Error',
                'common.retry': 'Retry',
                'common.close': 'Close',
                'common.save': 'Save',
                'common.delete': 'Delete',
                'common.edit': 'Edit',
                'common.view_all': 'View All',
                'common.read_more': 'Read More',
                'common.back': 'Back',
                'common.next': 'Next',
                'common.previous': 'Previous',

                // Footer
                'footer.about': 'About Womencypedia',
                'footer.privacy': 'Privacy Policy',
                'footer.terms': 'Terms of Use',
                'footer.accessibility': 'Accessibility',
                'footer.contact': 'Contact',
                'footer.copyright': '© {year} Womencypedia. All rights reserved.',

                // Notifications
                'notification.welcome': 'Welcome to Womencypedia!',
                'notification.saved': 'Saved successfully',
                'notification.copied': 'Copied to clipboard',

                // Language
                'language.select': 'Select Language',
                'language.current': 'Current language: {lang}'
            },
            fr: {
                'nav.home': 'Accueil',
                'nav.browse': 'Parcourir',
                'nav.featured': 'En vedette',
                'nav.collections': 'Collections',
                'nav.timelines': 'Chronologies',
                'nav.education': 'Éducation',
                'nav.about': 'À propos',
                'nav.contact': 'Contact',
                'nav.donate': 'Faire un don',
                'nav.login': 'Connexion',
                'nav.signup': "S'inscrire",
                'search.placeholder': 'Rechercher des femmes, cultures, époques…',
                'browse.title': 'Parcourir les biographies',
                'common.loading': 'Chargement…',
                'common.error': 'Erreur',
                'common.save': 'Enregistrer',
                'common.close': 'Fermer',
                'footer.copyright': '© {year} Womencypedia. Tous droits réservés.',
                'language.select': 'Sélectionner la langue'
            },
            sw: {
                'nav.home': 'Nyumbani',
                'nav.browse': 'Vinjari',
                'nav.featured': 'Zilizochaguliwa',
                'nav.collections': 'Makusanyo',
                'nav.about': 'Kuhusu',
                'nav.contact': 'Wasiliana',
                'nav.login': 'Ingia',
                'nav.signup': 'Jisajili',
                'search.placeholder': 'Tafuta wanawake, tamaduni, nyakati…',
                'common.loading': 'Inapakia…',
                'common.save': 'Hifadhi',
                'common.close': 'Funga'
            },
            ha: {
                'nav.home': 'Gida',
                'nav.browse': 'Bincika',
                'nav.about': 'Game da',
                'nav.contact': 'Tuntuɓi',
                'nav.login': 'Shiga',
                'nav.signup': 'Yi rajista',
                'search.placeholder': 'Nemo mata, al\'adu, zamanai…',
                'common.loading': 'Ana loda…',
                'common.save': 'Ajiye',
                'common.close': 'Rufe'
            },
            yo: {
                'nav.home': 'Ilé',
                'nav.browse': 'Wáwọ́',
                'nav.about': 'Nípa',
                'nav.contact': 'Kọntáàkì',
                'nav.login': 'Wọlé',
                'nav.signup': 'Forúkọsílẹ̀',
                'search.placeholder': 'Wá àwọn obìnrin, àṣà, àkókò…',
                'common.loading': 'Ó ń lòádì…',
                'common.save': 'Fi pamọ́',
                'common.close': 'Pa'
            },
            ar: {
                'nav.home': 'الرئيسية',
                'nav.browse': 'تصفح',
                'nav.featured': 'مميز',
                'nav.collections': 'مجموعات',
                'nav.about': 'حول',
                'nav.contact': 'اتصل',
                'nav.login': 'تسجيل الدخول',
                'nav.signup': 'التسجيل',
                'search.placeholder': 'البحث عن النساء، الثقافات، الحقب…',
                'common.loading': 'جاري التحميل…',
                'common.save': 'حفظ',
                'common.close': 'إغلاق',
                'language.select': 'اختر اللغة'
            },
            pt: {
                'nav.home': 'Início',
                'nav.browse': 'Navegar',
                'nav.featured': 'Destaques',
                'nav.collections': 'Coleções',
                'nav.about': 'Sobre',
                'nav.contact': 'Contato',
                'nav.login': 'Entrar',
                'nav.signup': 'Cadastrar',
                'search.placeholder': 'Pesquisar mulheres, culturas, eras…',
                'common.loading': 'Carregando…',
                'common.save': 'Salvar',
                'common.close': 'Fechar'
            },
            es: {
                'nav.home': 'Inicio',
                'nav.browse': 'Explorar',
                'nav.featured': 'Destacados',
                'nav.collections': 'Colecciones',
                'nav.about': 'Acerca de',
                'nav.contact': 'Contacto',
                'nav.login': 'Iniciar sesión',
                'nav.signup': 'Registrarse',
                'search.placeholder': 'Buscar mujeres, culturas, épocas…',
                'common.loading': 'Cargando…',
                'common.save': 'Guardar',
                'common.close': 'Cerrar'
            },
            zh: {
                'nav.home': '首页',
                'nav.browse': '浏览',
                'nav.featured': '精选',
                'nav.collections': '合集',
                'nav.about': '关于',
                'nav.contact': '联系',
                'nav.login': '登录',
                'nav.signup': '注册',
                'search.placeholder': '搜索女性、文化、时代…',
                'common.loading': '加载中…',
                'common.save': '保存',
                'common.close': '关闭'
            },
            hi: {
                'nav.home': 'होम',
                'nav.browse': 'ब्राउज़',
                'nav.about': 'परिचय',
                'nav.contact': 'संपर्क',
                'nav.login': 'लॉग इन',
                'nav.signup': 'साइन अप',
                'search.placeholder': 'महिलाओं, संस्कृतियों, युगों को खोजें…',
                'common.loading': 'लोड हो रहा है…',
                'common.save': 'सहेजें',
                'common.close': 'बंद करें'
            }
        };

        return translations[locale] || translations[this.fallbackLocale] || {};
    },

    /**
     * Get translation by key with optional parameter interpolation
     * @param {string} key - Translation key (e.g., 'nav.home')
     * @param {Object} params - Parameters for interpolation (e.g., { count: 5 })
     * @returns {string} - Translated string
     */
    t(key, params = {}) {
        let text = this.translations[key];

        // If not found, try fallback locale
        if (!text && this.currentLocale !== this.fallbackLocale) {
            const fallbackTranslations = this.getEmbeddedTranslations(this.fallbackLocale);
            text = fallbackTranslations[key];
        }

        // If still not found, return the key itself
        if (!text) {
            console.warn(`[I18N] Translation not found: ${key}`);
            return key;
        }

        // Replace parameters like {count}, {name}, etc.
        Object.keys(params).forEach(param => {
            text = text.replace(new RegExp(`\\{${param}\\}`, 'g'), params[param]);
        });

        return text;
    },

    /**
     * Change the current locale
     * @param {string} locale - New locale code
     */
    async setLocale(locale) {
        // Validate locale
        if (!this.supportedLocales.find(l => l.code === locale)) {
            console.error(`[I18N] Unsupported locale: ${locale}`);
            return;
        }

        const previousLocale = this.currentLocale;
        this.currentLocale = locale;

        // Store preference
        localStorage.setItem(this.STORAGE_KEY, locale);

        // Load new translations
        await this.loadTranslations(locale);

        // Apply to DOM
        this.applyTranslations();
        this.updateDocumentLocale();

        // Dispatch change event
        window.dispatchEvent(new CustomEvent('i18n:localeChanged', {
            detail: {
                locale,
                previousLocale
            }
        }));

        console.info(`[I18N] Locale changed to: ${locale}`);
    },

    /**
     * Get current locale info
     * @returns {Object} - Locale metadata
     */
    getCurrentLocaleInfo() {
        return this.supportedLocales.find(l => l.code === this.currentLocale) ||
            this.supportedLocales[0];
    },

    /**
     * Apply translations to DOM elements with data-i18n attributes
     */
    applyTranslations() {
        // Text content
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.textContent = this.t(key);
        });

        // Placeholder attribute
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            el.placeholder = this.t(key);
        });

        // Title attribute
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            el.title = this.t(key);
        });

        // Aria-label attribute
        document.querySelectorAll('[data-i18n-aria]').forEach(el => {
            const key = el.getAttribute('data-i18n-aria');
            el.setAttribute('aria-label', this.t(key));
        });
    },

    /**
     * Update document language attributes
     */
    updateDocumentLocale() {
        const localeInfo = this.getCurrentLocaleInfo();

        // Update HTML lang attribute
        document.documentElement.lang = this.currentLocale;

        // Update text direction for RTL languages
        document.documentElement.dir = localeInfo.dir || 'ltr';

        // Update meta tags
        const ogLocale = document.querySelector('meta[property="og:locale"]');
        if (ogLocale) {
            ogLocale.content = this.currentLocale;
        }
    },

    /**
     * Format a date according to current locale
     * @param {Date|string} date - Date to format
     * @param {Object} options - Intl.DateTimeFormat options
     * @returns {string} - Formatted date string
     */
    formatDate(date, options = {}) {
        const dateObj = date instanceof Date ? date : new Date(date);
        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };

        try {
            return new Intl.DateTimeFormat(this.currentLocale, {
                ...defaultOptions,
                ...options
            }).format(dateObj);
        } catch (error) {
            return new Intl.DateTimeFormat(this.fallbackLocale, defaultOptions).format(dateObj);
        }
    },

    /**
     * Format a number according to current locale
     * @param {number} number - Number to format
     * @param {Object} options - Intl.NumberFormat options
     * @returns {string} - Formatted number string
     */
    formatNumber(number, options = {}) {
        try {
            return new Intl.NumberFormat(this.currentLocale, options).format(number);
        } catch (error) {
            return new Intl.NumberFormat(this.fallbackLocale).format(number);
        }
    },

    /**
     * Format a relative time (e.g., "2 days ago")
     * @param {number} value - Numeric value
     * @param {string} unit - Unit (second, minute, hour, day, week, month, year)
     * @returns {string} - Formatted relative time
     */
    formatRelativeTime(value, unit) {
        try {
            const rtf = new Intl.RelativeTimeFormat(this.currentLocale, {
                numeric: 'auto'
            });
            return rtf.format(value, unit);
        } catch (error) {
            const rtf = new Intl.RelativeTimeFormat(this.fallbackLocale, {
                numeric: 'auto'
            });
            return rtf.format(value, unit);
        }
    },

    /**
     * Create locale switcher HTML
     * @param {string} containerId - ID of container element
     */
    createLocaleSwitcher(containerId = 'locale-switcher') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const currentLocale = this.getCurrentLocaleInfo();

        container.innerHTML = `
            <div class="locale-switcher relative">
                <button 
                    type="button" 
                    class="locale-switcher-btn flex items-center gap-2 px-3 py-2 rounded-lg border border-border-light bg-white hover:bg-gray-50 transition-colors"
                    aria-expanded="false"
                    aria-haspopup="listbox"
                    aria-label="${this.t('language.select')}"
                    onclick="I18N.toggleLocaleDropdown()"
                >
                    <span class="locale-flag text-lg">${currentLocale.flag}</span>
                    <span class="locale-name hidden sm:inline">${currentLocale.nativeName}</span>
                    <span class="material-symbols-outlined text-sm">expand_more</span>
                </button>
                
                <div 
                    id="locale-dropdown"
                    class="locale-dropdown hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border-light py-1 z-50"
                    role="listbox"
                    aria-label="${this.t('language.select')}"
                >
                    ${this.supportedLocales.map(locale => `
                        <button
                            type="button"
                            class="locale-option w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors ${locale.code === this.currentLocale ? 'bg-primary/5 text-primary' : ''}"
                            role="option"
                            aria-selected="${locale.code === this.currentLocale}"
                            onclick="I18N.setLocale('${locale.code}')"
                        >
                            <span class="text-lg">${locale.flag}</span>
                            <span class="flex-1">${locale.nativeName}</span>
                            ${locale.code === this.currentLocale ? '<span class="material-symbols-outlined text-primary text-sm">check</span>' : ''}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    },

    /**
     * Toggle locale dropdown visibility
     */
    toggleLocaleDropdown() {
        const dropdown = document.getElementById('locale-dropdown');
        const button = document.querySelector('.locale-switcher-btn');

        if (!dropdown || !button) return;

        const isHidden = dropdown.classList.contains('hidden');

        if (isHidden) {
            dropdown.classList.remove('hidden');
            button.setAttribute('aria-expanded', 'true');

            // Close on outside click
            setTimeout(() => {
                document.addEventListener('click', this.closeDropdownOnOutsideClick);
            }, 0);
        } else {
            dropdown.classList.add('hidden');
            button.setAttribute('aria-expanded', 'false');
            document.removeEventListener('click', this.closeDropdownOnOutsideClick);
        }
    },

    /**
     * Close dropdown when clicking outside
     */
    closeDropdownOnOutsideClick(event) {
        const dropdown = document.getElementById('locale-dropdown');
        const switcher = document.querySelector('.locale-switcher');

        if (switcher && !switcher.contains(event.target)) {
            dropdown?.classList.add('hidden');
            document.querySelector('.locale-switcher-btn')?.setAttribute('aria-expanded', 'false');
            document.removeEventListener('click', this.closeDropdownOnOutsideClick);
        }
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    I18N.init();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18N;
}