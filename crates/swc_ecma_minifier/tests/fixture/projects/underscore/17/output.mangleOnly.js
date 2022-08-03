export function foo() {
    var i = 0, e = true;
    if (className == "[object Array]") {
        i = a.length;
        e = i == b.length;
        if (e) {
            while(i--){
                if (!(e = eq(a[i], b[i], aStack, bStack))) break;
            }
        }
    } else {
        for(var f in a){
            if (_.has(a, f)) {
                i++;
                if (!(e = _.has(b, f) && eq(a[f], b[f], aStack, bStack))) break;
            }
        }
        if (e) {
            for(f in b){
                if (_.has(b, f) && !i--) break;
            }
            e = !i;
        }
    }
}
