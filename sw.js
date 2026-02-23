/**
 * Womencypedia Service Worker
 * Provides offline caching and PWA support
 */

const CACHE_NAME = 'womencypedia-v2';
const OFFLINE_URL = '404.html';

const PRECACHE_ASSETS = [
    '/',
    '/index.html',
    '/css/tailwind.css',
    '/css/styles.css',
    '/js/config.js',
    '/js/ui.js',
    '/js/auth.js',
    '/js/mockApi.js',
    '/js/api.js',
    '/js/main.js',
    '/js/navigation.js',
    '/images/womencypedia-logo.png',
    '/manifest.json'
];

// Install event - cache core assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                // Use addAll with individual error handling
                return Promise.allSettled(
                    PRECACHE_ASSETS.map(url =>
                        cache.add(url).catch(err => {
                            console.warn(`SW: Failed to cache ${url}:`, err.message);
                        })
                    )
                );
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const requestUrl = event.request.url;

    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Skip chrome-extension, browser-extension, and non-http(s) schemes
    if (!requestUrl.startsWith('http://') && !requestUrl.startsWith('https://')) return;

    // Skip API requests
    if (requestUrl.includes('/api/') || requestUrl.includes('womencypedia-api')) return;

    // Skip analytics, tracking, and third-party SDK requests
    if (requestUrl.includes('launchdarkly') || requestUrl.includes('analytics')) return;

    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    // Return cached version but also update cache in background
                    event.waitUntil(
                        fetch(event.request)
                            .then(response => {
                                if (response && response.ok && response.type !== 'opaque') {
                                    const responseClone = response.clone();
                                    caches.open(CACHE_NAME)
                                        .then(cache => {
                                            // Only cache same-origin or CORS-approved responses
                                            if (response.type === 'basic' || response.type === 'cors') {
                                                cache.put(event.request, responseClone);
                                            }
                                        })
                                        .catch(() => { /* ignore cache errors */ });
                                }
                            })
                            .catch(() => { /* ignore network errors for background update */ })
                    );
                    return cachedResponse;
                }

                // Not in cache - fetch from network
                return fetch(event.request)
                    .then(response => {
                        // Only cache valid, same-origin responses
                        if (response && response.ok && response.type === 'basic') {
                            const responseClone = response.clone();
                            caches.open(CACHE_NAME)
                                .then(cache => cache.put(event.request, responseClone))
                                .catch(() => { /* ignore cache errors */ });
                        }
                        return response;
                    })
                    .catch(() => {
                        // Offline fallback for navigation requests
                        if (event.request.mode === 'navigate') {
                            return caches.match(OFFLINE_URL);
                        }
                        // Return an empty response for other failed requests
                        return new Response('', {
                            status: 408,
                            statusText: 'Offline'
                        });
                    });
            })
    );
});
