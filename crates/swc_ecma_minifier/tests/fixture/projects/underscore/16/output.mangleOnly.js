function e() {
    aStack.push(a);
    bStack.push(b);
    var e = 0, i = true;
    if (className == "[object Array]") {
        e = a.length;
        i = e == b.length;
        if (i) {
            while(e--){
                if (!(i = eq(a[e], b[e], aStack, bStack))) break;
            }
        }
    } else {
        for(var t in a){
            if (_.has(a, t)) {
                e++;
                if (!(i = _.has(b, t) && eq(a[t], b[t], aStack, bStack))) break;
            }
        }
        if (i) {
            for(t in b){
                if (_.has(b, t) && !e--) break;
            }
            i = !e;
        }
    }
}
