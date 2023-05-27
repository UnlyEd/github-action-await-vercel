import { getInput } from '@actions/core';

export const VERCEL_BASE_API_ENDPOINT = 'https://api.vercel.com';

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

/**
 * Return the value of the specified action `input`, converted from seconds to milliseconds.
 */
export function millisecondsFromInput(input: string): number {
  return +getInput(input) * 1000;
}
