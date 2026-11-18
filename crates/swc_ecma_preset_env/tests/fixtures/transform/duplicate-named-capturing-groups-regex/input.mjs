export const duplicateNamedGroups = /(?<year>\d{4})-\d{2}|\d{2}-(?<year>\d{4})/;

// Unique names are supported by the target, so they must stay untouched.
export const uniqueNamedGroups = /(?<year>\d{4})-(?<month>\d{2})/;

// Duplicated and unique names are mixed. Every group becomes an indexed one.
export const mixedGroups = /(?:(?<a>x)(?<b>1)|(?<a>y))(?<c>z)/u;

// A reference to a duplicated name cannot be expressed by indexed groups.
export const duplicateReference = /(?:(?<x>a)|(?<x>b))\k<x>/;

// A reference to a unique name is not affected by the other duplicates.
export const uniqueReference = /(?<a>x)\k<a>|(?<b>1)|(?<b>2)/;
