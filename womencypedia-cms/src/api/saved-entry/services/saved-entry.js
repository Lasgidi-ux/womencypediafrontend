'use strict';

/**
 * saved-entry service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::saved-entry.saved-entry');
