
    enum D {
      A,
      B = 2,
    }

    (D as any).A = 5;
    console.log(D.A);
    const enum E {
      A,
      B,
    }
    console.log(E.B);

    const enum F {
      A = 2,
    }
    enum G {
      A = F.A
    }
    console.log(G.A);

    enum H {
      A = 2,
    }
    const enum I {
      A = H.A
    }
    console.log(I.A);
    const j = H.A;
    enum J {
      A = j
    }
    console.log(J.A);
    const enum K {
      A = 3,
    }
    const l = K.A;
    enum L {
      A = l
    }
    console.log(L.A);
    declare const enum M {
      A = 7,
    }
    const m = M.A;
    enum N {
      A = m,
      B
    }
    declare enum O {
      A = 1,
    }
    (O as any).A = 5;
    enum P {
      A = O.A
    }
    console.log(P.A);
