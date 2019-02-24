/* eslint-disable no-param-reassign */

'use strict';

const moment = require('moment');

/**
 * Metalsmith plugin to collect topic metadata
 *
 * @param {Object} options (optional)
 *   @property {Array} keys
 * @return {Function}
 */
const plugin = function (options) {
    options = options || {};
    return function (files, metalsmith, done) {
        const defaults = {
            name: 'topics',
            global: 'allTopics',
            sort: '',
        };
        const settings = Object.assign({}, defaults, options);

        if (!settings.name || !settings.global) {
            done(new Error('Invalid options'));
        }

        const metadata = metalsmith.metadata();
        const tagHash = metadata[settings.global] || {};
        Object.keys(files).forEach((f) => {
            if (files[f]) {
                let tagsData = files[f][settings.name];
                if (tagsData) {
                    if (typeof tagsData === 'string') {
                        tagsData = tagsData.split(',');
                    }

                    tagsData.forEach((t) => {
                        const tag = String(t).trim();
                        if (!tagHash[tag]) {
                            tagHash[tag] = [];
                        }

                        tagHash[tag].push(files[f]);
                        if (settings.sort) {
                            tagHash[tag].sort((a, b) => (
                                moment(b[settings.date]).isBefore(a[settings.date]) ? -1 : 1));
                        }
                    });
                }
            }
        });

        metadata[settings.global] = tagHash;
        metalsmith.metadata(metadata);

        setImmediate(done);
    };
};

// Expose Plugin
module.exports = plugin;
