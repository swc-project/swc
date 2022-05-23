"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
const longlong1 = __importDefault(require("./config.json"));
function setup({ config = longlong1.default } = {}) {
    function longlong2(longlong3) {
        const longlong4 = config[longlong3] || null;
        if (!longlong4) {
            return false;
        }
        const { available, availableBy } = longlong4;
        if (!availableBy) {
            return available;
        }
        return Date.now() >= availableBy && available;
    }
    function longlong10(longlong5) {
        const longlong6 = config[longlong5] || null;
        return longlong6;
    }
    return {
        longlong10,
        longlong2,
        longlong100: config,
    };
}
exports.default = setup;
