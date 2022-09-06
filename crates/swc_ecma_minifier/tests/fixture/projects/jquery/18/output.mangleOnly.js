export const obj = {
    tweener: function(e, n) {
        if (jQuery.isFunction(e)) {
            n = e;
            e = [
                "*"
            ];
        } else {
            e = e.split(" ");
        }
        var t, r = 0, s = e.length;
        for(; r < s; r++){
            t = e[r];
            tweeners[t] = tweeners[t] || [];
            tweeners[t].unshift(n);
        }
    }
};
