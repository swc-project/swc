const a = true;
const b = true;
const c = false;
if (a && b && c) {
    console.log('This shouldn\'t log');
}
if (c && b && a) {
    console.log('Reversed: This also shouldn\'t log');
}
console.log('PASS')