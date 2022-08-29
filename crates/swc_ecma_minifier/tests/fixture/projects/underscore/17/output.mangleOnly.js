export function foo() {
    var e = 0, f = true;
    if (className == "[object Array]") {
        e = a.length;
        f = e == b.length;
        if (f) {
            while(e--){
                if (!(f = eq(a[e], b[e], aStack, bStack))) break;
            }
        }
    } else {
        for(var i in a){
            if (_.has(a, i)) {
                e++;
                if (!(f = _.has(b, i) && eq(a[i], b[i], aStack, bStack))) break;
            }
        }
        if (f) {
            for(i in b){
                if (_.has(b, i) && !e--) break;
            }
            f = !e;
        }
    }
}
