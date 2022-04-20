Y.Loader.prototype._rollup = function() {
    var i, j, m, s, roll, rolled, c, smod, r = this.required, info = this.moduleInfo;
    if (this.dirty || !this.rollups) for(i in this.rollups = {}, info)info.hasOwnProperty(i) && (m = this.getModule(i)) && m.rollup && (this.rollups[i] = m);
    for(;;){
        for(i in rolled = !1, this.rollups)if (this.rollups.hasOwnProperty(i) && !r[i] && (!this.loaded[i] || this.forceMap[i])) {
            if (s = (m = this.getModule(i)).supersedes || [], roll = !1, !m.rollup) continue;
            for(j = 0, c = 0; j < s.length; j++){
                if (smod = info[s[j]], this.loaded[s[j]] && !this.forceMap[s[j]]) {
                    roll = !1;
                    break;
                }
                if (r[s[j]] && m.type === smod.type && (roll = ++c >= m.rollup)) break;
            }
            roll && (r[i] = !0, rolled = !0, this.getRequires(m));
        }
        if (!rolled) break;
    }
};
