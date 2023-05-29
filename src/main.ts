import * as core from '@actions/core';
import awaitVercelDeployment from './awaitVercelDeployment';
import { millisecondsFromInput } from './config';
import { VercelDeployment } from './types/VercelDeployment';

/**
 * Runs configuration checks to make sure everything is properly configured.
 * If anything isn't properly configured, will stop the workflow.
 */
const runConfigChecks = () => {
  if (!process.env.VERCEL_TOKEN) {
    const message =
      process.env.NODE_ENV === 'test'
        ? `VERCEL_TOKEN environment variable is not defined. Please define it in the ".env.test" file. See https://vercel.com/account/tokens`
        : `VERCEL_TOKEN environment variable is not defined. Please create a GitHub "VERCEL_TOKEN" secret. See https://vercel.com/account/tokens`;
    core.setFailed(message);
    throw new Error(message);
  }
};

/**
 * Runs the GitHub Action.
 */
const run = (): void => {
  if (!core.isDebug()) {
    core.info('Debug mode is disabled. Read more at https://github.com/UnlyEd/github-action-await-vercel#how-to-enable-debug-logs');
  }

  try {
    const url: string = core.getInput('deployment-url');
    core.debug(`Url to wait for: ${url}`); // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true https://github.com/actions/toolkit/blob/master/docs/action-debugging.md#how-to-access-step-debug-logs

    const timeout: number = millisecondsFromInput('timeout');
    core.debug(`Timeout used: ${timeout}`);

    const pollInterval: number = millisecondsFromInput('poll-interval');
    core.debug(`Poll interval used: ${pollInterval}`);

    awaitVercelDeployment({ url, timeout, pollInterval })
      .then((deployment: VercelDeployment) => {
        core.setOutput('deploymentDetails', deployment);
      })
      .catch((error) => {
        core.setFailed(error);
      });
  } catch (error) {
    core.setFailed(error.message);
  }
};

runConfigChecks();
run();
