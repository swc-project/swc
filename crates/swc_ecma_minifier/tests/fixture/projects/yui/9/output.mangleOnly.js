export const E = {
    _addLangPack: function(n, o, e) {
        var t = o.name, a, r, g = this.moduleInfo[e];
        if (!g) {
            a = _path(o.pkg || t, e, JS, true);
            r = {
                path: a,
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
            this.addModule(r, e);
            if (n) {
                Y.Env.lang = Y.Env.lang || {};
                Y.Env.lang[n] = Y.Env.lang[n] || {};
                Y.Env.lang[n][t] = true;
            }
        }
        return this.moduleInfo[e];
    }
};
