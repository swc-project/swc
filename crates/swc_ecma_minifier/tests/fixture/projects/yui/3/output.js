Y.Loader.prototype._rollup = function() {
    var i, j, m, s, roll, rolled, c, smod, r = this.required, info = this.moduleInfo;
    if (this.dirty || !this.rollups) {
        this.rollups = {};
        for(i in info)info.hasOwnProperty(i) && (m = this.getModule(i)) && m.rollup && (this.rollups[i] = m);
    }
    for(;;){
        rolled = !1;
        for(i in this.rollups)if (this.rollups.hasOwnProperty(i) && !r[i] && (!this.loaded[i] || this.forceMap[i])) {
            s = (m = this.getModule(i)).supersedes || [];
            roll = !1;
            if (!m.rollup) continue;
            c = 0;
            for(j = 0; j < s.length; j++){
                smod = info[s[j]];
                if (this.loaded[s[j]] && !this.forceMap[s[j]]) {
                    roll = !1;
                    break;
                }
                if (r[s[j]] && m.type === smod.type && (roll = ++c >= m.rollup)) break;
            }
            if (roll) {
                r[i] = !0;
                rolled = !0;
                this.getRequires(m);
            }
        }
        if (!rolled) break;
    }
};
