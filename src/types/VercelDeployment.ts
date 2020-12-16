/**
 * Vercel deployment shape returned by the Vercel API.
 *
 * @see https://vercel.com/docs/api#endpoints/deployments/get-a-single-deployment/response-parameters
 */
export type VercelDeployment = {
  id?: string;
  url?: string;
  name?: string;
  meta?: { [key: string]: string };
  regions?: string[];
  routes?: { src: string; dest: string }[];
  functions?: { [functionPath: string]: { memory: number } };
  plan?: string;
  public?: boolean;
  ownerId?: string;
  readyState?: 'INITIALIZING' | 'ANALYZING' | 'BUILDING' | 'DEPLOYING' | 'READY' | 'ERROR';
  createdAt?: Date;
  createdIn?: string;
  env?: string[];
  build?: {
    env?: string[];
  };
  target?: 'staging' | 'production';
  alias?: string[];
  aliasError?: { code: string; message: string };
  aliasAssigned?: boolean;
}
