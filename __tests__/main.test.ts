import * as cp from 'child_process';
import * as path from 'path';
import * as process from 'process';
import { BUILD_DIR, BUILD_MAIN_FILENAME } from '../src/config';

/**
 * Enhance the Node.js environment "global" variable to add our own types
 *
 * @see https://stackoverflow.com/a/42304473/2391795
 */
declare global {
  namespace NodeJS {
    interface Global {
      muteConsole: () => any;
      muteConsoleButLog: () => any;
      unmuteConsole: () => any;
    }
  }
}

/**
 * Executes the compiled version of the Action's main file. (.js)
 *
 * The goal is to test the file that is actually executed by GitHub Action.
 * Additionally, we could also test the TS files, but we didn't do it to avoid over-complicating things (didn't seem necessary).
 *
 * @param options
 */
function exec_lib(options: cp.ExecFileSyncOptions): string {
  /**
   * Path of the node.js binary being used.
   *
   * @example/usr/local/Cellar/node/14.3.0/bin/node
   */
  const nodeBinaryPath = process.execPath;

  /**
   * Path of the compiled version of the Action file entrypoint.
   *
   * @example .../github-action-await-vercel/lib/main.js
   */
  const mainFilePath = path.join(__dirname, '..', BUILD_DIR, BUILD_MAIN_FILENAME);

  try {
    // console.debug(`Running command "${nodeBinaryPath} ${mainFilePath}"`);
    return cp.execFileSync(nodeBinaryPath, [mainFilePath], options).toString();
  } catch (e) {
    console.error(e?.output?.toString());
    console.error(e);
    throw e;
  }
}

describe('Functional test', () => {
  const CORRECT_DOMAIN: string = `${process.env.VERCEL_DOMAIN}`;
  const WRONG_DOMAIN: string = 'i-am-wrong.vercel.app';

  describe('should pass when', () => {
    beforeEach(() => {
      global.console = global.unmuteConsole();
    });

    describe('using a valid Vercel domain', () => {
      const MAX_TIMEOUT: string = '2'; // Max timeout in seconds, as string
      const options: cp.ExecFileSyncOptions = {
        env: {
          'INPUT_DEPLOYMENT-URL': CORRECT_DOMAIN,
          'INPUT_TIMEOUT': MAX_TIMEOUT,
          'VERCEL_TOKEN': process.env.VERCEL_TOKEN,
        },
      };
      /* Github starts actions by using the program, not only a function. A nice way to test would is to exec `node ../lib/main.js`
         We already prepared valid inputs to try the action.
         Then, from this command, we can get a string which contains every logs/actions performed in it.
         We are not interested by debug lines so we remove them.
       */
      const filteredContent = exec_lib(options)
        .split('\n')
        .filter((lineDisplayed) => !lineDisplayed.startsWith('::debug::'))
        .join();

      test('should not return an error', () => {
        expect(filteredContent.includes('name=deploymentDetails::')).toBe(true);
      });
      test('should return deployment detail', () => {
        expect(filteredContent.includes('deploymentDetails')).toBe(true);
      });
    });
  });

  describe('should not pass when', () => {
    beforeEach(() => {
      global.console = global.muteConsole();
    });

    describe('using a wrong Vercel domain', () => {
      const MAX_TIMEOUT: string = '2'; // Max timeout in seconds, as string
      const options: cp.ExecFileSyncOptions = {
        env: {
          'INPUT_DEPLOYMENT-URL': 'i-am-wrong-domain.vercel.app',
          'INPUT_TIMEOUT': MAX_TIMEOUT,
          'VERCEL_TOKEN': process.env.VERCEL_TOKEN,
        },
      };
      test('should return an error', () => {
        try {
          exec_lib(options);
          //This should never happen
          expect(false).toBe(true);
        } catch (error) {
          const errorString: string = error.stdout.toString();
          expect(errorString.includes('not_found')).toBe(true);
        }
      });
    });

    describe('using a wrong Vercel token', () => {
      const MAX_TIMEOUT: string = '5'; // Max timeout in seconds, as string
      const options: cp.ExecFileSyncOptions = {
        env: {
          'INPUT_DEPLOYMENT-URL': WRONG_DOMAIN,
          'INPUT_TIMEOUT': MAX_TIMEOUT,
          'VERCEL_TOKEN': 'not valid',
        },
      };
      test('should return an error', () => {
        try {
          exec_lib(options);
          //This should never happen
          expect(false).toBe(true);
        } catch (error) {
          const errorString: string = error.stdout.toString();
          expect(errorString.includes('not_found')).toBe(true);
        }
      });
    });
  });
});
