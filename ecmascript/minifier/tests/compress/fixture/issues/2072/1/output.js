function cost(oldItem, newItem) {
    if (newItem.val === oldItem.val) return 0;
    if ("object" == typeof oldItem.val && "object" == typeof newItem.val) {
        if (void 0 === oldItem.key || void 0 === newItem.key) return 1;
        if (oldItem.key === newItem.key) return 0;
    }
    return 1;
}
