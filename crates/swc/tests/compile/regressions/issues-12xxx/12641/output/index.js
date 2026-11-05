const BARE_RE = RegExp("^[\\u0080-\\u{10FFFF}]$", "iu");
const QUANTIFIED_RE = RegExp("^[\\u0080-\\u{10FFFF}]+$", "iu");
const CTOR_RE = new RegExp("^[\\u0080-\\u{10FFFF}]$", 'iu');
