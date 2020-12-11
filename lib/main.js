"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
const waitDeployment_1 = __importDefault(require("./waitDeployment"));
const DEFAULT_TIMEOUT = 10;
if (!process.env.VERCEL_TOKEN) {
    console.log(process.env);
    core.setFailed(`Please provide a VERCEL_TOKEN in the "env" section.`);
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!core.isDebug()) {
            core.info("Logs are limited because you did not enable the debug mode. You can find more informations here: https://github.com/UnlyEd/github-action-await-vercel/#any-troubles-");
        }
        try {
            const urlToWait = core.getInput('url-to-wait');
            core.debug(`Url to wait for: ${urlToWait}`); // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true https://github.com/actions/toolkit/blob/master/docs/action-debugging.md#how-to-access-step-debug-logs
            const timeout = (+core.getInput('timeout') || DEFAULT_TIMEOUT) * 1000;
            core.debug(`Timeout used: ${timeout}`);
            waitDeployment_1.default(urlToWait, timeout).then((deployment) => {
                core.setOutput('deploymentDetails', deployment);
            }).catch((error) => {
                core.setFailed(error);
            });
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
