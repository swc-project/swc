import foo from "foo";

async function foo() {
    await import("foo");

    callback(() => import("foo"));
}

import("side-effect");

await import("awaited");
