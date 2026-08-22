const cb = console.error["bind"](console);
cb("boom");
process.stdout.write(typeof cb + "\n");

console.error["call"](console, "via call");

const r = console.error["capture"]("custom property");
process.stdout.write(typeof r + "\n");
