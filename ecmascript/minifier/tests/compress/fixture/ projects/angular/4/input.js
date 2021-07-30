
export const obj = {
    eq: function (
        jqLite,
        index
    ) {
        return index >= 0
            ? jqLite(
                this[index]
            )
            : jqLite(
                this[this.length + index]
            );
    },
}