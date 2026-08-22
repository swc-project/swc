const cb = Function.prototype["bind"]();
cb("boom");
process.stdout.write(typeof cb + "\n");
const r = void 0;
process.stdout.write(typeof r + "\n");
