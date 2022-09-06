export const E = {
    _sort: function() {
        var e = YObject.keys(this.required), r = {}, s = 0, t, i, f, o, a, c, l;
        for(;;){
            t = e.length;
            c = false;
            for(o = s; o < t; o++){
                i = e[o];
                for(a = o + 1; a < t; a++){
                    l = i + e[a];
                    if (!r[l] && this._requires(i, e[a])) {
                        f = e.splice(a, 1);
                        e.splice(o, 0, f[0]);
                        r[l] = true;
                        c = true;
                        break;
                    }
                }
                if (c) {
                    break;
                } else {
                    s++;
                }
            }
            if (!c) {
                break;
            }
        }
        this.sorted = e;
    }
};
