import { defer as a } from "./utils";
export default function b(c) {
    const d = [];
    let e = false;
    function b() {
        if (e) {
            return;
        }
        e = true;
        a(()=>{
            e = false;
            c();
        });
    }
    return {
        registerWidget (a) {
            d.push(a);
            b();
            return function c() {
                d.splice(d.indexOf(a), 1);
                b();
            };
        },
        update: b,
        getWidgets () {
            return d;
        }
    };
};
