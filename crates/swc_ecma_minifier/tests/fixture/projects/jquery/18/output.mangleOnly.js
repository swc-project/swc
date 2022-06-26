export const obj = {
    tweener: function(a, b) {
        if (jQuery.isFunction(a)) {
            b = a;
            a = [
                "*"
            ];
        } else {
            a = a.split(" ");
        }
        var c, d = 0, e = a.length;
        for(; d < e; d++){
            c = a[d];
            tweeners[c] = tweeners[c] || [];
            tweeners[c].unshift(b);
        }
    }
};
