function cost(oldItem, newItem) {
    if (newItem.val === oldItem.val) {
        return 0
    }
    if (typeof oldItem.val === 'object' && typeof newItem.val === 'object') {
        if (oldItem.key === undefined || newItem.key === undefined) {
            return 1
        }
        if (oldItem.key === newItem.key) {
            return 0
        }
    }
    return 1
}