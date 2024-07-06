Y.Loader.prototype._rollup = function() {
    var i, j, m, s, roll, rolled, c, smod, r = this.required, info = this.moduleInfo;
    // find and cache rollup modules
    if (this.dirty || !this.rollups) for(i in this.rollups = {}, info)info.hasOwnProperty(i) && (m = this.getModule(i)) && m.rollup && (this.rollups[i] = m);
    // make as many passes as needed to pick up rollup rollups
    for(;;){
        // go through the rollup candidates
        for(i in rolled = !1, this.rollups)if (this.rollups.hasOwnProperty(i) && !r[i] && (!this.loaded[i] || this.forceMap[i])) {
            // @TODO remove continue
            if (s = (m = this.getModule(i)).supersedes || [], roll = !1, !m.rollup) continue;
            // check the threshold
            for(j = 0, c = 0; j < s.length; j++){
                // if the superseded module is loaded, we can't
                // load the rollup unless it has been forced.
                if (smod = info[s[j]], this.loaded[s[j]] && !this.forceMap[s[j]]) {
                    roll = !1;
                    break;
                // increment the counter if this module is required.
                // if we are beyond the rollup threshold, we will
                // use the rollup module
                }
                if (r[s[j]] && m.type === smod.type && (roll = ++c >= m.rollup)) break;
            }
            roll && (// add the rollup
            r[i] = !0, rolled = !0, // expand the rollup's dependencies
            this.getRequires(m));
        }
        // if we made it here w/o rolling up something, we are done
        if (!rolled) break;
    }
};
