var _initClass, _A, _initClass2, _C, _initClass3, _D, _initClass4, _decorated_class, _initClass5, _G, _initClass6, _decorated_class2, _initClass7, _H, _initClass8, _K;
const dec = () => { };
const A = (new class extends identity {
  static {
    class A {
      static {
        [_A, _initClass] = applyDecs2203R(this, [], [dec]).c;
      }
    }
  }
  constructor() {
    super(_A), (() => { })(), _initClass();
  }
}(), _A);
const B = (new class extends identity {
  static {
    class C {
      static {
        [_C, _initClass2] = applyDecs2203R(this, [], [dec]).c;
      }
    }
  }
  constructor() {
    super(_C), (() => { })(), _initClass2();
  }
}(), _C);
const D = (new class extends identity {
  static {
    class D {
      static {
        [_D, _initClass3] = applyDecs2203R(this, [], [dec]).c;
      }
    }
  }
  constructor() {
    super(_D), (() => { })(), _initClass3();
  }
}(), _D);
const E = ((new class extends identity {
  static {
    (class {
      static {
        [_decorated_class, _initClass4] = applyDecs2203R(this, [], [dec]).c;
      }
    });
  }
  constructor() {
    super(_decorated_class), (() => { })(), _initClass4();
  }
}(), _decorated_class), 123);
const F = [(new class extends identity {
  static {
    class G {
      static {
        [_G, _initClass5] = applyDecs2203R(this, [], [dec]).c;
      }
    }
  }
  constructor() {
    super(_G), (() => { })(), _initClass5();
  }
}(), _G), (new class extends identity {
  static {
    (class {
      static {
        [_decorated_class2, _initClass6] = applyDecs2203R(this, [], [dec]).c;
      }
    });
  }
  constructor() {
    super(_decorated_class2), (() => { })(), _initClass6();
  }
}(), _decorated_class2)];
const H = (new class extends identity {
  static {
    class H extends I {
      static {
        [_H, _initClass7] = applyDecs2203R(this, [], [dec]).c;
      }
    }
  }
  constructor() {
    super(_H), (() => { })(), _initClass7();
  }
}(), _H);
const J = (new class extends identity {
  static {
    class K extends L {
      static {
        [_K, _initClass8] = applyDecs2203R(this, [], [dec]).c;
      }
    }
  }
  constructor() {
    super(_K), (() => { })(), _initClass8();
  }
}(), _K);
function classFactory() {
  var _initClass9, _decorated_class3;
  return new class extends identity {
    static {
      (class {
        static {
          [_decorated_class3, _initClass9] = applyDecs2203R(this, [], [dec]).c;
        }
      });
    }
    constructor() {
      super(_decorated_class3), (() => { })(), _initClass9();
    }
  }(), _decorated_class3;
}
