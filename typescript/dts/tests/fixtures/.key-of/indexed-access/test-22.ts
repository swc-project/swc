// Repro from #12651

type MethodDescriptor = {
    name: string;
    args: any[];
    returnValue: any;
}

declare function dispatchMethod<M extends MethodDescriptor>(name: M['name'], args: M['args']): M['returnValue'];

type SomeMethodDescriptor = {
    name: "someMethod";
    args: [string, number];
    returnValue: string[];
}

let result = dispatchMethod<SomeMethodDescriptor>("someMethod", ["hello", 35]);
