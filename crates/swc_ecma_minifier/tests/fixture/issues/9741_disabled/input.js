// When option is disabled (default), no aliasing should happen
const a = {};
Object.assign(a, {});
const b = {};
Object.assign(b, {});
Object.assign(b, a);
