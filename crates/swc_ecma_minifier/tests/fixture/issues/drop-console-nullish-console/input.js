globalThis.console = null;

const pb = console?.error.bind(console);
process.stdout.write(typeof pb + "\n");

const ob = console?.error?.bind(console);
process.stdout.write(typeof ob + "\n");
