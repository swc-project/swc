export var CSL = {};
/*
 * String parser for XML inputs
 */ CSL.parseXml = function(str) {
    var _obj_children = [], _stack = [
        _obj_children
    ];
    function _decodeHtmlEntities(str) {
        return str.split("&amp;").join("&").split("&quot;").join("\"").split("&gt;").join(">").split("&lt;").join("<").replace(/&#([0-9]{1,6});/gi, function(match, numStr) {
            return String.fromCharCode(parseInt(numStr, 10));
        }).replace(/&#x([a-f0-9]{1,6});/gi, function(match, numStr) {
            return String.fromCharCode(parseInt(numStr, 16));
        });
    }
    function _getTagName(elem) {
        var rex = RegExp("^<([^	 />]+)"), m = elem.match(rex);
        return m ? m[1] : null;
    }
    function _castObjectFromOpeningTag(elem) {
        var obj = {};
        obj.name = _getTagName(elem), obj.attrs = {};
        var attributes = function(elem) {
            var m = elem.match(/([^\'\"=	 ]+)=(?:\"[^\"]*\"|\'[^\']*\')/g);
            if (m) for(var i = 0, ilen = m.length; i < ilen; i++)m[i] = m[i].replace(/=.*/, "");
            return m;
        }(elem);
        if (attributes) for(var i = 0, ilen = attributes.length; i < ilen; i++){
            var attr = {
                name: attributes[i],
                value: function(elem, attr) {
                    var rex = RegExp('^.*[	 ]+' + attr + '=(\"(?:[^\"]*)\"|\'(?:[^\']*)\').*$'), m = elem.match(rex);
                    return m ? m[1].slice(1, -1) : null;
                }(elem, attributes[i])
            };
            obj.attrs[attr.name] = _decodeHtmlEntities(attr.value);
        }
        return obj.children = [], obj;
    }
    function _appendToChildren(obj) {
        _stack.slice(-1)[0].push(obj);
    }
    for(var lst = function(str) {
        for(var lst = (str = str.split(/(?:\r\n|\n|\r)/).join(" ").replace(/>[	 ]+</g, "><").replace(/<\!--.*?-->/g, "")).split("><"), stylePos = null, i = 0, ilen = lst.length; i < ilen; i++)i > 0 && (lst[i] = "<" + lst[i]), i < lst.length - 1 && (lst[i] = lst[i] + ">"), "number" != typeof stylePos && ("<style " === lst[i].slice(0, 7) || "<locale " == lst[i].slice(0, 8)) && (stylePos = i);
        lst = lst.slice(stylePos);
        // Combine open/close elements for empty terms,
        // so that they will be passed through correctly
        // as empty strings.
        for(var i = lst.length - 2; i > -1; i--)if (-1 === lst[i].slice(1).indexOf("<")) {
            var stub = lst[i].slice(0, 5);
            "/>" !== lst[i].slice(-2) && ("<term" === stub ? "</term" === lst[i + 1].slice(0, 6) && (lst[i] = lst[i] + lst[i + 1], lst = lst.slice(0, i + 1).concat(lst.slice(i + 2))) : [
                "<sing",
                "<mult"
            ].indexOf(stub) > -1 && "/>" !== lst[i].slice(-2) && "<" === lst[i + 1].slice(0, 1) && (lst[i] = lst[i] + lst[i + 1], lst = lst.slice(0, i + 1).concat(lst.slice(i + 2))));
        }
        return lst;
    }(str), i = 0, ilen = lst.length; i < ilen; i++)!function(elem) {
        var obj, obj1;
        elem.slice(1).indexOf('<') > -1 ? ((obj = _castObjectFromOpeningTag(elem.slice(0, elem.indexOf('>') + 1))).children = [
            _decodeHtmlEntities(elem.match(/^.*>([^<]*)<.*$/)[1])
        ], _appendToChildren(obj)) : '/>' === elem.slice(-2) ? (// singleton
        obj = _castObjectFromOpeningTag(elem), 'term' === _getTagName(elem) && obj.children.push(''), _appendToChildren(obj)) : '</' === elem.slice(0, 2) ? // close
        _stack.pop() : (_appendToChildren(// open
        obj = _castObjectFromOpeningTag(elem)), obj1 = obj, _stack.push(obj1.children));
    }(lst[i]);
    return _obj_children[0];
};
