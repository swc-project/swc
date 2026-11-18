const values = [{ a: 1, extra: 2 }];

for (var { a, ...b } of values) {}
for (let { a, ...b } of values) {}
for (const { a, ...b } of values) {}
