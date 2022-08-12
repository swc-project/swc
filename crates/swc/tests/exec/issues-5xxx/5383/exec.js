const a1 = [1, 2, 3];
const a2 = a1.map((x) => Promise.resolve(x));

async function f() {
  for await (const v of a2) {
    console.log(v);
  }
}

f();