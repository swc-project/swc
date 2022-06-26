export const E = {
    _sort: function() {
        var a = YObject.keys(this.required), b = {}, c = 0, d, e, f, g, h, i, j;
        for(;;){
            d = a.length;
            i = false;
            for(g = c; g < d; g++){
                e = a[g];
                for(h = g + 1; h < d; h++){
                    j = e + a[h];
                    if (!b[j] && this._requires(e, a[h])) {
                        f = a.splice(h, 1);
                        a.splice(g, 0, f[0]);
                        b[j] = true;
                        i = true;
                        break;
                    }
                }
                if (i) {
                    break;
                } else {
                    c++;
                }
            }
            if (!i) {
                break;
            }
        }
        this.sorted = a;
    }
};
