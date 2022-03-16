import { D, F, y, b as s } from "../index.f66dda46.js";
var isServerSide = "undefined" == typeof document, META = "M", TITLE = "T", LINK = "L", TEMPLATE = "P", SCRIPT = "S", applyTitleTemplate = function(title, template) {
    return template ? template.replace(/%s/g, title || "") : title;
}, changeOrCreateMetaTag = function(meta) {
    var result = document.head.querySelectorAll(meta.charset ? "meta[" + meta.keyword + "]" : "meta[" + meta.keyword + '="' + meta[meta.keyword] + '"]');
    if (result[0]) meta.charset ? result[0].setAttribute(meta.keyword, meta.charset) : result[0].setAttribute("content", meta.content);
    else {
        var metaTag = document.createElement("meta");
        meta.charset ? metaTag.setAttribute(meta.keyword, meta.charset) : (metaTag.setAttribute(meta.keyword, meta[meta.keyword]), metaTag.setAttribute("content", meta.content)), document.head.appendChild(metaTag);
    }
}, createDispatcher = function() {
    var lang, timeout, linkQueue = [], scriptQueue = [], titleQueue = [], titleTemplateQueue = [], metaQueue = [], currentTitleIndex = 0, currentTitleTemplateIndex = 0, currentMetaIndex = 0, processQueue = function() {
        clearTimeout(timeout), timeout = setTimeout(function() {
            timeout = null;
            var visited = new Set();
            document.title = applyTitleTemplate(titleQueue[0], titleTemplateQueue[0]), metaQueue.forEach(function(meta) {
                visited.has(meta.charset ? meta.keyword : meta[meta.keyword]) || (visited.add(meta.charset ? meta.keyword : meta[meta.keyword]), changeOrCreateMetaTag(meta));
            }), currentTitleIndex = currentTitleTemplateIndex = currentMetaIndex = 0;
        }, 1000 / 60);
    };
    return {
        _setLang: function(l) {
            lang = l;
        },
        _addToQueue: function(type, payload) {
            isServerSide || processQueue(), type === SCRIPT ? scriptQueue.push(payload) : type === TITLE ? titleQueue.splice(currentTitleIndex++, 0, payload) : type === TEMPLATE ? titleTemplateQueue.splice(currentTitleTemplateIndex++, 0, payload) : type === META ? metaQueue.splice(currentMetaIndex++, 0, payload) : linkQueue.push(payload);
        },
        _removeFromQueue: function(type, payload) {
            if (type === TITLE || type === TEMPLATE) {
                var queue = type === TEMPLATE ? titleTemplateQueue : titleQueue, index = queue.indexOf(payload);
                queue.splice(index, 1), 0 === index && (document.title = applyTitleTemplate(titleQueue[0] || "", titleTemplateQueue[0]));
            } else {
                var oldMeta = metaQueue[metaQueue.indexOf(payload)];
                if (oldMeta) {
                    metaQueue.splice(metaQueue.indexOf(payload), 1);
                    var newMeta = metaQueue.find(function(m) {
                        return m.keyword === oldMeta.keyword && (m.charset || m[m.keyword] === oldMeta[m.keyword]);
                    });
                    if (newMeta) changeOrCreateMetaTag(newMeta);
                    else {
                        var result = document.head.querySelectorAll(oldMeta.charset ? "meta[" + oldMeta.keyword + "]" : "meta[" + oldMeta.keyword + '="' + oldMeta[oldMeta.keyword] + '"]');
                        document.head.removeChild(result[0]);
                    }
                }
            }
        },
        _change: function(type, prevPayload, payload) {
            if (type === TITLE || type === TEMPLATE) {
                var queue = type === TEMPLATE ? titleTemplateQueue : titleQueue;
                queue[queue.indexOf(prevPayload)] = payload, 0 === queue.indexOf(payload) && (document.title = applyTitleTemplate(queue[queue.indexOf(payload)], titleTemplateQueue[0]));
            } else changeOrCreateMetaTag(metaQueue[metaQueue.indexOf(prevPayload)] = payload);
        },
        _reset: void 0,
        toStatic: function() {
            var title = applyTitleTemplate(titleQueue[titleQueue.length - 1], titleTemplateQueue[titleTemplateQueue.length - 1]), visited = new Set(), links = [].concat(linkQueue), scripts = [].concat(scriptQueue);
            metaQueue.reverse();
            var metas = [].concat(metaQueue).filter(function(meta) {
                if (!visited.has(meta.charset ? meta.keyword : meta[meta.keyword])) return visited.add(meta.charset ? meta.keyword : meta[meta.keyword]), !0;
            });
            return titleQueue = [], titleTemplateQueue = [], metaQueue = [], linkQueue = [], scriptQueue = [], currentTitleIndex = currentTitleTemplateIndex = currentMetaIndex = 0, {
                lang: lang,
                title: title,
                links: links,
                scripts: scripts,
                metas: metas.map(function(meta) {
                    var _ref;
                    return "charset" === meta.keyword ? {
                        charset: meta[meta.keyword]
                    } : ((_ref = {})[meta.keyword] = meta[meta.keyword], _ref.content = meta.content, _ref);
                })
            };
        }
    };
}, defaultDispatcher = createDispatcher(), DispatcherContext = D(defaultDispatcher), useLang = function(language) {
    var dispatcher = F(DispatcherContext);
    isServerSide && dispatcher._setLang(language), y(function() {
        document.getElementsByTagName("html")[0].setAttribute("lang", language);
    }, [
        language, 
    ]);
}, useLink = function(options) {
    var dispatcher = F(DispatcherContext), hasMounted = s(!1), node = s(), originalOptions = s();
    isServerSide && !hasMounted.current && dispatcher._addToQueue(LINK, options), y(function() {
        hasMounted.current && Object.keys(options).forEach(function(key) {
            node.current.setAttribute(key, options[key]);
        });
    }, [
        options.href,
        options.media,
        options.as,
        options.rel,
        options.crossorigin,
        options.type,
        options.hreflang, 
    ]), y(function() {
        return hasMounted.current = !0, document.querySelectorAll('link[rel="' + options.rel + '"]').forEach(function(x) {
            var found = !0;
            Object.keys(options).forEach(function(key) {
                x.getAttribute(key) !== options[key] && (found = !1);
            }), found && (node.current = x);
        }), node.current ? originalOptions.current = Object.keys(options).reduce(function(acc, key) {
            return acc[key] = node.current.getAttribute(key), acc;
        }, {}) : (node.current = document.createElement("link"), Object.keys(options).forEach(function(key) {
            node.current.setAttribute(key, options[key]);
        }), document.head.appendChild(node.current)), function() {
            hasMounted.current = !1, originalOptions.current ? Object.keys(originalOptions.current).forEach(function(key) {
                node.current.setAttribute(key, originalOptions.current[key]);
            }) : document.head.removeChild(node.current);
        };
    }, []);
};
function extractKeyword(meta) {
    return meta.charset ? "charset" : meta.name ? "name" : meta.property ? "property" : "http-equiv";
}
var useMeta = function(options) {
    var dispatcher = F(DispatcherContext), hasMounted = s(!1), keyword = s(), metaObject = s({
        keyword: keyword.current = extractKeyword(options),
        name: options.name,
        charset: options.charset,
        "http-equiv": options.httpEquiv,
        property: options.property,
        content: options.content
    });
    isServerSide && !hasMounted.current && dispatcher._addToQueue(META, metaObject.current), y(function() {
        hasMounted.current && dispatcher._change(META, metaObject.current, metaObject.current = {
            keyword: keyword.current,
            name: options.name,
            charset: options.charset,
            "http-equiv": options.httpEquiv,
            property: options.property,
            content: options.content
        });
    }, [
        options.content, 
    ]), y(function() {
        return dispatcher._addToQueue(META, metaObject.current), hasMounted.current = !0, function() {
            hasMounted.current = !1, dispatcher._removeFromQueue(META, metaObject.current);
        };
    }, []);
}, useTitle = function(title, template) {
    var dispatcher = F(DispatcherContext), hasMounted = s(!1), prevTitle = s();
    isServerSide && !hasMounted.current && dispatcher._addToQueue(template ? TEMPLATE : TITLE, title), y(function() {
        hasMounted.current && dispatcher._change(template ? TEMPLATE : TITLE, prevTitle.current, prevTitle.current = title);
    }, [
        title,
        template, 
    ]), y(function() {
        return hasMounted.current = !0, dispatcher._addToQueue(template ? TEMPLATE : TITLE, prevTitle.current = title), function() {
            hasMounted.current = !1, dispatcher._removeFromQueue(template ? TEMPLATE : TITLE, prevTitle.current);
        };
    }, [
        template, 
    ]);
}, useTitleTemplate = function(template) {
    useTitle(template, !0);
}, toStatic = defaultDispatcher.toStatic;
export { useTitleTemplate as a, useTitle as b, useMeta as c, useLink as d, toStatic as t, useLang as u };
