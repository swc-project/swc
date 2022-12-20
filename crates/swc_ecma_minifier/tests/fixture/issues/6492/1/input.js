const obj = { key: 42 };
const val = obj?.[null || 'key']
console.log('val', val)