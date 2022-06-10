export const obj = {
    preventDefault: function() {
        var a = this.originalEvent;
        this.isDefaultPrevented = returnTrue;
        if (!a) {
            return;
        }
        if (a.preventDefault) {
            a.preventDefault();
        } else {
            a.returnValue = false;
        }
    }
};
