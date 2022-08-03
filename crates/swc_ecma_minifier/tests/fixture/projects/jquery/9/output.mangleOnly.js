export const obj = {
    fireWith: function(i, e) {
        e = e || [];
        e = [
            i,
            e.slice ? e.slice() : e
        ];
        if (list && (!fired || stack)) {
            if (firing) {
                stack.push(e);
            } else {
                fire(e);
            }
        }
        return this;
    }
};
