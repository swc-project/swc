import { defer as e } from "./utils";
export default function t(t) {
    const r = [];
    let n = false;
    function u() {
        if (n) {
            return;
        }
        n = true;
        e(()=>{
            n = false;
            t();
        });
    }
    return {
        registerWidget (e) {
            r.push(e);
            u();
            return function t() {
                r.splice(r.indexOf(e), 1);
                u();
            };
        },
        update: u,
        getWidgets () {
            return r;
        }
    };
};
