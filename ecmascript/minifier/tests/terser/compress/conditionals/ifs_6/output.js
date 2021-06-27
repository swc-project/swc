var x, y;
x = foo || bar || baz || boo ? 20 : 10;
x[foo] = y ? 10 : 20;
foo ? (x[bar] = 10) : (x[bar] = 20);
