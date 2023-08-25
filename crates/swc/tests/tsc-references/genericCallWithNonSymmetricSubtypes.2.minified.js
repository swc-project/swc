//// [genericCallWithNonSymmetricSubtypes.ts]
// generic type argument inference where inference leads to two candidates that are both supertypes of all candidates
// we choose the first candidate so the result is dependent on the order of the arguments provided
 // (x: string) => string;
