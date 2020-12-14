"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BUILD_MAIN_FILENAME = exports.BUILD_DIR = exports.DEFAULT_TIMEOUT = exports.VERCEL_BASE_API_ENDPOINT = void 0;
exports.VERCEL_BASE_API_ENDPOINT = 'https://api.vercel.com';
/**
 * Timeout (in seconds) used by default if no custom timeout is provided as input.
 */
exports.DEFAULT_TIMEOUT = 10;
/**
 * Directory where the compiled version (JS) of the TS code is stored.
 *
 * XXX Should match the package.json:main value.
 */
exports.BUILD_DIR = 'lib';
/**
 * Name of the Action's entrypoint.
 *
 * XXX Should match the package.json:main value.
 */
exports.BUILD_MAIN_FILENAME = 'main.js';
