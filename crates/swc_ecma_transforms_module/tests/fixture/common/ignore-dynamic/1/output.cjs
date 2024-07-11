"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
async function foo() {
    await import("foo");
    callback(()=>import("foo"));
}
import("side-effect");
await import("awaited");
