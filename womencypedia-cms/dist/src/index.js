"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    /**
     * An asynchronous register function that runs before
     * your application is initialized.
     *
     * This gives you an opportunity to extend code.
     */
    register( /* { strapi }: { strapi: Core.Strapi } */) { },
    /**
     * An asynchronous bootstrap function that runs before
     * your application gets started.
     *
     * This gives you an opportunity to set up your data model,
     * run jobs, or perform some special logic.
     */
    async bootstrap({ strapi }) {
        var _a;
        const localesToCreate = [
            { name: 'French', code: 'fr' },
            { name: 'Spanish', code: 'es' },
            { name: 'German', code: 'de' },
            { name: 'Italian', code: 'it' },
            { name: 'Portuguese', code: 'pt' },
            { name: 'Chinese', code: 'zh' },
            { name: 'Japanese', code: 'ja' },
            { name: 'Korean', code: 'ko' },
            { name: 'Arabic', code: 'ar' },
            { name: 'Russian', code: 'ru' },
        ];
        try {
            const localeService = (_a = strapi.plugin('i18n')) === null || _a === void 0 ? void 0 : _a.service('locales');
            if (!localeService)
                return;
            const existingLocales = await localeService.find();
            const existingCodes = existingLocales.map((l) => l.code);
            for (const locale of localesToCreate) {
                if (!existingCodes.includes(locale.code)) {
                    console.log(`[Bootstrap] Creating locale: ${locale.name} (${locale.code})`);
                    await localeService.create(locale);
                }
            }
        }
        catch (err) {
            console.error('[Bootstrap] Error auto-creating locales:', err);
        }
    },
};
