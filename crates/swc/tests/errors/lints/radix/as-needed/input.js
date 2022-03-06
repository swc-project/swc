// no reports required
parseInt("12");

// no reports required
Number.parseInt("12");

// no reports required
globalThis.parseInt("12");

// no reports required
Number['parseInt']("12");

// invalid radix param
parseInt("12", 1);

// invalid radix param
parseInt("12", 37);

// Missing params
parseInt();

// redundant radix
parseInt("12", 10);
