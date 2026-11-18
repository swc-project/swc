// requires add radix equals 10
parseInt("12");

// requires add radix equals 10
Number.parseInt("12");

// requires add radix equals 10
globalThis.parseInt("12");

// requires add radix equals 10
Number['parseInt']("12");

// invalid radix param
parseInt("12", 1);

// invalid radix param
parseInt("12", 37);

// Missing params
parseInt();

// requires add radix equals 10
parseInt("12", "abc");

// no reports required
parseInt("12", 10);

// no reports required
parseInt(a, 10);

// no reports required
parseInt(a, b);

// requires add radix equals 10
function foo1() {
  this.parseInt("12");
}

// requires add radix equals 10
globalThis.parseInt("12");

// requires add radix equals 10
globalThis?.parseInt("12");

// requires add radix equals 10
parseInt("12", ("abc"));

// no reports required
parseInt("12", (3));

// requires add radix equals 10
parseInt("12", 2.4);

// requires add radix equals 10
parseInt(`12`, `10`);

// requires add radix equals 10
console.log(parseInt('10', '10'));
