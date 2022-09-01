const dbPool = 1;
function d() {
    dbPool;
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
export { dbPool as dbPool };
