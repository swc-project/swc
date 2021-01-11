class Root {
}
const Root1 = Root;
const Root2 = Root1;
const Root3 = Root1;
class A extends Root3 {
}
class B extends Root2 {
}
const A1 = A;
const B1 = B;
export { A as A };
export { B as B };
