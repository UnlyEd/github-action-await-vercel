import * as core from '@actions/core';
import awaitVercelDeployment from './awaitVercelDeployment';
import { DEFAULT_TIMEOUT } from './config';
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
    const urlToWait: string = core.getInput('deployment-url', { required: true });
    core.debug(`Url to wait for: ${urlToWait}`); // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true https://github.com/actions/toolkit/blob/master/docs/action-debugging.md#how-to-access-step-debug-logs

    const timeout: number = (+core.getInput('timeout') || DEFAULT_TIMEOUT) * 1000;
    core.debug(`Timeout used: ${timeout}`);

    const teamId: string = core.getInput('team-id');
    core.debug(`teamId: ${teamId}`);

    awaitVercelDeployment(urlToWait, teamId, timeout)
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
