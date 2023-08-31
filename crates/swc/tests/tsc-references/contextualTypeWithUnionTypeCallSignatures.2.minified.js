//// [contextualTypeWithUnionTypeCallSignatures.ts]
//When used as a contextual type, a union type U has those members that are present in any of 
// its constituent types, with types that are unions of the respective members in the constituent types. 
// Let S be the set of types in U that have call signatures.
// If S is not empty and the sets of call signatures of the types in S are identical ignoring return types,
// U has the same set of call signatures, but with return types that are unions of the return types of the respective call signatures from each type in S.
