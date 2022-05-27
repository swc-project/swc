export const obj = {
    tweener: function(a, d) {
        if (jQuery.isFunction(a)) {
            d = a;
            a = [
                "*"
            ];
        } else {
            a = a.split(" ");
        }
        var b, c = 0, e = a.length;
        for(; c < e; c++){
            b = a[c];
            tweeners[b] = tweeners[b] || [];
            tweeners[b].unshift(d);
        }
    }
};
