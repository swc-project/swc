class A1 extends null { constructor() { super(); } }
class A2 extends null { constructor() { } }
class A3 extends 100 { constructor() { super(); } }
class A4 extends 'test' { constructor() { super(); } }
class A5 extends (B = 5) { constructor() { super(); } }
class A6 extends (B && 5) { constructor() { super(); } }
class A7 extends (B &&= 5) { constructor() { super(); } }
class A8 extends (B += C) { constructor() { super(); } }
class A9 extends (B -= C) { constructor() { super(); } }
class A10 extends (B **= C) { constructor() { super(); } }
class A11 extends (B |= C) { constructor() { super(); } }
class A12 extends (B &= C) { constructor() { super(); } }
class A13 extends B { constructor() { } }
class A14 extends B { constructor() { for (var a of b) super.foo(); } }
class A15 extends B { constructor() { class C extends D { constructor() { super(); } } } }
class A16 extends B { constructor() { var c = class extends D { constructor() { super(); } } } }
class A17 extends B { constructor() { var c = () => super(); } }
class A18 extends B { constructor() { class C extends D { constructor() { super(); } } } }
class A19 extends B { constructor() { var C = class extends D { constructor() { super(); } } } }
class A20 extends B { constructor() { super(); class C extends D { constructor() { } } } }
class A21 extends B { constructor() { super(); var C = class extends D { constructor() { } } } }
class A23 extends B { constructor() { if (a) super(); } }
class A24 extends B { constructor() { x ? super() : null; } }
class A25 extends B { constructor() { switch (x) { case 'a': super(); } } }

// valid
class V1 extends (B, C) { constructor() { super(); } }
class V2 extends (class B { }) { constructor() { super(); } }
class V3 { constructor() { class B extends C { constructor() { super(); } } } }
class V4 extends Object { constructor() { super(); for (let i = 0; i < 0; i++); } }
class V5 { }
class V6 { constructor() { } }
class V7 extends null { }
class V8 {
  constructor() {

  }
}
