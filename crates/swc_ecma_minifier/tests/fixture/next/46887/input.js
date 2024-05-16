
export var CSL = {};

/*
 * String parser for XML inputs
 */
CSL.parseXml = function (str) {

    var _pos = 0;
    var _obj = { children: [] };
    var _stack = [_obj.children];

    function _listifyString(str) {
        str = str.split(/(?:\r\n|\n|\r)/).join(" ").replace(/>[	 ]+</g, "><").replace(/<\!--.*?-->/g, "");
        var lst = str.split("><");
        var stylePos = null;
        for (var i = 0, ilen = lst.length; i < ilen; i++) {
            if (i > 0) {
                lst[i] = "<" + lst[i];
            }
            if (i < (lst.length - 1)) {
                lst[i] = lst[i] + ">";
            }
            if ("number" != typeof stylePos) {
                if (lst[i].slice(0, 7) === "<style " || lst[i].slice(0, 8) == "<locale ") {
                    stylePos = i;
                }
            }
        }
        lst = lst.slice(stylePos);
        // Combine open/close elements for empty terms,
        // so that they will be passed through correctly
        // as empty strings.
        for (var i = lst.length - 2; i > -1; i--) {
            if (lst[i].slice(1).indexOf("<") === -1) {
                var stub = lst[i].slice(0, 5);
                if (lst[i].slice(-2) !== "/>") {
                    if (stub === "<term") {
                        if (lst[i + 1].slice(0, 6) === "</term") {
                            lst[i] = lst[i] + lst[i + 1];
                            lst = lst.slice(0, i + 1).concat(lst.slice(i + 2));
                        }
                    } else if (["<sing", "<mult"].indexOf(stub) > -1) {
                        if (lst[i].slice(-2) !== "/>" && lst[i + 1].slice(0, 1) === "<") {
                            lst[i] = lst[i] + lst[i + 1];
                            lst = lst.slice(0, i + 1).concat(lst.slice(i + 2));
                        }
                    }
                }
            }
        }
        return lst;
    }

    function _decodeHtmlEntities(str) {
        return str
            .split("&amp;").join("&")
            .split("&quot;").join("\"")
            .split("&gt;").join(">").split("&lt;").join("<")
            .replace(/&#([0-9]{1,6});/gi, function (match, numStr) {
                var num = parseInt(numStr, 10); // read num as normal number
                return String.fromCharCode(num);
            })
            .replace(/&#x([a-f0-9]{1,6});/gi, function (match, numStr) {
                var num = parseInt(numStr, 16); // read num as hex
                return String.fromCharCode(num);
            });
    }

    function _getAttributes(elem) {
        var m = elem.match(/([^\'\"=	 ]+)=(?:\"[^\"]*\"|\'[^\']*\')/g);
        if (m) {
            for (var i = 0, ilen = m.length; i < ilen; i++) {
                m[i] = m[i].replace(/=.*/, "");
            }
        }
        return m;
    }

    function _getAttribute(elem, attr) {
        var rex = RegExp('^.*[	 ]+' + attr + '=(\"(?:[^\"]*)\"|\'(?:[^\']*)\').*$');
        var m = elem.match(rex);
        return m ? m[1].slice(1, -1) : null;
    }

    function _getTagName(elem) {
        var rex = RegExp("^<([^	 />]+)");
        var m = elem.match(rex);
        return m ? m[1] : null;
    }


    function _castObjectFromOpeningTag(elem) {
        var obj = {};
        obj.name = _getTagName(elem);
        obj.attrs = {};
        var attributes = _getAttributes(elem);
        if (attributes) {
            for (var i = 0, ilen = attributes.length; i < ilen; i++) {
                var attr = {
                    name: attributes[i],
                    value: _getAttribute(elem, attributes[i])
                }
                obj.attrs[attr.name] = _decodeHtmlEntities(attr.value);
            }
        }
        obj.children = [];
        return obj;
    }

    function _extractTextFromCompositeElement(elem) {
        var m = elem.match(/^.*>([^<]*)<.*$/);
        return _decodeHtmlEntities(m[1]);
    }

    function _appendToChildren(obj) {
        _stack.slice(-1)[0].push(obj);
    }

    function _extendStackWithNewChildren(obj) {
        _stack.push(obj.children);
    }

    function processElement(elem) {
        var obj;
        if (elem.slice(1).indexOf('<') > -1) {
            // withtext
            var tag = elem.slice(0, elem.indexOf('>') + 1);
            obj = _castObjectFromOpeningTag(tag);
            obj.children = [_extractTextFromCompositeElement(elem)];
            _appendToChildren(obj);
        } else if (elem.slice(-2) === '/>') {
            // singleton
            obj = _castObjectFromOpeningTag(elem);
            // Empty term as singleton
            if (_getTagName(elem) === 'term') {
                obj.children.push('');
            }
            _appendToChildren(obj);
        } else if (elem.slice(0, 2) === '</') {
            // close
            _stack.pop();
        } else {
            // open
            obj = _castObjectFromOpeningTag(elem);
            _appendToChildren(obj)
            _extendStackWithNewChildren(obj);
        }
    }

    var lst = _listifyString(str);

    for (var i = 0, ilen = lst.length; i < ilen; i++) {
        var elem = lst[i];
        processElement(elem);
    }
    return _obj.children[0];
}
