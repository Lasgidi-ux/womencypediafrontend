/**
 * Womencypedia Internationalization (i18n) Module
 * 
 * Manages frontend locale switching and integrates with Strapi's i18n plugin.
 * - Detects user's preferred language from browser / localStorage
 * - Passes locale to all StrapiAPI requests automatically
 * - Provides UI translation strings for common labels
 * - Renders a language switcher dropdown component
 */

const I18N = {
    // Current active locale code (e.g. 'en', 'fr', 'es', 'ar', 'yo', 'sw')
    currentLocale: 'en',

    // Supported locales — must match Strapi Admin > Settings > Internationalization
    supportedLocales: [
        { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr', flag: '🇬🇧' },
        { code: 'fr', name: 'French', nativeName: 'Français', dir: 'ltr', flag: '🇫🇷' },
        { code: 'es', name: 'Spanish', nativeName: 'Español', dir: 'ltr', flag: '🇪🇸' },
        { code: 'pt', name: 'Portuguese', nativeName: 'Português', dir: 'ltr', flag: '🇵🇹' },
        { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl', flag: '🇸🇦' },
        { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', dir: 'ltr', flag: '🇰🇪' },
        { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', dir: 'ltr', flag: '🇳🇬' },
        { code: 'ha', name: 'Hausa', nativeName: 'Hausa', dir: 'ltr', flag: '🇳🇬' },
        { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', dir: 'ltr', flag: '🇪🇹' },
        { code: 'zh', name: 'Chinese', nativeName: '中文', dir: 'ltr', flag: '🇨🇳' },
    ],

    // localStorage key for persisting locale preference
    STORAGE_KEY: 'womencypedia_locale',

    // UI translation strings for common labels (page-level translations come from Strapi)
    translations: {
        en: {
            search: 'Search the archive...',
            donate: 'Donate',
            signIn: 'Sign In',
            signOut: 'Sign Out',
            explore: 'Explore',
            learn: 'Learn',
            participate: 'Participate',
            about: 'About',
            home: 'Home',
            browse: 'Browse',
            featured: 'Featured',
            collections: 'Collections',
            timelines: 'Timelines',
            education: 'Education',
            readMore: 'Read More',
            loading: 'Loading...',
            noResults: 'No results found',
            error: 'Something went wrong',
            retry: 'Retry',
            language: 'Language',
            profile: 'My Profile',
            allRegions: 'All Regions',
            allEras: 'All Eras',
            allCategories: 'All Categories',
            clearAll: 'Clear all',
            found: 'Found',
            results: 'results',
            privacyPolicy: 'Privacy Policy',
            termsOfUse: 'Terms of Use',
            copyright: '© 2026 Womencypedia Foundation. All rights reserved.',
            memberSince: 'Member since',
            editProfile: 'Edit Profile',
            saveChanges: 'Save Changes',
            cancel: 'Cancel',
        },
        fr: {
            search: 'Rechercher dans les archives...',
            donate: 'Faire un don',
            signIn: 'Se connecter',
            signOut: 'Se déconnecter',
            explore: 'Explorer',
            learn: 'Apprendre',
            participate: 'Participer',
            about: 'À propos',
            home: 'Accueil',
            browse: 'Parcourir',
            featured: 'En vedette',
            collections: 'Collections',
            timelines: 'Chronologies',
            education: 'Éducation',
            readMore: 'Lire la suite',
            loading: 'Chargement...',
            noResults: 'Aucun résultat trouvé',
            error: 'Une erreur est survenue',
            retry: 'Réessayer',
            language: 'Langue',
            profile: 'Mon profil',
            allRegions: 'Toutes les régions',
            allEras: 'Toutes les époques',
            allCategories: 'Toutes les catégories',
            clearAll: 'Tout effacer',
            found: 'Trouvé',
            results: 'résultats',
            privacyPolicy: 'Politique de confidentialité',
            termsOfUse: "Conditions d'utilisation",
            copyright: '© 2026 Fondation Womencypedia. Tous droits réservés.',
            memberSince: 'Membre depuis',
            editProfile: 'Modifier le profil',
            saveChanges: 'Enregistrer',
            cancel: 'Annuler',
        },
        es: {
            search: 'Buscar en el archivo...',
            donate: 'Donar',
            signIn: 'Iniciar sesión',
            signOut: 'Cerrar sesión',
            explore: 'Explorar',
            learn: 'Aprender',
            participate: 'Participar',
            about: 'Acerca de',
            home: 'Inicio',
            browse: 'Navegar',
            featured: 'Destacados',
            collections: 'Colecciones',
            timelines: 'Líneas de tiempo',
            education: 'Educación',
            readMore: 'Leer más',
            loading: 'Cargando...',
            noResults: 'No se encontraron resultados',
            error: 'Algo salió mal',
            retry: 'Reintentar',
            language: 'Idioma',
            profile: 'Mi perfil',
            allRegions: 'Todas las regiones',
            allEras: 'Todas las épocas',
            allCategories: 'Todas las categorías',
            clearAll: 'Borrar todo',
            found: 'Encontrados',
            results: 'resultados',
            privacyPolicy: 'Política de privacidad',
            termsOfUse: 'Términos de uso',
            copyright: '© 2026 Fundación Womencypedia. Todos los derechos reservados.',
            memberSince: 'Miembro desde',
            editProfile: 'Editar perfil',
            saveChanges: 'Guardar cambios',
            cancel: 'Cancelar',
        },
        ar: {
            search: 'ابحث في الأرشيف...',
            donate: 'تبرع',
            signIn: 'تسجيل الدخول',
            signOut: 'تسجيل الخروج',
            explore: 'استكشاف',
            learn: 'تعلم',
            participate: 'شارك',
            about: 'حول',
            home: 'الرئيسية',
            browse: 'تصفح',
            featured: 'مميز',
            collections: 'المجموعات',
            timelines: 'الجداول الزمنية',
            education: 'التعليم',
            readMore: 'اقرأ المزيد',
            loading: 'جاري التحميل...',
            noResults: 'لم يتم العثور على نتائج',
            error: 'حدث خطأ ما',
            retry: 'إعادة المحاولة',
            language: 'اللغة',
            profile: 'ملفي الشخصي',
            allRegions: 'جميع المناطق',
            allEras: 'جميع العصور',
            allCategories: 'جميع الفئات',
            clearAll: 'مسح الكل',
            found: 'وجدت',
            results: 'نتائج',
            privacyPolicy: 'سياسة الخصوصية',
            termsOfUse: 'شروط الاستخدام',
            copyright: '© 2026 مؤسسة ومنسيبيديا. جميع الحقوق محفوظة.',
            memberSince: 'عضو منذ',
            editProfile: 'تعديل الملف الشخصي',
            saveChanges: 'حفظ التغييرات',
            cancel: 'إلغاء',
        },
        sw: {
            search: 'Tafuta katika kumbukumbu...',
            donate: 'Changia',
            signIn: 'Ingia',
            signOut: 'Toka',
            explore: 'Chunguza',
            learn: 'Jifunze',
            participate: 'Shiriki',
            about: 'Kuhusu',
            home: 'Nyumbani',
            browse: 'Vinjari',
            featured: 'Pendekeza',
            collections: 'Makusanyo',
            timelines: 'Kalenda',
            education: 'Elimu',
            readMore: 'Soma zaidi',
            loading: 'Inapakia...',
            noResults: 'Hakuna matokeo yaliyopatikana',
            error: 'Kitu kimeenda vibaya',
            retry: 'Jaribu tena',
            language: 'Lugha',
            profile: 'Wasifu wangu',
            allRegions: 'Mikoa yote',
            allEras: 'Vipindi vyote',
            allCategories: 'Makundi yote',
            clearAll: 'Futa yote',
            found: 'Imepatikana',
            results: 'matokeo',
            privacyPolicy: 'Sera ya Faragha',
            termsOfUse: 'Masharti ya Matumizi',
            copyright: '© 2026 Shirika la Womencypedia. Haki zote zimehifadhiwa.',
            memberSince: 'Mwanachama tangu',
            editProfile: 'Hariri wasifu',
            saveChanges: 'Hifadhi mabadiliko',
            cancel: 'Ghairi',
        },
        yo: {
            search: 'Wa ninu ibi ipamọ...',
            donate: 'Ṣe iranlọwọ',
            signIn: 'Wọlé',
            signOut: 'Jáde',
            explore: 'Ṣàwárí',
            learn: 'Kọ ẹkọ',
            participate: 'Kópa',
            about: 'Nípa',
            home: 'Ilé',
            browse: 'Léwò',
            featured: 'Ìfojúsùn',
            collections: 'Àkójọpọ̀',
            timelines: 'Ìlà àkókò',
            education: 'Ẹ̀kọ́',
            readMore: 'Ka siwaju',
            loading: 'Nṣiṣẹ́...',
            noResults: 'A kò rí èsì kankan',
            error: 'Nǹkan kan ṣẹlẹ̀',
            retry: 'Tún gbìyànjú',
            language: 'Èdè',
            profile: 'Ìpèsè mi',
            allRegions: 'Gbogbo àgbègbè',
            allEras: 'Gbogbo ìgbà',
            allCategories: 'Gbogbo ẹ̀ka',
            clearAll: 'Pa gbogbo rẹ́',
            found: 'A rí',
            results: 'èsì',
            privacyPolicy: 'Ìlànà Àṣírí',
            termsOfUse: 'Àwọn Ìpèsè Lílo',
            copyright: '© 2026 Womencypedia Foundation. Gbogbo ẹ̀tọ́ ni a pa mọ́.',
            memberSince: 'Ọmọ ẹgbẹ́ láti',
            editProfile: 'Ṣàtúnṣe ìpèsè',
            saveChanges: 'Fi pamọ́ àtúnṣe',
            cancel: 'Fagilé',
        },
    },

    /**
     * Initialize the i18n module
     * - Detect locale from URL, localStorage, or browser
     * - Apply locale to DOM
     * - Render language switcher if container exists
     */
    init() {
        // Priority: 1. URL param  2. localStorage  3. browser language  4. 'en'
        const urlParams = new URLSearchParams(window.location.search);
        const urlLocale = urlParams.get('locale') || urlParams.get('lang');

        if (urlLocale && this.isSupported(urlLocale)) {
            this.currentLocale = urlLocale;
        } else {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored && this.isSupported(stored)) {
                this.currentLocale = stored;
            } else {
                // Detect from browser
                const browserLang = (navigator.language || navigator.userLanguage || 'en').split('-')[0];
                this.currentLocale = this.isSupported(browserLang) ? browserLang : 'en';
            }
        }

        // Persist
        localStorage.setItem(this.STORAGE_KEY, this.currentLocale);

        // Apply to DOM
        this.applyLocale();

        // Render language switcher if a container exists
        this.renderLanguageSwitcher();

        // Translate static UI strings on the page
        this.translatePage();

        console.log(`[i18n] Locale set to: ${this.currentLocale}`);
    },

    /**
     * Check if a locale code is supported
     */
    isSupported(code) {
        return this.supportedLocales.some(l => l.code === code);
    },

    /**
     * Get locale config object
     */
    getLocaleConfig(code) {
        return this.supportedLocales.find(l => l.code === code) || this.supportedLocales[0];
    },

    /**
     * Apply locale settings to the HTML document
     */
    applyLocale() {
        const config = this.getLocaleConfig(this.currentLocale);
        const html = document.documentElement;

        html.setAttribute('lang', this.currentLocale);
        html.setAttribute('dir', config.dir);

        // Add RTL class for CSS styling
        if (config.dir === 'rtl') {
            document.body.classList.add('rtl');
        } else {
            document.body.classList.remove('rtl');
        }
    },

    /**
     * Switch to a new locale
     * @param {string} newLocale - Locale code
     */
    switchLocale(newLocale) {
        if (!this.isSupported(newLocale) || newLocale === this.currentLocale) return;

        this.currentLocale = newLocale;
        localStorage.setItem(this.STORAGE_KEY, newLocale);

        // Apply DOM changes
        this.applyLocale();

        // Update URL with locale param (without full reload for SPA feel)
        const url = new URL(window.location);
        url.searchParams.set('locale', newLocale);
        window.history.replaceState({}, '', url);

        // Reload content from Strapi with new locale
        // Pages should listen for this event
        window.dispatchEvent(new CustomEvent('localeChanged', { detail: { locale: newLocale } }));

        // Translate static strings
        this.translatePage();

        // Update switcher UI
        this.renderLanguageSwitcher();

        // Reload the page to re-fetch all CMS content in new locale
        window.location.reload();
    },

    /**
     * Get a translated UI string
     * @param {string} key - Translation key
     * @param {Object} params - Optional interpolation params
     * @returns {string} Translated string
     */
    t(key, params = {}) {
        const localeStrings = this.translations[this.currentLocale] || this.translations['en'];
        let text = localeStrings[key] || this.translations['en'][key] || key;

        // Simple interpolation: {{count}} → params.count
        for (const [param, value] of Object.entries(params)) {
            text = text.replace(new RegExp(`{{${param}}}`, 'g'), value);
        }

        return text;
    },

    /**
     * Translate all elements with data-i18n attribute
     */
    translatePage() {
        // Translate elements with data-i18n="key"
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (key) {
                el.textContent = this.t(key);
            }
        });

        // Translate placeholders with data-i18n-placeholder="key"
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (key) {
                el.setAttribute('placeholder', this.t(key));
            }
        });

        // Translate aria-labels with data-i18n-aria="key"
        document.querySelectorAll('[data-i18n-aria]').forEach(el => {
            const key = el.getAttribute('data-i18n-aria');
            if (key) {
                el.setAttribute('aria-label', this.t(key));
            }
        });
    },

    /**
     * Render the language switcher dropdown into any container with id="language-switcher"
     */
    renderLanguageSwitcher() {
        const containers = document.querySelectorAll('#language-switcher, .language-switcher');
        if (containers.length === 0) return;

        const currentConfig = this.getLocaleConfig(this.currentLocale);

        const html = `
            <div class="relative group">
                <button 
                    class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-text-main hover:text-primary rounded-lg hover:bg-primary/5 transition-colors"
                    aria-label="Change language"
                    id="lang-switcher-btn">
                    <span class="text-base">${currentConfig.flag}</span>
                    <span class="hidden sm:inline">${currentConfig.nativeName}</span>
                    <span class="material-symbols-outlined text-[16px] transition-transform group-hover:rotate-180">expand_more</span>
                </button>
                <div class="lang-dropdown absolute top-full right-0 mt-1 bg-white border border-border-light rounded-xl shadow-xl py-2 min-w-[200px] z-[100] hidden">
                    ${this.supportedLocales.map(locale => `
                        <button 
                            onclick="I18N.switchLocale('${locale.code}')"
                            class="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${locale.code === this.currentLocale
                ? 'bg-primary/10 text-primary font-semibold'
                : 'text-text-main hover:bg-primary/5 hover:text-primary'}">
                            <span class="text-base">${locale.flag}</span>
                            <span class="flex-1 text-left">${locale.nativeName}</span>
                            ${locale.code === this.currentLocale ? '<span class="material-symbols-outlined text-[16px] text-primary">check</span>' : ''}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        containers.forEach(container => {
            container.innerHTML = html;

            // Toggle dropdown on click
            const btn = container.querySelector('#lang-switcher-btn');
            const dropdown = container.querySelector('.lang-dropdown');
            if (btn && dropdown) {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    dropdown.classList.toggle('hidden');
                });

                // Close on outside click
                document.addEventListener('click', () => {
                    dropdown.classList.add('hidden');
                });
            }
        });
    },

    /**
     * Get locale-aware date string
     * @param {string|Date} date - Date to format
     * @param {Object} options - Intl.DateTimeFormat options
     * @returns {string} Formatted date
     */
    formatDate(date, options = { year: 'numeric', month: 'long' }) {
        try {
            return new Intl.DateTimeFormat(this.currentLocale, options).format(new Date(date));
        } catch {
            return new Date(date).toLocaleDateString();
        }
    },

    /**
     * Get locale-aware number string
     * @param {number} num - Number to format
     * @returns {string} Formatted number
     */
    formatNumber(num) {
        try {
            return new Intl.NumberFormat(this.currentLocale).format(num);
        } catch {
            return num.toString();
        }
    }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    I18N.init();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18N;
}