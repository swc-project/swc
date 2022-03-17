if (10 === a) {}

if ('a' === a)

if (`abc` === a) {}

if (-10 === a) {}

if (10 < a && a > 30) {}

if (c && (10 < a && a > 30)) {}

// wait for rule "radix" merge
if (String.raw`abc` === a) {}

// Valid cases
if (a === 10) {}

if (`${y}` === a) {}

if (f() === a) {}

if ((foo === 1) && (1 === foo)) {}
