"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startLink = void 0;
const logger_1 = require("@coder/logger");
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
function startLink(port) {
    logger_1.logger.debug(`running link targetting ${port}`);
    const agent = (0, child_process_1.spawn)(path_1.default.resolve(__dirname, "../../lib/linkup"), ["--devurl", `code:${port}:code-server`], {
        shell: false,
    });
    return new Promise((res, rej) => {
        agent.on("error", rej);
        agent.on("close", (code) => {
            if (code !== 0) {
                return rej({
                    message: `Link exited with ${code}`,
                });
            }
            res();
        });
    });
}
exports.startLink = startLink;
//# sourceMappingURL=link.js.map