declare const MY_MAGIC_VARIABLE: string;
declare function myFunction(): string;
declare enum MyEnum {
    Value = "value",
}
declare class MyClass {
    prop: string;
}
declare namespace MyNamespace {
    var value: string;
}

export default function Page() {
    return `Server value: ${true ? MY_MAGIC_VARIABLE : "not set" + myFunction() + MyEnum.Value + new MyClass().prop + MyNamespace.value}`
}
