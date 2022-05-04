const categories = [{ key: "apple" }, { key: "banana" }, { key: "strawberry" }];

const item = "some item";

const catNames = categories.reduce((a, item) => {
    return { ...a, [item.key.toString()]: item };
}, {});
