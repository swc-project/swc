export const E = {
    _addLangPack: function (lang, m, packName) {
        var name = m.name,
            packPath, conf,
            existing = this.moduleInfo[packName];

        if (!existing) {

            packPath = _path((m.pkg || name), packName, JS, true);

            conf = {
                path: packPath,
                intl: true,
                langPack: true,
                ext: m.ext,
                group: m.group,
                supersedes: []
            };
            if (m.root) {
                conf.root = m.root;
            }
            if (m.base) {
                conf.base = m.base;
            }

            if (m.configFn) {
                conf.configFn = m.configFn;
            }

            this.addModule(conf, packName);

            if (lang) {
                Y.Env.lang = Y.Env.lang || {};
                Y.Env.lang[lang] = Y.Env.lang[lang] || {};
                Y.Env.lang[lang][name] = true;
            }
        }

        return this.moduleInfo[packName];
    },
}