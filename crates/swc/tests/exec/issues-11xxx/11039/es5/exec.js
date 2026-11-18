const log = (...a) => console.log(...a);

const base = { a: 1, e: 5 }; // 'a' is excluded by destructuring; 'e' should land in ...rest

const prox = new Proxy(base, {
  ownKeys(t) {
    log("ownKeys");
    return Reflect.ownKeys(t);
  },
  getOwnPropertyDescriptor(t, p) {
    log("getOwnPropDesc", String(p));
    // ⚠️ Side effect ONLY when someone asks about 'a' (which is EXCLUDED):
    if (p === "a") {
      log(" -> deleting e as a side effect of querying desc(a)");
      delete t.e;
    }
    return Reflect.getOwnPropertyDescriptor(t, p);
  },
  get(t, p, r) {
    log("get", String(p));
    return Reflect.get(t, p, r);
  },
});

// Destructure with rest: 'a' is excluded, so only 'e' should appear in rest.
const { a, ...rest } = prox;
const keys = Object.keys(rest);
log("RESULT rest keys:", keys);

if (typeof expect !== "undefined") {
  expect(keys).toEqual(["e"]);
}
