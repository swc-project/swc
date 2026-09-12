globalThis.key = "dynamic", globalThis.condition = !1, console.log({
    known: "known",
    dynamic: "dynamic"
}[globalThis.condition ? "known" : globalThis.key]);
