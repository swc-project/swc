export const obj = {
    fireWith: function(b, a) {
        a = a || [];
        a = [
            b,
            a.slice ? a.slice() : a
        ];
        if (list && (!fired || stack)) {
            if (firing) {
                stack.push(a);
            } else {
                fire(a);
            }
        }
        return this;
    }
};
