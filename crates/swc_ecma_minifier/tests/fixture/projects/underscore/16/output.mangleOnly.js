function i() {
    aStack.push(a);
    bStack.push(b);
    var i = 0, f = true;
    if (className == "[object Array]") {
        i = a.length;
        f = i == b.length;
        if (f) {
            while(i--){
                if (!(f = eq(a[i], b[i], aStack, bStack))) break;
            }
        }
    } else {
        for(var e in a){
            if (_.has(a, e)) {
                i++;
                if (!(f = _.has(b, e) && eq(a[e], b[e], aStack, bStack))) break;
            }
        }
        if (f) {
            for(e in b){
                if (_.has(b, e) && !i--) break;
            }
            f = !i;
        }
    }
}
