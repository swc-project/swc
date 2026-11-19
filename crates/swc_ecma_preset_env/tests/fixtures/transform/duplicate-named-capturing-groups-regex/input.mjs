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
