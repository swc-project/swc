//// [contextualSignatureInstantiation.ts]
// TypeScript Spec, section 4.12.2:
// If e is an expression of a function type that contains exactly one generic call signature and no other members,
// and T is a function type with exactly one non - generic call signature and no other members, then any inferences
// made for type parameters referenced by the parameters of T's call signature are fixed, and e's type is changed
// to a function type with e's call signature instantiated in the context of T's call signature (section 3.8.5).
bar(1, 1, g), baz(1, 1, g);
var d, b = (foo(g), bar(1, "one", g), bar("one", 1, g)), b = baz(b, b, g), d = (foo(h), bar(1, "one", h), bar("one", 1, h)), d = baz(d, d, g); // Error, number and string are disjoint types
 // Should be number[] | string[]
