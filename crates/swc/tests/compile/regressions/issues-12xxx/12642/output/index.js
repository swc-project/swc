const SUBTRACTION_RE = RegExp("[\\p{ASCII}--\\p{L}]", "v");
const INTERSECTION_RE = RegExp("[\\p{ASCII}&&\\p{L}]", "v");
const NEGATED_IN_CLASS_RE = RegExp("[\\P{ASCII}]", "iv");
const BARE_RE = RegExp("\\p{ASCII}", "v");
const CTOR_RE = new RegExp('[\\p{ASCII}--\\p{L}]', 'v');
