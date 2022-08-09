export const obj = {
    tweener: function(n, t) {
        if (jQuery.isFunction(n)) {
            t = n;
            n = [
                "*"
            ];
        } else {
            n = n.split(" ");
        }
        var e, i = 0, o = n.length;
        for(; i < o; i++){
            e = n[i];
            tweeners[e] = tweeners[e] || [];
            tweeners[e].unshift(t);
        }
    }
};
