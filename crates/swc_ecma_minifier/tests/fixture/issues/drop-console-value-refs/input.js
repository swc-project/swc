const err = console.error.bind(console);
err("boom");

const s = console.warn.toString();
process.stdout.write(typeof s + "\n");

console.error("statement");
console.error.call(console, "via call");
console.error.apply(console, ["via apply"]);
console.error.bind(console);
console.error.capture("custom property, dropped like before");

const cap = console.error.capture("custom property, value position");
process.stdout.write(typeof cap + "\n");

const r = console.error("value position");
process.stdout.write(typeof r + "\n");

process.stdout.write(typeof err + "\n");

const ob = console?.error?.bind(console);
ob("boom optional");
process.stdout.write(typeof ob + "\n");

const pb = console?.error.bind(console);
pb("early optional");
process.stdout.write(typeof pb + "\n");

const dbg = console.debug?.bind(console) || null;
process.stdout.write((dbg !== null) + "\n");

const st = console.state.valueOf();
process.stdout.write(typeof st + "\n");
