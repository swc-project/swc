const data = [{ name: 'a', type: 'a' }, { name: 'b', type: 'a' }, { name: 'c', type: 'b' }];

const result = Object.groupBy(data, ({ type }) => type);