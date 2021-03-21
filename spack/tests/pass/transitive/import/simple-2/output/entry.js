const common1 = 1;
const common = 2;
console.log('a', common1, common);
const common3 = 3;
console.log('b', common3, common1);
var common4;
try {
    common4 = 4;
} catch (e) {
}
console.log('c', common4, common, common3);
