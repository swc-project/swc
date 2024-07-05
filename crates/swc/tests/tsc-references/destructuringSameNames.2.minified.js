//// [destructuringSameNames.ts]
//!   x the name `foo1` is defined multiple times
//!     ,-[21:1]
//!  18 | 
//!  19 | // Error cases
//!  20 | 
//!  21 | let { foo1, foo1 } = { foo1: 10 };
//!     :       ^^|^  ^^|^
//!     :         |     `-- `foo1` redefined here
//!     :         `-- previous definition of `foo1` here
//!  22 | let { foo2, bar2: foo2 } = { foo2: 20, bar2: 220 };
//!  23 | let { bar3: foo3, foo3 } = { foo3: 30, bar3: 330 };
//!  24 | const { foo4, foo4 } = { foo4: 40 };
//!     `----
//!   x the name `foo2` is defined multiple times
//!     ,-[22:1]
//!  19 | // Error cases
//!  20 | 
//!  21 | let { foo1, foo1 } = { foo1: 10 };
//!  22 | let { foo2, bar2: foo2 } = { foo2: 20, bar2: 220 };
//!     :       ^^|^        ^^|^
//!     :         |           `-- `foo2` redefined here
//!     :         `-- previous definition of `foo2` here
//!  23 | let { bar3: foo3, foo3 } = { foo3: 30, bar3: 330 };
//!  24 | const { foo4, foo4 } = { foo4: 40 };
//!  25 | const { foo5, bar5: foo5 } = { foo5: 50, bar5: 550 };
//!     `----
//!   x the name `foo3` is defined multiple times
//!     ,-[23:1]
//!  20 | 
//!  21 | let { foo1, foo1 } = { foo1: 10 };
//!  22 | let { foo2, bar2: foo2 } = { foo2: 20, bar2: 220 };
//!  23 | let { bar3: foo3, foo3 } = { foo3: 30, bar3: 330 };
//!     :             ^^|^  ^^|^
//!     :               |     `-- `foo3` redefined here
//!     :               `-- previous definition of `foo3` here
//!  24 | const { foo4, foo4 } = { foo4: 40 };
//!  25 | const { foo5, bar5: foo5 } = { foo5: 50, bar5: 550 };
//!  26 | const { bar6: foo6, foo6 } = { foo6: 60, bar6: 660 };
//!     `----
//!   x the name `foo4` is defined multiple times
//!     ,-[24:1]
//!  21 | let { foo1, foo1 } = { foo1: 10 };
//!  22 | let { foo2, bar2: foo2 } = { foo2: 20, bar2: 220 };
//!  23 | let { bar3: foo3, foo3 } = { foo3: 30, bar3: 330 };
//!  24 | const { foo4, foo4 } = { foo4: 40 };
//!     :         ^^|^  ^^|^
//!     :           |     `-- `foo4` redefined here
//!     :           `-- previous definition of `foo4` here
//!  25 | const { foo5, bar5: foo5 } = { foo5: 50, bar5: 550 };
//!  26 | const { bar6: foo6, foo6 } = { foo6: 60, bar6: 660 };
//!     `----
//!   x the name `foo5` is defined multiple times
//!     ,-[25:1]
//!  22 | let { foo2, bar2: foo2 } = { foo2: 20, bar2: 220 };
//!  23 | let { bar3: foo3, foo3 } = { foo3: 30, bar3: 330 };
//!  24 | const { foo4, foo4 } = { foo4: 40 };
//!  25 | const { foo5, bar5: foo5 } = { foo5: 50, bar5: 550 };
//!     :         ^^|^        ^^|^
//!     :           |           `-- `foo5` redefined here
//!     :           `-- previous definition of `foo5` here
//!  26 | const { bar6: foo6, foo6 } = { foo6: 60, bar6: 660 };
//!  27 | 
//!  28 | let [blah1, blah1] = [111, 222];
//!     `----
//!   x the name `foo6` is defined multiple times
//!     ,-[26:1]
//!  23 | let { bar3: foo3, foo3 } = { foo3: 30, bar3: 330 };
//!  24 | const { foo4, foo4 } = { foo4: 40 };
//!  25 | const { foo5, bar5: foo5 } = { foo5: 50, bar5: 550 };
//!  26 | const { bar6: foo6, foo6 } = { foo6: 60, bar6: 660 };
//!     :               ^^|^  ^^|^
//!     :                 |     `-- `foo6` redefined here
//!     :                 `-- previous definition of `foo6` here
//!  27 | 
//!  28 | let [blah1, blah1] = [111, 222];
//!  29 | const [blah2, blah2] = [333, 444];
//!     `----
//!   x the name `blah1` is defined multiple times
//!     ,-[28:1]
//!  25 | const { foo5, bar5: foo5 } = { foo5: 50, bar5: 550 };
//!  26 | const { bar6: foo6, foo6 } = { foo6: 60, bar6: 660 };
//!  27 | 
//!  28 | let [blah1, blah1] = [111, 222];
//!     :      ^^|^^  ^^|^^
//!     :        |      `-- `blah1` redefined here
//!     :        `-- previous definition of `blah1` here
//!  29 | const [blah2, blah2] = [333, 444];
//!     `----
//!   x the name `blah2` is defined multiple times
//!     ,-[29:1]
//!  26 | const { bar6: foo6, foo6 } = { foo6: 60, bar6: 660 };
//!  27 | 
//!  28 | let [blah1, blah1] = [111, 222];
//!  29 | const [blah2, blah2] = [333, 444];
//!     :        ^^|^^  ^^|^^
//!     :          |      `-- `blah2` redefined here
//!     :          `-- previous definition of `blah2` here
//!     `----
