import * as cp from 'child_process';
import * as path from 'path';
import * as process from 'process';

require('dotenv').config({ path: './.env.test' });

const CORRECT_DOMAIN: string = 'nrn-v2-mst-aptd-gcms-lcz-sty-c1-hfq88g3jt.vercel.app';
const WRONG_DOMAIN: string = 'i-am-wrong.vercel.app';
const nodeExecutor = process.execPath;
const sourcePath = path.join(__dirname, '..', 'lib', 'main.js');

function exec_lib(options: cp.ExecFileSyncOptions): string {
  return cp.execFileSync(nodeExecutor, [sourcePath], options).toString();
}

describe('Functionnal test', () => {
  describe('on a valid domain', () => {
    const options: cp.ExecFileSyncOptions = {
      env: {
        'INPUT_URL-TO-WAIT': CORRECT_DOMAIN,
        'VERCEL_TOKEN': process.env.VERCEL_TOKEN,
      },
    };
    /* Github starts actions by using the program, not only a function. A nice way to test would is to exec `node ../lib/main.js`
       We already prepared valid inputs to try the action.
       Then, from this command, we can get a string which contains every logs/actions performed in it.
       We are not interested by debug lines so we remove them.
     */
    const filteredContent = exec_lib(options).split('\n').filter((lineDisplayed) => !lineDisplayed.startsWith('::debug::')).join();

    test('should not return an error', () => {
      expect(filteredContent.includes('name=deploymentDetails::')).toBe(true);
    });
    test('should return deployment detail', () => {
      expect(filteredContent.includes('deploymentDetails')).toBe(true);
    });
  });

  describe('on a wrong domain', () => {
    const options: cp.ExecFileSyncOptions = {
      env: {
        'INPUT_URL-TO-WAIT': 'i-am-wrong-domain.vercel.app',
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
  describe('with a wrong token', () => {
    const options: cp.ExecFileSyncOptions = {
      env: {
        'INPUT_URL-TO-WAIT': WRONG_DOMAIN,
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

