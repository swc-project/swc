function f() {
    const getConfigId = ({ id, configIndex }) => `${id}-${configIndex}`;
    const createSelector = (id, configIndex) => (data) =>
        data[getConfigId({ id, configIndex })];

    const selector = createSelector("item-1", 0);
    const result = selector({ "item-1-0": 100 });

    if (result === 100) {
        console.log("Test PASSED!");
    } else {
        console.log("Test FAILED!");
    }
}

f();
f();
