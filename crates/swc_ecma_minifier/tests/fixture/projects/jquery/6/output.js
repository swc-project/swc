export const obj = {
    inArray: function(elem, arr, i) {
        var len;
        if (arr) {
            if (core_indexOf) return core_indexOf.call(arr, elem, i);
            for(len = arr.length, i = i ? i < 0 ? Math.max(0, len + i) : i : 0; i < len; i++)// Skip accessing in sparse arrays
            if (i in arr && arr[i] === elem) return i;
        }
        return -1;
    }
};
