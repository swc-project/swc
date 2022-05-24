// Let S be the set of types in U that has a property P.
// If S is not empty, U has a property P of a union type of the types of P from each type in S.
var i1;
var i2;
var i1Ori2 = i1;
var i1Ori2 = i2;
var i1Ori2 = {
    commonPropertyType: "hello",
    commonMethodType: (a)=>a,
    commonMethodWithTypeParameter: (a)=>a,
    methodOnlyInI1: (a)=>a,
    propertyOnlyInI1: "Hello"
};
var i1Ori2 = {
    commonPropertyType: "hello",
    commonMethodType: (a)=>a,
    commonMethodWithTypeParameter: (a)=>a,
    methodOnlyInI2: (a)=>a,
    propertyOnlyInI2: "Hello"
};
var i1Ori2 = {
    commonPropertyType: "hello",
    commonMethodType: (a)=>a,
    commonMethodWithTypeParameter: (a)=>a,
    methodOnlyInI1: (a)=>a,
    propertyOnlyInI1: "Hello",
    methodOnlyInI2: (a)=>a,
    propertyOnlyInI2: "Hello"
};
var arrayI1OrI2 = [
    i1,
    i2,
    {
        commonPropertyType: "hello",
        commonMethodType: (a)=>a,
        commonMethodWithTypeParameter: (a)=>a,
        methodOnlyInI1: (a)=>a,
        propertyOnlyInI1: "Hello"
    },
    {
        commonPropertyType: "hello",
        commonMethodType: (a)=>a,
        commonMethodWithTypeParameter: (a)=>a,
        methodOnlyInI2: (a)=>a,
        propertyOnlyInI2: "Hello"
    },
    {
        commonPropertyType: "hello",
        commonMethodType: (a)=>a,
        commonMethodWithTypeParameter: (a)=>a,
        methodOnlyInI1: (a)=>a,
        propertyOnlyInI1: "Hello",
        methodOnlyInI2: (a)=>a,
        propertyOnlyInI2: "Hello"
    }
];
var i11;
var i21;
var i11Ori21 = i11;
var i11Ori21 = i21;
var i11Ori21 = {
    // Like i1
    commonMethodDifferentReturnType: (a, b)=>{
        var z = a.charAt(b);
        return z;
    },
    commonPropertyDifferentType: "hello"
};
var i11Ori21 = {
    // Like i2
    commonMethodDifferentReturnType: (a, b)=>{
        var z = a.charCodeAt(b);
        return z;
    },
    commonPropertyDifferentType: 10
};
var arrayOrI11OrI21 = [
    i11,
    i21,
    i11 || i21,
    {
        // Like i1
        commonMethodDifferentReturnType: (a, b)=>{
            var z = a.charAt(b);
            return z;
        },
        commonPropertyDifferentType: "hello"
    },
    {
        // Like i2
        commonMethodDifferentReturnType: (a, b)=>{
            var z = a.charCodeAt(b);
            return z;
        },
        commonPropertyDifferentType: 10
    }
];
