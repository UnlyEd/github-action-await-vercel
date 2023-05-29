"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.millisecondsFromInput = exports.BUILD_MAIN_FILENAME = exports.BUILD_DIR = exports.VERCEL_BASE_API_ENDPOINT = void 0;
const core_1 = require("@actions/core");
exports.VERCEL_BASE_API_ENDPOINT = 'https://api.vercel.com';
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
/**
 * Return the value of the specified action `input`, converted from seconds to milliseconds.
 */
function millisecondsFromInput(input) {
    return +(0, core_1.getInput)(input) * 1000;
}
exports.millisecondsFromInput = millisecondsFromInput;
