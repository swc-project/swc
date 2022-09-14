//// [a.js]
export default function MyClass() {}
MyClass.bar = class {
}, MyClass.bar;
//// [b.js]
import MC from './a';
MC.bar;
