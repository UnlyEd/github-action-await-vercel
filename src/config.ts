export const VERCEL_BASE_API_ENDPOINT = 'https://api.vercel.com';

/**
 * Timeout (in seconds) used by default if no custom timeout is provided as input.
 */
export const DEFAULT_TIMEOUT = 10;

/**
 * Directory where the compiled version (JS) of the TS code is stored.
 *
 * XXX Should match the package.json:main value.
 */
export const BUILD_DIR = 'lib';

/**
 * Name of the Action's entrypoint.
 *
 * XXX Should match the package.json:main value.
 */
export const BUILD_MAIN_FILENAME = 'main.js';
