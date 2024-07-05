//// [parserStrictMode16.ts]
//!   x The operand of a delete operator must be a property reference.
//!    ,-[2:1]
//!  1 | "use strict";
//!  2 | delete this;
//!    :        ^^^^
//!  3 | delete 1;
//!  4 | delete null;
//!  5 | delete "a";
//!    `----
//!   x The operand of a delete operator must be a property reference.
//!    ,-[3:1]
//!  1 | "use strict";
//!  2 | delete this;
//!  3 | delete 1;
//!    :        ^
//!  4 | delete null;
//!  5 | delete "a";
//!    `----
//!   x The operand of a delete operator must be a property reference.
//!    ,-[4:1]
//!  1 | "use strict";
//!  2 | delete this;
//!  3 | delete 1;
//!  4 | delete null;
//!    :        ^^^^
//!  5 | delete "a";
//!    `----
//!   x The operand of a delete operator must be a property reference.
//!    ,-[5:1]
//!  2 | delete this;
//!  3 | delete 1;
//!  4 | delete null;
//!  5 | delete "a";
//!    :        ^^^
//!    `----
