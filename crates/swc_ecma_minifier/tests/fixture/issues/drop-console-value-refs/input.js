const err = console.error.bind(console);
err("boom");

const s = console.warn.toString();
process.stdout.write(typeof s + "\n");

console.error("statement");
console.error.call(console, "via call");
console.error.apply(console, ["via apply"]);
console.error.bind(console);

const r = console.error("value position");
process.stdout.write(typeof r + "\n");

process.stdout.write(typeof err + "\n");

const ob = console?.error?.bind(console);
ob("boom optional");
process.stdout.write(typeof ob + "\n");
