export const obj = {
    fireWith: function(a, b) {
        b = b || [];
        b = [
            a,
            b.slice ? b.slice() : b
        ];
        if (list && (!fired || stack)) {
            if (firing) {
                stack.push(b);
            } else {
                fire(b);
            }
        }
        return this;
    }
};
