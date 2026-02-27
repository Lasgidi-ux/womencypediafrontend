"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = ({ env }) => {
    // Base config (always applied)
    const pluginConfig = {};
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
exports.default = config;
