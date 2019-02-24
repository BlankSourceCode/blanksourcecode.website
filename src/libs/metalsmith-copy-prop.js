/* eslint-disable no-param-reassign */

'use strict';

const match = require('multimatch');

/**
 * Metalsmith plugin to copy metadata from one name to another
 *
 * @param {Object} options (optional)
 *   @property {Array} keys
 * @return {Function}
 */
const plugin = function (options) {
    options = options || {};
    return function (files, metalsmith, done) {
        const defaults = {
            pattern: '**',
        };
        const settings = Object.assign({}, defaults, options);

        if (!settings.from || !settings.to || !settings.pattern) {
            done(new Error('Invalid options'));
        }

        // Filter files by the pattern
        const matchedFiles = match(Object.keys(files), settings.pattern);

        matchedFiles.forEach((f) => {
            if (files[f]) {
                files[f][settings.to] = files[f][settings.from];
            }
        });

        setImmediate(done);
    };
};

// Expose Plugin
module.exports = plugin;
