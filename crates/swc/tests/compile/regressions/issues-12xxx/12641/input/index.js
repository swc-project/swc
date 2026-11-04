const BARE_RE = /^\P{ASCII}$/iu;
const QUANTIFIED_RE = /^\P{ASCII}+$/iu;
const CTOR_RE = new RegExp('^\\P{ASCII}$', 'iu');
