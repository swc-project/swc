const SUBTRACTION_RE = /[\x00-\x40\x5B-\x60\x7B-\x7F]/u;
const INTERSECTION_RE = /[A-Za-z]/u;
const NEGATED_IN_CLASS_RE = /[\x80-\u017E\u0180-\u2129\u212B-\u{10FFFF}]/iu;
const BARE_RE = RegExp("[\\u0000-\\u007F]", "u");
const CTOR_RE = new RegExp('[\\p{ASCII}--\\p{L}]', 'v');
