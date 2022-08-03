export const E = {
    _onProgress: function(a) {
        var t = this, o;
        if (a.data && a.data.length) {
            for(o = 0; o < a.data.length; o++){
                a.data[o] = t.getModule(a.data[o].name);
            }
        }
        if (t.onProgress) {
            t.onProgress.call(t.context, {
                name: a.url,
                data: a.data
            });
        }
    }
};
