"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = [
    'strapi::logger',
    'strapi::errors',
    {
        name: 'strapi::security',
        config: {
            contentSecurityPolicy: {
                useDefaults: true,
                directives: {
                    'connect-src': ["'self'", 'https:'],
                    'img-src': [
                        "'self'",
                        'data:',
                        'blob:',
                        'market-assets.strapi.io',
                        'res.cloudinary.com',
                    ],
                    'media-src': [
                        "'self'",
                        'data:',
                        'blob:',
                        'res.cloudinary.com',
                    ],
                    upgradeInsecureRequests: null,
                },
            },
        },
    },
    {
        name: 'strapi::cors',
        config: {
            origin: [
                'http://localhost:5500',
                'http://127.0.0.1:5500',
                'http://localhost:3000',
                'https://womencypedia.org',
                'https://www.womencypedia.org',
                'https://kehindeisa.onrender.com',
            ],
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
            headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
            keepHeaderOnError: true,
        },
    },
    'strapi::poweredBy',
    'strapi::query',
    'strapi::body',
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
];
exports.default = config;
