(() => {
    class A {
      cycle() {
        return B;
      }
    }
    class B {
      cycle() {
        return A
      }
    }
    
    class ExtendsA1 extends sideEffectWith(A) {}
    class Unused1 {
      constructor() {
        ExtendsA1
      }
    }
    class ExtendsA2 extends sideEffectWith(A) {}
    class Unused2 {
      async put() {
        ExtendsA2
      }
    }
  })();
    