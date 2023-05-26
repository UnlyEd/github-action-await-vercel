import * as core from '@actions/core';
import fetch from '@adobe/node-fetch-retry';
import { VERCEL_BASE_API_ENDPOINT } from './config';
import { VercelDeployment } from './types/VercelDeployment';

/**
 * Awaits for the Vercel deployment to be in a "ready" state.
 *
 * @param baseUrl Base url of the Vercel deployment to await for.
 * @param timeout Duration (in seconds) until we'll await for.
 *  When the timeout is reached, the Promise is rejected (the action will fail).
 */
const awaitVercelDeployment = (baseUrl: string, timeout: number): Promise<VercelDeployment> => {
  return new Promise(async (resolve, reject) => {
    let deployment: VercelDeployment = {};
    const timeoutTime = new Date().getTime() + timeout;

    while (new Date().getTime() < timeoutTime) {
      deployment = (await fetch(`${VERCEL_BASE_API_ENDPOINT}/v11/now/deployments/get?url=${baseUrl}`, {
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
        },
        retryOptions: {
          retryMaxDuration: timeout * 1000, // Convert seconds to milliseconds
        },
      })
        .then((data) => data.json())
        .catch((error: string) => reject(error))) as VercelDeployment;
      core.debug(`Received these data from Vercel: ${JSON.stringify(deployment)}`);

      if (deployment.readyState === 'READY' || deployment.readyState === 'ERROR') {
        core.debug('Deployment has been found');
        return resolve(deployment);
      }
    }
    core.debug(`Last deployment response: ${JSON.stringify(deployment)}`);

    return reject('Timeout has been reached');
  });
};

export default awaitVercelDeployment;
