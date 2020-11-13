class Root {
}
const Root1 = Root;
const Root2 = Root1;
export class A extends Root2 {
}
const Root3 = Root1;
export class B extends Root3 {
}
