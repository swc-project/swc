// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: a.js
// @target: es6
// @Filename: b.js
import MC from './a';
export default function MyClass() {};
MyClass.bar = class C {
};
MyClass.bar;
MC.bar;
/** @type {MC.bar} */ var x;
