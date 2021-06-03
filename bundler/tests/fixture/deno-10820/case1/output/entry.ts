const dbPool1 = 1;
function d() {
    dbPool1;
}
async function fn() {
    d();
}
async function fn1() {
    d();
}
function router() {
    fn();
    fn1();
}
router();
export { dbPool1 as dbPool };
