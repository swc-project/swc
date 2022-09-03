//// [contextualTypeWithUnionTypeMembers.ts]
var i1, i2, i11, i21, i1Ori2 = i1, i1Ori2 = i2, i1Ori2 = {
    commonPropertyType: "hello",
    commonMethodType: function(a) {
        return a;
    },
    commonMethodWithTypeParameter: function(a) {
        return a;
    },
    methodOnlyInI1: function(a) {
        return a;
    },
    propertyOnlyInI1: "Hello"
}, i1Ori2 = {
    commonPropertyType: "hello",
    commonMethodType: function(a) {
        return a;
    },
    commonMethodWithTypeParameter: function(a) {
        return a;
    },
    methodOnlyInI2: function(a) {
        return a;
    },
    propertyOnlyInI2: "Hello"
}, i1Ori2 = {
    commonPropertyType: "hello",
    commonMethodType: function(a) {
        return a;
    },
    commonMethodWithTypeParameter: function(a) {
        return a;
    },
    methodOnlyInI1: function(a) {
        return a;
    },
    propertyOnlyInI1: "Hello",
    methodOnlyInI2: function(a) {
        return a;
    },
    propertyOnlyInI2: "Hello"
}, arrayI1OrI2 = [
    i1,
    i2,
    {
        commonPropertyType: "hello",
        commonMethodType: function(a) {
            return a;
        },
        commonMethodWithTypeParameter: function(a) {
            return a;
        },
        methodOnlyInI1: function(a) {
            return a;
        },
        propertyOnlyInI1: "Hello"
    },
    {
        commonPropertyType: "hello",
        commonMethodType: function(a) {
            return a;
        },
        commonMethodWithTypeParameter: function(a) {
            return a;
        },
        methodOnlyInI2: function(a) {
            return a;
        },
        propertyOnlyInI2: "Hello"
    },
    {
        commonPropertyType: "hello",
        commonMethodType: function(a) {
            return a;
        },
        commonMethodWithTypeParameter: function(a) {
            return a;
        },
        methodOnlyInI1: function(a) {
            return a;
        },
        propertyOnlyInI1: "Hello",
        methodOnlyInI2: function(a) {
            return a;
        },
        propertyOnlyInI2: "Hello"
    }
], i11Ori21 = i11, i11Ori21 = i21, i11Ori21 = {
    commonMethodDifferentReturnType: function(a, b) {
        return a.charAt(b);
    },
    commonPropertyDifferentType: "hello"
}, i11Ori21 = {
    commonMethodDifferentReturnType: function(a, b) {
        return a.charCodeAt(b);
    },
    commonPropertyDifferentType: 10
}, arrayOrI11OrI21 = [
    i11,
    i21,
    i11 || i21,
    {
        commonMethodDifferentReturnType: function(a, b) {
            return a.charAt(b);
        },
        commonPropertyDifferentType: "hello"
    },
    {
        commonMethodDifferentReturnType: function(a, b) {
            return a.charCodeAt(b);
        },
        commonPropertyDifferentType: 10
    }
];
