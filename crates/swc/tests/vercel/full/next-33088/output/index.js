import t from "@swc/helpers/src/_async_to_generator.mjs";
import r from "@swc/helpers/src/_sliced_to_array.mjs";
import e from "regenerator-runtime";
import { jsx as n, jsxs as a, Fragment as o } from "react/jsx-runtime";
import * as s from "react";
export default function i() {
    var i = r(s.useState({
        hits: []
    }), 2), u = i[0], c = i[1], f = r(s.useState("react"), 2), p = f[0], m = f[1];
    return s.useEffect(function() {
        "" !== p && function() {
            r.apply(this, arguments);
        }();
        function r() {
            return (r = t(e.mark(function t() {
                var r, n;
                return e.wrap(function(t) {
                    for(;;)switch(t.prev = t.next){
                        case 0:
                            return t.next = 2, fetch("https://hn.algolia.com/api/v1/search?query=" + p);
                        case 2:
                            return r = t.sent, t.next = 5, r.json();
                        case 5:
                            c(n = t.sent);
                        case 7:
                        case "end":
                            return t.stop();
                    }
                }, t);
            }))).apply(this, arguments);
        }
    }, [
        p
    ]), a(o, {
        children: [
            n("input", {
                value: p,
                onChange: function(t) {
                    return m(t.target.value);
                }
            }),
            n("ul", {
                children: u.hits.map(function(t) {
                    return n("li", {
                        children: n("a", {
                            href: t.url,
                            children: t.title
                        })
                    }, t.objectID);
                })
            })
        ]
    });
};
