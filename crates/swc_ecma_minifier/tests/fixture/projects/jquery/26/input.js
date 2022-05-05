export const obj = {
    clone: function (dataAndEvents, deepDataAndEvents) {
        dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
        deepDataAndEvents =
            deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

        return this.map(function () {
            return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
        });
    },
};
