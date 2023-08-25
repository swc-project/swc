//// [objectTypeWithStringAndNumberIndexSignatureToAny.ts]
// When checking compatibility between two types,
// TypeScript should not require an index signature if
// the target side index signature maps to `any` *and*
// the target side has *any* string index signature to `any`.
//
// So an index signature like in
//
//  { [x: number]: any }
//
// is still required of a source type, but neither index signature in
//
//  { [x: number]: any, [x: string]: any; }
//
// should be required; *however*, the number index signature in
//
//  { [x: number]: number, [x: string]: any; }
//
// should always be required.
