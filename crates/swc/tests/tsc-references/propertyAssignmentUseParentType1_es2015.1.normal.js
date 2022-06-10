export const interfaced = ()=>true;
interfaced.num = 123;
export const inlined = ()=>true;
inlined.nun = 456;
export const ignoreJsdoc = ()=>true;
/** @type {string} make sure to ignore jsdoc! */ ignoreJsdoc.extra = 111;
