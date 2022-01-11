import * as a from "@swc/helpers";
import b from "regenerator-runtime";
import { jsx as c, jsxs as d, Fragment as e } from "react/jsx-runtime";
import * as f from "react";
export default function g() {
    var g = a.slicedToArray(f.useState({
        hits: []
    }), 2), h = g[0], i = g[1], j = a.slicedToArray(f.useState("react"), 2), k = j[0], l = j[1];
    return f.useEffect(function() {
        function c() {
            return (c = a.asyncToGenerator(b.mark(function a() {
                var c, d;
                return b.wrap(function(a) {
                    for(;;)switch(a.prev = a.next){
                        case 0:
                            return a.next = 2, fetch("https://hn.algolia.com/api/v1/search?query=" + k);
                        case 2:
                            return c = a.sent, a.next = 5, c.json();
                        case 5:
                            i(d = a.sent);
                        case 7:
                        case "end":
                            return a.stop();
                    }
                }, a);
            }))).apply(this, arguments);
        }
        "" !== k && (function() {
            return c.apply(this, arguments);
        })();
    }, [
        k
    ]), d(e, {
        children: [
            c("input", {
                value: k,
                onChange: function(a) {
                    return l(a.target.value);
                }
            }),
            c("ul", {
                children: h.hits.map(function(a) {
                    return c("li", {
                        children: c("a", {
                            href: a.url,
                            children: a.title
                        })
                    }, a.objectID);
                })
            })
        ]
    });
};
