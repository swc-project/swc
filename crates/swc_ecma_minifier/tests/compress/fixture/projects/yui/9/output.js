export const E = {
    _addLangPack: function(lang, m, packName) {
        var conf, name = m.name;
        return !this.moduleInfo[packName] && (conf = {
            path: _path(m.pkg || name, packName, JS, !0),
            intl: !0,
            langPack: !0,
            ext: m.ext,
            group: m.group,
            supersedes: []
        }, m.root && (conf.root = m.root), m.base && (conf.base = m.base), m.configFn && (conf.configFn = m.configFn), this.addModule(conf, packName), lang && (Y.Env.lang = Y.Env.lang || {}, Y.Env.lang[lang] = Y.Env.lang[lang] || {}, Y.Env.lang[lang][name] = !0)), this.moduleInfo[packName];
    }
};
