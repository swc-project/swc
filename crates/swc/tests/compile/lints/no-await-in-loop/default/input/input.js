async function foo() { while (baz) { await bar; } }
async function foo() { while (await foo()) { } }
async function foo() { while (baz) { for await (x of xs); } }
async function foo() { for (var bar of baz) { await bar; } }
async function foo() { for (var bar of baz) await bar; }
async function foo() { for (var bar in baz) { await bar; } }
async function foo() { for (var i; i < n; i++) { await bar; } }
async function foo() { for (var i; await foo(i); i++) { } }
async function foo() { for (var i; i < n; i = await bar) { } }
async function foo() { do { await bar; } while (baz); }
async function foo() { do { } while (await bar); }
async function foo() { while (true) { if (bar) { foo(await bar); } } }
async function foo() { while (xyz || 5 > await x) { } }
async function foo() { for await (var x of xs) { while (1) await f(x) } }

// valid
async function foo() { await bar; }
async function foo() { for (var bar in await baz) { } }
async function foo() { for (var bar of await baz) { } }
async function foo() { for await (var bar of await baz) { } }
async function foo() { while (true) { async function foo() { await bar; } } }
async function foo() { for (var i = await bar; i < n; i++) { } }
async function foo() { do { } while (bar); }
async function foo() { while (true) { var y = async function () { await bar; } } }
async function foo() { while (true) { var y = async () => await foo; } }
async function foo() { while (true) { var y = async () => { await foo; } } }
async function foo() { while (true) { class Foo { async foo() { await bar; } } } }
async function foo() { while (true) { class Foo { async foo() { await bar; } } } }
async function foo() { for await (var x of xs) { await f(x) } }
