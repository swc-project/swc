Y.Loader.prototype._rollup = function() {
    var a, c, b, d, f = this.required, e, g = this.moduleInfo, h, i, j;
    if (this.dirty || !this.rollups) {
        this.rollups = {};
        for(a in g){
            if (g.hasOwnProperty(a)) {
                b = this.getModule(a);
                if (b && b.rollup) {
                    this.rollups[a] = b;
                }
            }
        }
    }
    for(;;){
        h = false;
        for(a in this.rollups){
            if (this.rollups.hasOwnProperty(a)) {
                if (!f[a] && (!this.loaded[a] || this.forceMap[a])) {
                    b = this.getModule(a);
                    d = b.supersedes || [];
                    e = false;
                    if (!b.rollup) {
                        continue;
                    }
                    i = 0;
                    for(c = 0; c < d.length; c++){
                        j = g[d[c]];
                        if (this.loaded[d[c]] && !this.forceMap[d[c]]) {
                            e = false;
                            break;
                        } else if (f[d[c]] && b.type === j.type) {
                            i++;
                            e = i >= b.rollup;
                            if (e) {
                                break;
                            }
                        }
                    }
                    if (e) {
                        f[a] = true;
                        h = true;
                        this.getRequires(b);
                    }
                }
            }
        }
        if (!h) {
            break;
        }
    }
};
