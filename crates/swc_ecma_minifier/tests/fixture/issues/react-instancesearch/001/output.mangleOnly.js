import { defer as t } from "./utils";
export default function e(e) {
    const r = [];
    let n = false;
    function u() {
        if (n) {
            return;
        }
        n = true;
        t(()=>{
            n = false;
            e();
        });
    }
    return {
        registerWidget (t) {
            r.push(t);
            u();
            return function e() {
                r.splice(r.indexOf(t), 1);
                u();
            };
        },
        update: u,
        getWidgets () {
            return r;
        }
    };
}
