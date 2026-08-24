globalThis.console = null;
const pb = null == console ? void 0 : (console.error && function() {}).bind();
process.stdout.write(typeof pb + "\n");
const ob = (console?.error && function() {})?.bind();
process.stdout.write(typeof ob + "\n");
