import { D, F, y, b as s } from "../index.f66dda46.js";
var isServerSide = typeof document === "undefined";

var META = "M";
var TITLE = "T";
var LINK = "L";
var TEMPLATE = "P";
var SCRIPT = "S";

var applyTitleTemplate = function applyTitleTemplate(title, template) {
    return template ? template.replace(/%s/g, title || "") : title;
};

var changeOrCreateMetaTag = function changeOrCreateMetaTag(meta) {
    var result = document.head.querySelectorAll(
        meta.charset
            ? "meta[" + meta.keyword + "]"
            : "meta[" + meta.keyword + '="' + meta[meta.keyword] + '"]'
    );

    if (result[0]) {
        if (meta.charset) {
            result[0].setAttribute(meta.keyword, meta.charset);
        } else {
            result[0].setAttribute("content", meta.content);
        }
    } else {
        var metaTag = document.createElement("meta");

        if (meta.charset) {
            metaTag.setAttribute(meta.keyword, meta.charset);
        } else {
            metaTag.setAttribute(meta.keyword, meta[meta.keyword]);
            metaTag.setAttribute("content", meta.content);
        }

        document.head.appendChild(metaTag);
    }
};

var createDispatcher = function createDispatcher() {
    var lang;
    var linkQueue = [];
    var scriptQueue = [];
    var titleQueue = [];
    var titleTemplateQueue = [];
    var metaQueue = [];
    var currentTitleIndex = 0;
    var currentTitleTemplateIndex = 0;
    var currentMetaIndex = 0;

    var processQueue = (function () {
        var timeout;
        return function () {
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                timeout = null;
                var visited = new Set();
                document.title = applyTitleTemplate(
                    titleQueue[0],
                    titleTemplateQueue[0]
                );
                metaQueue.forEach(function (meta) {
                    if (
                        !visited.has(
                            meta.charset ? meta.keyword : meta[meta.keyword]
                        )
                    ) {
                        visited.add(
                            meta.charset ? meta.keyword : meta[meta.keyword]
                        );
                        changeOrCreateMetaTag(meta);
                    }
                });
                currentTitleIndex =
                    currentTitleTemplateIndex =
                    currentMetaIndex =
                        0;
            }, 1000 / 60);
        };
    })();

    return {
        _setLang: function _setLang(l) {
            lang = l;
        },
        _addToQueue: function _addToQueue(type, payload) {
            if (!isServerSide) processQueue();

            if (type === SCRIPT) {
                scriptQueue.push(payload);
            } else if (type === TITLE) {
                titleQueue.splice(currentTitleIndex++, 0, payload);
            } else if (type === TEMPLATE) {
                titleTemplateQueue.splice(
                    currentTitleTemplateIndex++,
                    0,
                    payload
                );
            } else if (type === META) {
                metaQueue.splice(currentMetaIndex++, 0, payload);
            } else {
                linkQueue.push(payload);
            }
        },
        _removeFromQueue: function _removeFromQueue(type, payload) {
            if (type === TITLE || type === TEMPLATE) {
                var queue = type === TEMPLATE ? titleTemplateQueue : titleQueue;
                var index = queue.indexOf(payload);
                queue.splice(index, 1);
                if (index === 0)
                    document.title = applyTitleTemplate(
                        titleQueue[0] || "",
                        titleTemplateQueue[0]
                    );
            } else {
                var oldMeta = metaQueue[metaQueue.indexOf(payload)];

                if (oldMeta) {
                    metaQueue.splice(metaQueue.indexOf(payload), 1);
                    var newMeta = metaQueue.find(function (m) {
                        return (
                            m.keyword === oldMeta.keyword &&
                            (m.charset || m[m.keyword] === oldMeta[m.keyword])
                        );
                    });

                    if (newMeta) {
                        changeOrCreateMetaTag(newMeta);
                    } else {
                        var result = document.head.querySelectorAll(
                            oldMeta.charset
                                ? "meta[" + oldMeta.keyword + "]"
                                : "meta[" +
                                      oldMeta.keyword +
                                      '="' +
                                      oldMeta[oldMeta.keyword] +
                                      '"]'
                        );
                        document.head.removeChild(result[0]);
                    }
                }
            }
        },
        _change: function _change(type, prevPayload, payload) {
            if (type === TITLE || type === TEMPLATE) {
                var queue = type === TEMPLATE ? titleTemplateQueue : titleQueue;
                queue[queue.indexOf(prevPayload)] = payload;

                if (queue.indexOf(payload) === 0) {
                    document.title = applyTitleTemplate(
                        queue[queue.indexOf(payload)],
                        titleTemplateQueue[0]
                    );
                }
            } else {
                changeOrCreateMetaTag(
                    (metaQueue[metaQueue.indexOf(prevPayload)] = payload)
                );
            }
        },
        _reset: undefined,
        toStatic: function toStatic() {
            var title = applyTitleTemplate(
                titleQueue[titleQueue.length - 1],
                titleTemplateQueue[titleTemplateQueue.length - 1]
            );
            var visited = new Set();
            var links = [].concat(linkQueue);
            var scripts = [].concat(scriptQueue);
            metaQueue.reverse();
            var metas = [].concat(metaQueue).filter(function (meta) {
                if (
                    !visited.has(
                        meta.charset ? meta.keyword : meta[meta.keyword]
                    )
                ) {
                    visited.add(
                        meta.charset ? meta.keyword : meta[meta.keyword]
                    );
                    return true;
                }
            });
            titleQueue = [];
            titleTemplateQueue = [];
            metaQueue = [];
            linkQueue = [];
            scriptQueue = [];
            currentTitleIndex =
                currentTitleTemplateIndex =
                currentMetaIndex =
                    0;
            return {
                lang: lang,
                title: title,
                links: links,
                scripts: scripts,
                metas: metas.map(function (meta) {
                    var _ref;

                    return meta.keyword === "charset"
                        ? {
                              charset: meta[meta.keyword],
                          }
                        : ((_ref = {}),
                          (_ref[meta.keyword] = meta[meta.keyword]),
                          (_ref.content = meta.content),
                          _ref);
                }),
            };
        },
    };
};
var defaultDispatcher = createDispatcher();
var DispatcherContext = D(defaultDispatcher);

var useLang = function useLang(language) {
    var dispatcher = F(DispatcherContext);

    if (isServerSide) {
        dispatcher._setLang(language);
    }

    y(
        function () {
            document
                .getElementsByTagName("html")[0]
                .setAttribute("lang", language);
        },
        [language]
    );
};

var useLink = function useLink(options) {
    var dispatcher = F(DispatcherContext);
    var hasMounted = s(false);
    var node = s();
    var originalOptions = s();

    if (isServerSide && !hasMounted.current) {
        dispatcher._addToQueue(LINK, options);
    }

    y(
        function () {
            if (hasMounted.current) {
                Object.keys(options).forEach(function (key) {
                    node.current.setAttribute(key, options[key]);
                });
            }
        },
        [
            options.href,
            options.media,
            options.as,
            options.rel,
            options.crossorigin,
            options.type,
            options.hreflang,
        ]
    );
    y(function () {
        hasMounted.current = true;
        var preExistingElements = document.querySelectorAll(
            'link[rel="' + options.rel + '"]'
        );
        preExistingElements.forEach(function (x) {
            var found = true;
            Object.keys(options).forEach(function (key) {
                if (x.getAttribute(key) !== options[key]) {
                    found = false;
                }
            });

            if (found) {
                node.current = x;
            }
        });

        if (node.current) {
            originalOptions.current = Object.keys(options).reduce(function (
                acc,
                key
            ) {
                acc[key] = node.current.getAttribute(key);
                return acc;
            },
            {});
        } else {
            node.current = document.createElement("link");
            Object.keys(options).forEach(function (key) {
                node.current.setAttribute(key, options[key]);
            });
            document.head.appendChild(node.current);
        }

        return function () {
            hasMounted.current = false;

            if (originalOptions.current) {
                Object.keys(originalOptions.current).forEach(function (key) {
                    node.current.setAttribute(
                        key,
                        originalOptions.current[key]
                    );
                });
            } else {
                document.head.removeChild(node.current);
            }
        };
    }, []);
};

function extractKeyword(meta) {
    return meta.charset
        ? "charset"
        : meta.name
        ? "name"
        : meta.property
        ? "property"
        : "http-equiv";
}

var useMeta = function useMeta(options) {
    var dispatcher = F(DispatcherContext);
    var hasMounted = s(false);
    var keyword = s();
    var metaObject = s({
        keyword: (keyword.current = extractKeyword(options)),
        name: options.name,
        charset: options.charset,
        "http-equiv": options.httpEquiv,
        property: options.property,
        content: options.content,
    });

    if (isServerSide && !hasMounted.current) {
        dispatcher._addToQueue(META, metaObject.current);
    }

    y(
        function () {
            if (hasMounted.current) {
                dispatcher._change(
                    META,
                    metaObject.current,
                    (metaObject.current = {
                        keyword: keyword.current,
                        name: options.name,
                        charset: options.charset,
                        "http-equiv": options.httpEquiv,
                        property: options.property,
                        content: options.content,
                    })
                );
            }
        },
        [options.content]
    );
    y(function () {
        dispatcher._addToQueue(META, metaObject.current);

        hasMounted.current = true;
        return function () {
            hasMounted.current = false;

            dispatcher._removeFromQueue(META, metaObject.current);
        };
    }, []);
};

var useTitle = function useTitle(title, template) {
    var dispatcher = F(DispatcherContext);
    var hasMounted = s(false);
    var prevTitle = s();

    if (isServerSide && !hasMounted.current) {
        dispatcher._addToQueue(template ? TEMPLATE : TITLE, title);
    }

    y(
        function () {
            if (hasMounted.current) {
                dispatcher._change(
                    template ? TEMPLATE : TITLE,
                    prevTitle.current,
                    (prevTitle.current = title)
                );
            }
        },
        [title, template]
    );
    y(
        function () {
            hasMounted.current = true;

            dispatcher._addToQueue(
                template ? TEMPLATE : TITLE,
                (prevTitle.current = title)
            );

            return function () {
                hasMounted.current = false;

                dispatcher._removeFromQueue(
                    template ? TEMPLATE : TITLE,
                    prevTitle.current
                );
            };
        },
        [template]
    );
};

var useTitleTemplate = function useTitleTemplate(template) {
    useTitle(template, true);
};

var toStatic = defaultDispatcher.toStatic;
export {
    useTitleTemplate as a,
    useTitle as b,
    useMeta as c,
    useLink as d,
    toStatic as t,
    useLang as u,
};
