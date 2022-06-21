import foo from "foo";

function foo() {
    await import("foo");

    callback(() => import("foo"));
}

import("side-effect");

await import("awaited");
