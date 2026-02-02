const defaultMessage = "hello"

function x(x) { return x; }
function y(x, y, z) { return x; };

function abc(a) { return x(a); }
function abc2(a, x, z = defaultMessage) { return y(a); }

export function example() {
  return `${x(2)} ${y("2")} ${abc(3)} ${abc2("3")}`;
}
