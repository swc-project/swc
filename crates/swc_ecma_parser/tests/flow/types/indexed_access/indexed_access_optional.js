type A = Obj?.[foo];

type B = Obj?.[foo]?.[bar];

type C = Obj?.[true];

type D = Obj?.[true]?.[true];

type E = Obj['a']?.[foo];

type F = Obj['a']?.[true];

type G = Obj?.["case"];

type H = Obj?.['bar']?.['baz']?.['boz'];

type I = Obj['bar']?.[string]['boz'];
