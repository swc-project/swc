export function foo() {
    var c = 0, d = true;
    if (className == "[object Array]") {
        c = a.length;
        d = c == b.length;
        if (d) {
            while(c--){
                if (!(d = eq(a[c], b[c], aStack, bStack))) break;
            }
        }
    } else {
        for(var e in a){
            if (_.has(a, e)) {
                c++;
                if (!(d = _.has(b, e) && eq(a[e], b[e], aStack, bStack))) break;
            }
        }
        if (d) {
            for(e in b){
                if (_.has(b, e) && !c--) break;
            }
            d = !c;
        }
    }
}
