export const obj = {
    fireWith: function(context, args) {
        return args = [
            context,
            (args = args || []).slice ? args.slice() : args
        ], list && (!fired || stack) && (firing ? stack.push(args) : fire(args)), this;
    }
};
