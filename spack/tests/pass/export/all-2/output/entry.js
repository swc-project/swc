class Root {
}
const Root1 = Root;
const Root2 = Root1;
const Root3 = Root1;
class B extends Root3 {
}
class A extends Root2 {
}
const B1 = B;
const A1 = A;
export { B as B };
export { A as A };
