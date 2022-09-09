export const E = {
    _addLangPack: function(n, o, t) {
        var a = o.name, e, r, g = this.moduleInfo[t];
        if (!g) {
            e = _path(o.pkg || a, t, JS, true);
            r = {
                path: e,
                intl: true,
                langPack: true,
                ext: o.ext,
                group: o.group,
                supersedes: []
            };
            if (o.root) {
                r.root = o.root;
            }
            if (o.base) {
                r.base = o.base;
            }
            if (o.configFn) {
                r.configFn = o.configFn;
            }
            this.addModule(r, t);
            if (n) {
                Y.Env.lang = Y.Env.lang || {};
                Y.Env.lang[n] = Y.Env.lang[n] || {};
                Y.Env.lang[n][a] = true;
            }
        }
        return this.moduleInfo[t];
    }
};
