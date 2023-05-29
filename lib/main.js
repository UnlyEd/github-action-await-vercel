"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const awaitVercelDeployment_1 = __importDefault(require("./awaitVercelDeployment"));
const config_1 = require("./config");
/**
 * Runs configuration checks to make sure everything is properly configured.
 * If anything isn't properly configured, will stop the workflow.
 */
const runConfigChecks = () => {
    if (!process.env.VERCEL_TOKEN) {
        const message = process.env.NODE_ENV === 'test'
            ? `VERCEL_TOKEN environment variable is not defined. Please define it in the ".env.test" file. See https://vercel.com/account/tokens`
            : `VERCEL_TOKEN environment variable is not defined. Please create a GitHub "VERCEL_TOKEN" secret. See https://vercel.com/account/tokens`;
        core.setFailed(message);
        throw new Error(message);
    }
};
/**
 * Runs the GitHub Action.
 */
const run = () => {
    if (!core.isDebug()) {
        core.info('Debug mode is disabled. Read more at https://github.com/UnlyEd/github-action-await-vercel#how-to-enable-debug-logs');
    }
    try {
        const url = core.getInput('deployment-url');
        core.debug(`Url to wait for: ${url}`); // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true https://github.com/actions/toolkit/blob/master/docs/action-debugging.md#how-to-access-step-debug-logs
        const timeout = (0, config_1.millisecondsFromInput)('timeout');
        core.debug(`Timeout used: ${timeout}`);
        const pollInterval = (0, config_1.millisecondsFromInput)('poll-interval');
        core.debug(`Poll interval used: ${pollInterval}`);
        (0, awaitVercelDeployment_1.default)({ url, timeout, pollInterval })
            .then((deployment) => {
            core.setOutput('deploymentDetails', deployment);
        })
            .catch((error) => {
            core.setFailed(error);
        });
    }
    catch (error) {
        core.setFailed(error.message);
    }
};
runConfigChecks();
run();
