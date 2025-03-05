declare const MY_MAGIC_VARIABLE__0: string;
declare function myFunction__0(): string;
declare enum MyEnum__2 {
    Value__0 = "value"
}
declare class MyClass__0 {
    prop: string;
}
declare namespace MyNamespace__2 {
    var value__0: string;
}
export default function Page__2() {
    return `Server value: ${true ? MY_MAGIC_VARIABLE : "not set" + myFunction() + MyEnum__2.Value + new MyClass().prop + MyNamespace__2.value}`;
}
