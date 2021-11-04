"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsErrorHandler = exports.errorHandler = void 0;
const logger_1 = require("@coder/logger");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const http_1 = require("../../common/http");
const constants_1 = require("../constants");
const http_2 = require("../http");
const util_1 = require("../util");
const notFoundCodes = ["ENOENT", "EISDIR", "FileNotFound"];
const errorHandler = async (err, req, res, next) => {
    if (notFoundCodes.includes(err.code)) {
        err.status = http_1.HttpCode.NotFound;
    }
    const status = err.status ?? err.statusCode ?? 500;
    res.status(status);
    // Assume anything that explicitly accepts text/html is a user browsing a
    // page (as opposed to an xhr request). Don't use `req.accepts()` since
    // *every* request that I've seen (in Firefox and Chromium at least)
    // includes `*/*` making it always truthy. Even for css/javascript.
    if (req.headers.accept && req.headers.accept.includes("text/html")) {
        const resourcePath = path_1.default.resolve(constants_1.rootPath, "src/browser/pages/error.html");
        res.set("Content-Type", (0, util_1.getMediaMime)(resourcePath));
        const content = await fs_1.promises.readFile(resourcePath, "utf8");
        res.send((0, http_2.replaceTemplates)(req, content)
            .replace(/{{ERROR_TITLE}}/g, status)
            .replace(/{{ERROR_HEADER}}/g, status)
            .replace(/{{ERROR_BODY}}/g, err.message));
    }
    else {
        res.json({
            error: err.message,
            ...(err.details || {}),
        });
    }
};
exports.errorHandler = errorHandler;
const wsErrorHandler = async (err, req, res, next) => {
    logger_1.logger.error(`${err.message} ${err.stack}`);
    req.ws.end();
};
exports.wsErrorHandler = wsErrorHandler;
//# sourceMappingURL=errors.js.map