class Root {
}
const Root1 = Root;
const Root2 = Root1;
const Root3 = Root1;
class A1 extends Root3 {
}
class B1 extends Root2 {
}
export { B1 as B };
export { A1 as A };
