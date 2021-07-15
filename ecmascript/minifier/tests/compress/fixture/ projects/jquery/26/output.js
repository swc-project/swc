export const obj = {
    clone: function(dataAndEvents, deepDataAndEvents) {
        return dataAndEvents = null != dataAndEvents && dataAndEvents, deepDataAndEvents = null == deepDataAndEvents ? dataAndEvents : deepDataAndEvents, this.map(function() {
            return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
        });
    }
};
