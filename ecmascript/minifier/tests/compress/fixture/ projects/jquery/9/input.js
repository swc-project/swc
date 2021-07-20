export const obj = {
    fireWith: function (context, args) {
        args = args || [];
        args = [context, args.slice ? args.slice() : args];
        if (list && (!fired || stack)) {
            if (firing) {
                stack.push(args);
            } else {
                fire(args);
            }
        }
        return this;
    },
}