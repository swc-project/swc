//// [constEnumNoObjectPrototypePropertyAccess.ts]
// https://github.com/microsoft/TypeScript/issues/55421
;
console.log(Bebra.constructor);
console.log(Bebra.hasOwnProperty);
console.log(Bebra.isPrototypeOf);
console.log(Bebra.propertyIsEnumerable);
console.log(Bebra.toLocaleString);
console.log(Bebra.toString);
console.log(Bebra.valueOf);
