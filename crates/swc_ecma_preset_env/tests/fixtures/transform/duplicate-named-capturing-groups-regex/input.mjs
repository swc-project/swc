export const duplicateNamedGroups = /(?<year>\d{4})-\d{2}|\d{2}-(?<year>\d{4})/;

// Unique names are supported by the target, so they must stay untouched.
export const uniqueNamedGroups = /(?<year>\d{4})-(?<month>\d{2})/;

// Duplicated and unique names are mixed. Every group becomes an indexed one.
export const mixedGroups = /(?:(?<a>x)(?<b>1)|(?<a>y))(?<c>z)/u;

// A reference to a duplicated name becomes `(?:\1\2)`. Only one of the groups
// can take part in a match, and a reference to the other matches nothing.
export const duplicateReference = /(?:(?<x>a)|(?<x>b))\k<x>/;

// A reference to a unique name is not affected by the other duplicates.
export const uniqueReference = /(?<a>x)\k<a>|(?<b>1)|(?<b>2)/;

// An escaped group name is the same name as the unescaped one.
export const escapedName = /(?<\u0078>a)\k<x>|(?<x>b)/;

// A digit after a reference must not become part of the index (`\30`).
export const digitAfterReference = /^(?:(?<x>a)|(?<x>b))\k<x>(?<z>c)\k<z>0$/u;
// Two separate surrogates must not be printed as one code point.
export const loneSurrogates = /^(?:(?<x>\u{D800}\u{DC00})|(?<x>z))\k<x>$/u;
// Groups with the same name that can both take part are invalid, and so is
// an escaped name that equals another name in the same alternative. They are
// kept in a `RegExp` call for the target to reject, so that only that
// expression fails.
export const bothParticipate = /(?:(?<x>a)|z)(?:(?<x>b))\k<x>/;
export const escapedNameInOneAlternative = /(?<x>a)(?<\u0078>b)/;
// `__proto__` must be an own property of the mapping object.
export const protoName = /(?<__proto__>a)|(?<__proto__>b)/;
// A reference with an escaped name refers to the same groups.
export const escapedReference = /(?:(?<x>a)|(?<x>b))\k<\u0078>/;
// `__proto__` keeps its place in the order of the names.
export const protoFirst = /(?<__proto__>a)(?<later>c)|(?<__proto__>b)/;
