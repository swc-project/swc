//// [asyncAwait_es2017.ts]
var M;
async function f0() {}
async function f1() {}
async function f3() {}
let f4 = async function() {}, f5 = async function() {}, f6 = async function() {}, f7 = async ()=>{}, f8 = async ()=>{}, f9 = async ()=>{}, f10 = async ()=>p, f11 = async ()=>mp, f12 = async ()=>mp, f13 = async ()=>p, o = {
    async m1 () {},
    async m2 () {},
    async m3 () {}
};
class C {
    async m1() {}
    async m2() {}
    async m3() {}
    static async m4() {}
    static async m5() {}
    static async m6() {}
}
async function f14() {
    block: {
        await 1;
        break block;
    }
}
!function(M) {
    async function f1() {}
    M.f1 = f1;
}(M || (M = {}));
