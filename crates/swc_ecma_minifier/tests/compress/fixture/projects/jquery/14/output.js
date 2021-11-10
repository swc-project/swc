export const obj = {
    preventDefault: function() {
        var e = this.originalEvent;
        this.isDefaultPrevented = returnTrue, e && (e.preventDefault ? e.preventDefault() : e.returnValue = !1);
    }
};
