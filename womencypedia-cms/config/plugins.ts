import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => {
    // Base config (always applied)
    const pluginConfig: Record<string, unknown> = {};

    // Cloudinary upload provider (production only)
    // Render uses ephemeral filesystem — local uploads are lost on redeploy
    if (env('CLOUDINARY_NAME')) {
        pluginConfig.upload = {
            config: {
                provider: '@strapi/provider-upload-cloudinary',
                providerOptions: {
                    cloud_name: env('CLOUDINARY_NAME'),
                    api_key: env('CLOUDINARY_KEY'),
                    api_secret: env('CLOUDINARY_SECRET'),
                },
                actionOptions: {
                    upload: {},
                    uploadStream: {},
                    delete: {},
                },
            },
        };
    }

    return pluginConfig;
};

export default config;
