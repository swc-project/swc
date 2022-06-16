export const E = {
    _addLangPack: function(a, b, c) {
        var d = b.name, e, f, g = this.moduleInfo[c];
        if (!g) {
            e = _path(b.pkg || d, c, JS, true);
            f = {
                path: e,
                intl: true,
                langPack: true,
                ext: b.ext,
                group: b.group,
                supersedes: []
            };
            if (b.root) {
                f.root = b.root;
            }
            if (b.base) {
                f.base = b.base;
            }
            if (b.configFn) {
                f.configFn = b.configFn;
            }
            this.addModule(f, c);
            if (a) {
                Y.Env.lang = Y.Env.lang || {};
                Y.Env.lang[a] = Y.Env.lang[a] || {};
                Y.Env.lang[a][d] = true;
            }
        }
        return this.moduleInfo[c];
    }
};
