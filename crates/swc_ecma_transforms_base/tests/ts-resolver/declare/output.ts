declare const MY_MAGIC_VARIABLE__2: string;
declare function myFunction__2(): string;
declare enum MyEnum__2 {
    Value__0 = "value"
}
declare class MyClass__2 {
    prop: string;
}
declare namespace MyNamespace__2 {
    var value__4: string;
}
export default function Page__2() {
    return `Server value: ${true ? MY_MAGIC_VARIABLE__2 : "not set" + myFunction__2() + MyEnum__2.Value + new MyClass__2().prop + MyNamespace__2.value}`;
}
