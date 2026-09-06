(true ? (23).toString() : "x") !== value;
(true && (23).toString()) !== value;
(sideEffect(), (23).toString()) !== value;
foo((23).toString()) === value;
foo(+(23).toString() !== 23);
