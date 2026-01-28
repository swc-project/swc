// This should NOT be hoisted since Object.assign is only used once
const a = {};
Object.assign(a, {});

// JSON.parse is used twice, so it should be hoisted
const x = JSON.parse("{}");
const y = JSON.parse("{}");
