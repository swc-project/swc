//// [asyncAwait_es2017.ts]
async function f0() {}
async function f1() {}
async function f3() {}
let f4 = async function() {};
let f5 = async function() {};
let f6 = async function() {};
let f7 = async ()=>{};
let f8 = async ()=>{};
let f9 = async ()=>{};
let f10 = async ()=>p;
let f11 = async ()=>mp;
let f12 = async ()=>mp;
let f13 = async ()=>p;
let o = {
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
(function(M) {
    async function f1() {}
    M.f1 = f1;
})(M || (M = {}));
async function f14() {
    block: {
        await 1;
        break block;
    }
}
var M;
