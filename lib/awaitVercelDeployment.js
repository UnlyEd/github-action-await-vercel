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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const node_fetch_retry_1 = __importDefault(require("@adobe/node-fetch-retry"));
const config_1 = require("./config");
/**
 * Awaits for the Vercel deployment to be in a "ready" state.
 *
 * @param baseUrl Base url of the Vercel deployment to await for.
 * @param timeout Duration (in seconds) until we'll await for.
 *  When the timeout is reached, the Promise is rejected (the action will fail).
 */
const awaitVercelDeployment = (baseUrl, timeout) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        let deployment = {};
        const timeoutTime = new Date().getTime() + timeout;
        while (new Date().getTime() < timeoutTime) {
            deployment = (yield (0, node_fetch_retry_1.default)(`${config_1.VERCEL_BASE_API_ENDPOINT}/v11/now/deployments/get?url=${baseUrl}`, {
                headers: {
                    Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
                },
                retryOptions: {
                    retryMaxDuration: timeout * 1000, // Convert seconds to milliseconds
                },
            })
                .then((data) => data.json())
                .catch((error) => reject(error)));
            core.debug(`Received these data from Vercel: ${JSON.stringify(deployment)}`);
            if (deployment.readyState === 'READY' || deployment.readyState === 'ERROR') {
                core.debug('Deployment has been found');
                return resolve(deployment);
            }
        }
        core.debug(`Last deployment response: ${JSON.stringify(deployment)}`);
        return reject('Timeout has been reached');
    }));
};
exports.default = awaitVercelDeployment;
