function read(getter) {
    try { return getter(); } catch (error) { return error.name; }
}

async function direct() {
    const items = [1, 2];
    try {
        for await (let items of items) {}
        return "finished";
    } catch (error) { return error.name; }
}

async function typeOf() {
    let item = "outer";
    try {
        for await (const item of (console.log(typeof item), [])) {}
        return "finished";
    } catch (error) { return error.name; }
}

async function captures() {
    let getter;
    let typeGetter;
    const perIteration = [];
    outer: inner: for await (let [item] of (getter = () => item, typeGetter = () => typeof item, [[1], [2]])) {
        console.log("during", read(getter), read(typeGetter));
        perIteration.push(() => ++item);
        continue outer;
    }
    console.log("after", read(getter), read(typeGetter));
    console.log("iterations", perIteration.map(fn => fn()).join(","));
}

async function shorthand() {
    try {
        for await (const { item } of Object.values({ item })) {}
        return "finished";
    } catch (error) { return error.name; }
}

async function shadowed() {
    for await (const item of ((item) => [item])(3)) {
        console.log("shadowed", item);
    }
    // Function-scoped loop heads have no temporal dead zone.
    for await (var items of (items = [4], items)) {
        console.log("var", items);
    }
}

async function suspended() {
    let getter;
    for await (const item of await Promise.resolve((getter = () => typeof item, [5]))) {
        console.log("awaited", item, read(getter));
    }
    console.log("awaited after", read(getter));
}

async function evaluated() {
    let getter;
    for await (const item of (getter = () => eval("typeof item"), [6])) {
        console.log("eval during", read(getter));
    }
    console.log("eval after", read(getter));
    try {
        for await (let item of eval("typeof item, []")) {}
    } catch (error) { console.log("eval direct", error.name); }
}

(async () => {
    console.log("direct", await direct());
    console.log("typeof", await typeOf());
    await captures();
    console.log("shorthand", await shorthand());
    await shadowed();
    await suspended();
    await evaluated();
})().catch(error => { console.error(error); process.exitCode = 1; });
