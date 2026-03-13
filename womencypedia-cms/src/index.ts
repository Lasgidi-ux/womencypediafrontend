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
      } else {
        const existingLocales = await localeService.find();
        const existingCodes = existingLocales.map((l: any) => l.code);

        for (const locale of localesToCreate) {
          if (!existingCodes.includes(locale.code)) {
            strapi.log.info(`[Bootstrap] Creating locale: ${locale.name} (${locale.code})`);
            await localeService.create(locale);
          }
        }

        strapi.log.info(`[Bootstrap] Locales ready: ${existingLocales.length + localesToCreate.filter(l => !existingCodes.includes(l.code)).length} total`);
      }
    } catch (err) {
      strapi.log.error('[Bootstrap] Error auto-creating locales:', err);
    }

    // ── Set up public API permissions ──
    // This ensures the frontend can read content without authentication
    try {
      // Get the public role
      const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
        where: { type: 'public' },
      });

      if (!publicRole) {
        strapi.log.warn('[Bootstrap] Public role not found, skipping permissions setup');
      } else {
        // Content types that should be publicly readable
        const publicContentTypes = [
          'api::biography.biography',
          'api::collection.collection',
          'api::education-module.education-module',
          'api::fellowship.fellowship',
          'api::leader.leader',
          'api::partner.partner',
          'api::tag.tag',
          'api::homepage.homepage',
        ];

        // Get existing permissions for public role
        const publicPermissions = await strapi.query('plugin::users-permissions.permission').findMany({
          where: { role: publicRole.id },
        });

        // Add READ permissions for public content types
        for (const contentType of publicContentTypes) {
          // Check if find permission exists
          const existingFindPermission = publicPermissions.find(
            (p: any) => p.type === contentType && p.action === 'find'
          );

          if (!existingFindPermission) {
            await strapi.query('plugin::users-permissions.permission').create({
              data: {
                action: 'find',
                subject: contentType,
                role: publicRole.id,
                enabled: true,
              },
            });
            strapi.log.info(`[Bootstrap] Added find permission for ${contentType}`);
          }

          // Check if findOne permission exists
          const existingFindOnePermission = publicPermissions.find(
            (p: any) => p.type === contentType && p.action === 'findOne'
          );

          if (!existingFindOnePermission) {
            await strapi.query('plugin::users-permissions.permission').create({
              data: {
                action: 'findOne',
                subject: contentType,
                role: publicRole.id,
                enabled: true,
              },
            });
            strapi.log.info(`[Bootstrap] Added findOne permission for ${contentType}`);
          }
        }

        // Set up authenticated role for creating content (nominations, stories, etc.)
        const authenticatedRole = await strapi.query('plugin::users-permissions.role').findOne({
          where: { type: 'authenticated' },
        });

        if (authenticatedRole) {
          const authContentTypes = [
            'api::contribution.contribution',
            'api::nomination.nomination',
            'api::contact-submission.contact-submission',
            'api::comment.comment',
            'api::saved-entry.saved-entry',
          ];

          const authPermissions = await strapi.query('plugin::users-permissions.permission').findMany({
            where: { role: authenticatedRole.id },
          });

          for (const contentType of authContentTypes) {
            const existingCreatePermission = authPermissions.find(
              (p: any) => p.type === contentType && p.action === 'create'
            );

            if (!existingCreatePermission) {
              await strapi.query('plugin::users-permissions.permission').create({
                data: {
                  action: 'create',
                  subject: contentType,
                  role: authenticatedRole.id,
                  enabled: true,
                },
              });
              strapi.log.info(`[Bootstrap] Added create permission for ${contentType} (authenticated)`);
            }
          }
        }

        strapi.log.info('[Bootstrap] Public API permissions configured successfully');
      }
    } catch (err) {
      strapi.log.error('[Bootstrap] Error setting up permissions:', err);
    }
  },
};
