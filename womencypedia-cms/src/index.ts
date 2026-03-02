import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) { },

  /**
   * Bootstrap: auto-create locales and seed initial data
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // ── Auto-create locales matching the frontend locale files ──
    const localesToCreate = [
      { name: 'French', code: 'fr' },
      { name: 'Spanish', code: 'es' },
      { name: 'Portuguese', code: 'pt' },
      { name: 'Arabic', code: 'ar' },
      { name: 'Swahili', code: 'sw' },
      { name: 'Yoruba', code: 'yo' },
      { name: 'Hausa', code: 'ha' },
      { name: 'Hindi', code: 'hi' },
      { name: 'Chinese', code: 'zh' },
    ];

    try {
      const localeService = strapi.plugin('i18n')?.service('locales');
      if (!localeService) {
        strapi.log.warn('[Bootstrap] i18n plugin not found — skipping locale creation');
        return;
      }

      const existingLocales = await localeService.find();
      const existingCodes = existingLocales.map((l: any) => l.code);

      for (const locale of localesToCreate) {
        if (!existingCodes.includes(locale.code)) {
          strapi.log.info(`[Bootstrap] Creating locale: ${locale.name} (${locale.code})`);
          await localeService.create(locale);
        }
      }

      strapi.log.info(`[Bootstrap] Locales ready: ${existingLocales.length + localesToCreate.filter(l => !existingCodes.includes(l.code)).length} total`);
    } catch (err) {
      strapi.log.error('[Bootstrap] Error auto-creating locales:', err);
    }
  },
};
