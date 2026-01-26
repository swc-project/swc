
(() => {
    class C {
      cycle() {
        return D;
      }
    }
    class D {
      cycle() {
        return C
      }
    }
    
    class ExtendsC extends sideEffectWith(C) {}
    class Unused {
      constructor() {
        ExtendsC
      }
    }
  })();
