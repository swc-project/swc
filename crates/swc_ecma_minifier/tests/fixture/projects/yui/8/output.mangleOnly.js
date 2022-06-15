export const E = {
    _onProgress: function(a) {
        var b = this, c;
        if (a.data && a.data.length) {
            for(c = 0; c < a.data.length; c++){
                a.data[c] = b.getModule(a.data[c].name);
            }
        }
        if (b.onProgress) {
            b.onProgress.call(b.context, {
                name: a.url,
                data: a.data
            });
        }
    }
};
