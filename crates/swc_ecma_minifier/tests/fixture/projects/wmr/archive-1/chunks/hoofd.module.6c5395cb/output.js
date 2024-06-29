var lang, linkQueue, scriptQueue, titleQueue, titleTemplateQueue, metaQueue, currentTitleIndex, currentTitleTemplateIndex, currentMetaIndex, timeout, processQueue, useTitleTemplate = function(template) {
    useTitle(template, !0);
};
import { F } from "../index.f66dda46.js";
import { y } from "../index.f66dda46.js";
import { b as s } from "../index.f66dda46.js";
var useMeta = function(options) {
    var dispatcher = F(DispatcherContext), hasMounted = s(!1), keyword = s(), metaObject = s({
        keyword: keyword.current = options.charset ? "charset" : options.name ? "name" : options.property ? "property" : "http-equiv",
        name: options.name,
        charset: options.charset,
        "http-equiv": options.httpEquiv,
        property: options.property,
        content: options.content
    });
    isServerSide && !hasMounted.current && dispatcher._addToQueue("M", metaObject.current), y(function() {
        hasMounted.current && dispatcher._change("M", metaObject.current, metaObject.current = {
            keyword: keyword.current,
            name: options.name,
            charset: options.charset,
            "http-equiv": options.httpEquiv,
            property: options.property,
            content: options.content
        });
    }, [
        options.content
    ]), y(function() {
        return dispatcher._addToQueue("M", metaObject.current), hasMounted.current = !0, function() {
            hasMounted.current = !1, dispatcher._removeFromQueue("M", metaObject.current);
        };
    }, []);
};
var toStatic = defaultDispatcher.toStatic;
import "../index.f66dda46.js";
var isServerSide = "undefined" == typeof document, changeOrCreateMetaTag = function(meta) {
    var result = document.head.querySelectorAll(meta.charset ? "meta[" + meta.keyword + "]" : "meta[" + meta.keyword + '="' + meta[meta.keyword] + '"]');
    if (result[0]) meta.charset ? result[0].setAttribute(meta.keyword, meta.charset) : result[0].setAttribute("content", meta.content);
    else {
        var metaTag = document.createElement("meta");
        meta.charset ? metaTag.setAttribute(meta.keyword, meta.charset) : (metaTag.setAttribute(meta.keyword, meta[meta.keyword]), metaTag.setAttribute("content", meta.content)), document.head.appendChild(metaTag);
    }
};
var applyTitleTemplate = function(title, template) {
    return template ? template.replace(/%s/g, title || "") : title;
}, defaultDispatcher = (linkQueue = [], scriptQueue = [], titleQueue = [], titleTemplateQueue = [], metaQueue = [], currentTitleIndex = 0, currentTitleTemplateIndex = 0, currentMetaIndex = 0, processQueue = function() {
    clearTimeout(timeout), timeout = setTimeout(function() {
        timeout = null;
        var visited = new Set();
        document.title = applyTitleTemplate(titleQueue[0], titleTemplateQueue[0]), metaQueue.forEach(function(meta) {
            visited.has(meta.charset ? meta.keyword : meta[meta.keyword]) || (visited.add(meta.charset ? meta.keyword : meta[meta.keyword]), changeOrCreateMetaTag(meta));
        }), currentTitleIndex = currentTitleTemplateIndex = currentMetaIndex = 0;
    }, 1000 / 60);
}, {
    _setLang: function(l) {
        lang = l;
    },
    _addToQueue: function(type, payload) {
        isServerSide || processQueue(), "S" === type ? scriptQueue.push(payload) : "T" === type ? titleQueue.splice(currentTitleIndex++, 0, payload) : "P" === type ? titleTemplateQueue.splice(currentTitleTemplateIndex++, 0, payload) : "M" === type ? metaQueue.splice(currentMetaIndex++, 0, payload) : linkQueue.push(payload);
    },
    _removeFromQueue: function(type, payload) {
        if ("T" === type || "P" === type) {
            var queue = "P" === type ? titleTemplateQueue : titleQueue, index = queue.indexOf(payload);
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
        if ("T" === type || "P" === type) {
            var queue = "P" === type ? titleTemplateQueue : titleQueue;
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
});
import { D } from "../index.f66dda46.js";
var DispatcherContext = D(defaultDispatcher);
import { F } from "../index.f66dda46.js";
import { y } from "../index.f66dda46.js";
var useLang = function(language) {
    var dispatcher = F(DispatcherContext);
    isServerSide && dispatcher._setLang(language), y(function() {
        document.getElementsByTagName("html")[0].setAttribute("lang", language);
    }, [
        language
    ]);
};
import { F } from "../index.f66dda46.js";
import { y } from "../index.f66dda46.js";
import { b as s } from "../index.f66dda46.js";
var useLink = function(options) {
    var dispatcher = F(DispatcherContext), hasMounted = s(!1), node = s(), originalOptions = s();
    isServerSide && !hasMounted.current && dispatcher._addToQueue("L", options), y(function() {
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
        options.hreflang
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
import { F } from "../index.f66dda46.js";
import { y } from "../index.f66dda46.js";
import { b as s } from "../index.f66dda46.js";
var useTitle = function(title, template) {
    var dispatcher = F(DispatcherContext), hasMounted = s(!1), prevTitle = s();
    isServerSide && !hasMounted.current && dispatcher._addToQueue(template ? "P" : "T", title), y(function() {
        hasMounted.current && dispatcher._change(template ? "P" : "T", prevTitle.current, prevTitle.current = title);
    }, [
        title,
        template
    ]), y(function() {
        return hasMounted.current = !0, dispatcher._addToQueue(template ? "P" : "T", prevTitle.current = title), function() {
            hasMounted.current = !1, dispatcher._removeFromQueue(template ? "P" : "T", prevTitle.current);
        };
    }, [
        template
    ]);
};
export { useTitleTemplate as a, useTitle as b, useMeta as c, useLink as d, toStatic as t, useLang as u };
