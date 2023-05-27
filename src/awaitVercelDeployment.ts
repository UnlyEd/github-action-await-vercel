import * as core from '@actions/core';
import fetch from '@adobe/node-fetch-retry';
import { setTimeout } from 'timers/promises';
import { VERCEL_BASE_API_ENDPOINT } from './config';
import { VercelDeployment } from './types/VercelDeployment';

interface Options {
  /** Base url of the Vercel deployment to await for */
  url: string;
  /** Duration (in milliseconds) to wait for a terminal deployment status */
  timeout: number;
  /** Duration (in milliseconds) to wait in between polled Vercel API requests */
  pollInterval: number;
}

/**
 * Awaits for the Vercel deployment to be in a "ready" state.
 *
 * When the `timeout` is reached, the Promise is rejected (the action will fail)
 */
const awaitVercelDeployment = ({ url, timeout, pollInterval }: Options): Promise<VercelDeployment> => {
  return new Promise(async (resolve, reject) => {
    let deployment: VercelDeployment = {};
    const timeoutTime = new Date().getTime() + timeout;

    while (new Date().getTime() < timeoutTime) {
      const retryMaxDuration = timeoutTime - new Date().getTime(); // constrain retries by remaining timeout duration

      core.debug(`Retrieving deployment (retryMaxDuration=${retryMaxDuration}ms)`);
      deployment = await fetch(`${VERCEL_BASE_API_ENDPOINT}/v11/now/deployments/get?url=${url}`, {
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
        },
        retryOptions: { retryMaxDuration },
      }).then<VercelDeployment>((data) => data.json());

      core.debug(`Received these data from Vercel: ${JSON.stringify(deployment)}`);

      if (deployment.readyState === 'READY' || deployment.readyState === 'ERROR') {
        core.debug('Deployment has been found');
        return resolve(deployment);
      }

      core.debug(`Waiting ${pollInterval}ms`);
      await setTimeout(pollInterval);
    }

    core.debug(`Last deployment response: ${JSON.stringify(deployment)}`);

    return reject('Timeout has been reached');
  });
};

export default awaitVercelDeployment;
