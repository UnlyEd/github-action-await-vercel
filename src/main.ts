import * as core from '@actions/core';
import waitDeployment from './waitDeployment';
import {VercelDeployment} from './types/vercel';
import {error} from '@actions/core'

const DEFAULT_TIMEOUT = 10;

if (!process.env.VERCEL_TOKEN) {
  console.log(process.env);
  core.setFailed(`Please provide a VERCEL_TOKEN in the "env" section.`);
}

async function run(): Promise<void> {
  if (!core.isDebug()) {
    core.info("Logs are limited because you did not enable the debug mode. You can find more informations here: https://github.com/UnlyEd/github-action-await-vercel/#any-troubles-")
  }
  try {
    const urlToWait: string = core.getInput('url-to-wait');
    core.debug(`Url to wait for: ${urlToWait}`); // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true https://github.com/actions/toolkit/blob/master/docs/action-debugging.md#how-to-access-step-debug-logs
    const timeout: number = (+core.getInput('timeout') || DEFAULT_TIMEOUT) * 1000;
    core.debug(`Timeout used: ${timeout}`);
    waitDeployment(urlToWait, timeout).then((deployment: VercelDeployment) => {
      core.setOutput('deploymentDetails', deployment);
    }).catch((error) => {
      core.setFailed(error);
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
