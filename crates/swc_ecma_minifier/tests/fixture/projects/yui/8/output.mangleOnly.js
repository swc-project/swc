export const E = {
    _onProgress: function(a) {
        var c = this, b;
        if (a.data && a.data.length) {
            for(b = 0; b < a.data.length; b++){
                a.data[b] = c.getModule(a.data[b].name);
            }
        }
        if (c.onProgress) {
            c.onProgress.call(c.context, {
                name: a.url,
                data: a.data
            });
        }
    }
};
