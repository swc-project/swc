// Loose mode lowers computed keys to assignments, so `__proto__` must be
// defined with `_define_property` to stay an own property of the mapping.
export const protoName = /(?:(?<__proto__>a)|(?<__proto__>b))\k<__proto__>/;
