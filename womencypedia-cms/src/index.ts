import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) { },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
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
      const localeService = strapi.plugin('i18n')?.service('locales');
      if (!localeService) return;

      const existingLocales = await localeService.find();
      const existingCodes = existingLocales.map((l: any) => l.code);

      for (const locale of localesToCreate) {
        if (!existingCodes.includes(locale.code)) {
          console.log(`[Bootstrap] Creating locale: ${locale.name} (${locale.code})`);
          await localeService.create(locale);
        }
      }
    } catch (err) {
      console.error('[Bootstrap] Error auto-creating locales:', err);
    }
  },
};
