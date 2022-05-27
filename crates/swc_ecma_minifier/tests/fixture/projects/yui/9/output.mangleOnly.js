export const E = {
    _addLangPack: function(c, a, d) {
        var e = a.name, f, b, g = this.moduleInfo[d];
        if (!g) {
            f = _path(a.pkg || e, d, JS, true);
            b = {
                path: f,
                intl: true,
                langPack: true,
                ext: a.ext,
                group: a.group,
                supersedes: []
            };
            if (a.root) {
                b.root = a.root;
            }
            if (a.base) {
                b.base = a.base;
            }
            if (a.configFn) {
                b.configFn = a.configFn;
            }
            this.addModule(b, d);
            if (c) {
                Y.Env.lang = Y.Env.lang || {};
                Y.Env.lang[c] = Y.Env.lang[c] || {};
                Y.Env.lang[c][e] = true;
            }
        }
        return this.moduleInfo[d];
    }
};
