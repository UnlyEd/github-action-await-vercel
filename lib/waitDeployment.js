"use strict";
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
const node_fetch_1 = __importDefault(require("node-fetch"));
const VERCEL_BASE_API_ENDPOINT = 'https://api.vercel.com';
function default_1(baseUrl, timeout) {
    return __awaiter(this, void 0, void 0, function* () {
        const timeoutTime = new Date().getTime() + timeout;
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let deployment;
            while (new Date().getTime() < timeoutTime) {
                deployment = yield (node_fetch_1.default(`${VERCEL_BASE_API_ENDPOINT}/v11/now/deployments/get?url=${baseUrl}`, {
                    headers: {
                        Authorization: `Bearer ${process.env.VERCEL_TOKEN}`
                    }
                }).then((data) => data.json()).catch((error) => {
                    reject(error);
                }));
                if (deployment.readyState === 'READY' || deployment.readyState === 'ERROR') {
                    resolve(deployment);
                    return;
                }
            }
            reject('Timeout reached');
        }));
    });
}
exports.default = default_1;
