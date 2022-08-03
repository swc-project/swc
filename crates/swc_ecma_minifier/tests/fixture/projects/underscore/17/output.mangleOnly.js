export function foo() {
    var f = 0, i = true;
    if (className == "[object Array]") {
        f = a.length;
        i = f == b.length;
        if (i) {
            while(f--){
                if (!(i = eq(a[f], b[f], aStack, bStack))) break;
            }
        }
    } else {
        for(var e in a){
            if (_.has(a, e)) {
                f++;
                if (!(i = _.has(b, e) && eq(a[e], b[e], aStack, bStack))) break;
            }
        }
        if (i) {
            for(e in b){
                if (_.has(b, e) && !f--) break;
            }
            i = !f;
        }
    }
}
