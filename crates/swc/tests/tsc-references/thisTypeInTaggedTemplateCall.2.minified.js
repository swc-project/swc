//// [thisTypeInTaggedTemplateCall.ts]
class Foo {
    static m(strings) {
        return new this();
    }
}
Foo.m`test`;
Foo.m`test`;
