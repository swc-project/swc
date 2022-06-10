export const E = {
    _sort: function() {
        var a = YObject.keys(this.required), h = {}, i = 0, e, f, j, b, c, d, g;
        for(;;){
            e = a.length;
            d = false;
            for(b = i; b < e; b++){
                f = a[b];
                for(c = b + 1; c < e; c++){
                    g = f + a[c];
                    if (!h[g] && this._requires(f, a[c])) {
                        j = a.splice(c, 1);
                        a.splice(b, 0, j[0]);
                        h[g] = true;
                        d = true;
                        break;
                    }
                }
                if (d) {
                    break;
                } else {
                    i++;
                }
            }
            if (!d) {
                break;
            }
        }
        this.sorted = a;
    }
};
