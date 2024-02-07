//// [typeParameterConstModifiersWithIntersection.ts]
// https://github.com/microsoft/TypeScript/issues/55778
var result = test({
    produceThing: {},
    useIt: {
        type: "foo"
    },
    extra: 10
});
