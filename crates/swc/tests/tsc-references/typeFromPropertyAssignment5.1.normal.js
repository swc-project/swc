//// [a.js]
export default function MyClass() {}
MyClass.bar = class C {
};
MyClass.bar;
//// [b.js]
import MC from './a';
MC.bar;
/** @type {MC.bar} */ var x;
