export const E = {
    _sort: function() {
        for(var l, a, b, j, k, moved, doneKey, s = YObject.keys(this.required), done = {}, p = 0;;){
            for(l = s.length, moved = !1, j = p; j < l; j++){
                for(a = s[j], k = j + 1; k < l; k++)if (!done[doneKey = a + s[k]] && this._requires(a, s[k])) {
                    b = s.splice(k, 1), s.splice(j, 0, b[0]), done[doneKey] = !0, moved = !0;
                    break;
                }
                if (moved) break;
                p++;
            }
            if (!moved) break;
        }
        this.sorted = s;
    }
};
