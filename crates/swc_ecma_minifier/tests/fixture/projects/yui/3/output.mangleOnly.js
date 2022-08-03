Y.Loader.prototype._rollup = function() {
    var e, i, r, s, t = this.required, l, o = this.moduleInfo, f, u, h;
    if (this.dirty || !this.rollups) {
        this.rollups = {};
        for(e in o){
            if (o.hasOwnProperty(e)) {
                r = this.getModule(e);
                if (r && r.rollup) {
                    this.rollups[e] = r;
                }
            }
        }
    }
    for(;;){
        f = false;
        for(e in this.rollups){
            if (this.rollups.hasOwnProperty(e)) {
                if (!t[e] && (!this.loaded[e] || this.forceMap[e])) {
                    r = this.getModule(e);
                    s = r.supersedes || [];
                    l = false;
                    if (!r.rollup) {
                        continue;
                    }
                    u = 0;
                    for(i = 0; i < s.length; i++){
                        h = o[s[i]];
                        if (this.loaded[s[i]] && !this.forceMap[s[i]]) {
                            l = false;
                            break;
                        } else if (t[s[i]] && r.type === h.type) {
                            u++;
                            l = u >= r.rollup;
                            if (l) {
                                break;
                            }
                        }
                    }
                    if (l) {
                        t[e] = true;
                        f = true;
                        this.getRequires(r);
                    }
                }
            }
        }
        if (!f) {
            break;
        }
    }
};
