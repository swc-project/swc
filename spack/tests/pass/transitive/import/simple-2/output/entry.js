const common = 2;
const common2 = common;
const common1 = 1;
const common3 = 3;
const common31 = common3;
console.log('a', common1, common2);
console.log('b', common31, common1);
var common4;
try {
    common4 = 4;
} catch (e) {
}
console.log('c', common4, common2, common31);
