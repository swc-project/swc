function _Object_assign(a, b) {
  console.log(this, Math.exp(a, b));
};
_Object_assign(4, 2);

const a = {};
Object.assign(a, {});
const b = {};
Object.assign(b, {});
