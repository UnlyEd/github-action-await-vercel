import fetch from 'node-fetch'
import {VercelDeployment} from './types/vercel'

const VERCEL_BASE_API_ENDPOINT = 'https://api.vercel.com'


export default async function(baseUrl: string, timeout: number): Promise<VercelDeployment> {
  const timeoutTime = new Date().getTime() + timeout;
  return new Promise(async (resolve, reject) => {
    let deployment: VercelDeployment;
    while (new Date().getTime() < timeoutTime) {
      deployment = await (fetch(`${VERCEL_BASE_API_ENDPOINT}/v11/now/deployments/get?url=${baseUrl}`, {
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_TOKEN}`
        }
      }).then((data) => data.json()).catch((error: string) => {
        reject(error);
      }));
      if (deployment.readyState === 'READY' || deployment.readyState === 'ERROR') {
        resolve(deployment);
        return;
      }
    }
    reject('Timeout reached');
  });
}