Y.Loader.prototype._rollup = function() {
    var a, b, c, d, e = this.required, f, g = this.moduleInfo, h, i, j;
    if (this.dirty || !this.rollups) {
        this.rollups = {};
        for(a in g){
            if (g.hasOwnProperty(a)) {
                c = this.getModule(a);
                if (c && c.rollup) {
                    this.rollups[a] = c;
                }
            }
        }
    }
    for(;;){
        h = false;
        for(a in this.rollups){
            if (this.rollups.hasOwnProperty(a)) {
                if (!e[a] && (!this.loaded[a] || this.forceMap[a])) {
                    c = this.getModule(a);
                    d = c.supersedes || [];
                    f = false;
                    if (!c.rollup) {
                        continue;
                    }
                    i = 0;
                    for(b = 0; b < d.length; b++){
                        j = g[d[b]];
                        if (this.loaded[d[b]] && !this.forceMap[d[b]]) {
                            f = false;
                            break;
                        } else if (e[d[b]] && c.type === j.type) {
                            i++;
                            f = i >= c.rollup;
                            if (f) {
                                break;
                            }
                        }
                    }
                    if (f) {
                        e[a] = true;
                        h = true;
                        this.getRequires(c);
                    }
                }
            }
        }
        if (!h) {
            break;
        }
    }
};
