function Prop(): PropertyDecorator {
    return function () { };
}

export default class Example {
    @Prop()
    prop: bigint;
}