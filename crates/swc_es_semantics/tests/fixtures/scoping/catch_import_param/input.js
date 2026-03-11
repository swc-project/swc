import d, { foo as f, bar } from "pkg";

function run({ a, b: c }, ...rest) {
  try {
    throw f + bar + d + a + c + rest.length;
  } catch ({ message: m }) {
    let bar = m;
    return bar;
  }
}

run({ a: 1, b: 2 });
