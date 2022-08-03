export const E = {
    _sort: function() {
        var e = YObject.keys(this.required), r = {}, s = 0, i, t, f, o, a, l, u;
        for(;;){
            i = e.length;
            l = false;
            for(o = s; o < i; o++){
                t = e[o];
                for(a = o + 1; a < i; a++){
                    u = t + e[a];
                    if (!r[u] && this._requires(t, e[a])) {
                        f = e.splice(a, 1);
                        e.splice(o, 0, f[0]);
                        r[u] = true;
                        l = true;
                        break;
                    }
                }
                if (l) {
                    break;
                } else {
                    s++;
                }
            }
            if (!l) {
                break;
            }
        }
        this.sorted = e;
    }
};
