import { defer as a } from "./utils";
export default function b(b) {
    const c = [];
    let d = false;
    function e() {
        if (d) {
            return;
        }
        d = true;
        a(()=>{
            d = false;
            b();
        });
    }
    return {
        registerWidget (a) {
            c.push(a);
            e();
            return function b() {
                c.splice(c.indexOf(a), 1);
                e();
            };
        },
        update: e,
        getWidgets () {
            return c;
        }
    };
};
