const SUBTRACTION_RE = /[\p{ASCII}--\p{L}]/v;
const INTERSECTION_RE = /[\p{ASCII}&&\p{L}]/v;
const NEGATED_IN_CLASS_RE = /[\P{ASCII}]/iv;
const BARE_RE = /\p{ASCII}/v;
const CTOR_RE = new RegExp('[\\p{ASCII}--\\p{L}]', 'v');
