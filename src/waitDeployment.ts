import fetch from 'node-fetch'
import {VercelDeployment} from './types/vercel'
import * as core from "@actions/core";

const VERCEL_BASE_API_ENDPOINT = 'https://api.vercel.com'


export default async function (baseUrl: string, timeout: number): Promise<VercelDeployment> {
    return new Promise(async (resolve, reject) => {
        let deployment: VercelDeployment = {};
        const timeoutTime = new Date().getTime() + timeout;

        while (new Date().getTime() < timeoutTime) {
            deployment = await (fetch(`${VERCEL_BASE_API_ENDPOINT}/v11/now/deployments/get?url=${baseUrl}`, {
                headers: {
                    Authorization: `Bearer ${process.env.VERCEL_TOKEN}`
                }
            }).then((data) => data.json()).catch((error: string) => reject(error)));
            core.debug(`Received these data from Vercel: ${JSON.stringify(deployment)}`)
            if (deployment.readyState === 'READY' || deployment.readyState === 'ERROR') {
                core.debug("Deployment has been found");
                return resolve(deployment);
            }
        }
        core.debug(`Last deployment response: ${JSON.stringify(deployment)}`)
        return reject("Timeout has been reached");
    });
}