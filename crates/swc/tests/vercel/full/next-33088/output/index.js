import * as a from "@swc/helpers";
import b from "regenerator-runtime";
import { jsx as c, jsxs as d, Fragment as e } from "react/jsx-runtime";
import * as f from "react";
export default function g() {
    var g = a.slicedToArray(f.useState({
        hits: []
    }), 2), j = g[0], k = g[1], h = a.slicedToArray(f.useState("react"), 2), i = h[0], l = h[1];
    return f.useEffect(function() {
        "" !== i && function() {
            c.apply(this, arguments);
        }();
        function c() {
            return (c = a.asyncToGenerator(b.mark(function a() {
                var c, d;
                return b.wrap(function(a) {
                    for(;;)switch(a.prev = a.next){
                        case 0:
                            return a.next = 2, fetch("https://hn.algolia.com/api/v1/search?query=" + i);
                        case 2:
                            return c = a.sent, a.next = 5, c.json();
                        case 5:
                            k(d = a.sent);
                        case 7:
                        case "end":
                            return a.stop();
                    }
                }, a);
            }))).apply(this, arguments);
        }
    }, [
        i
    ]), d(e, {
        children: [
            c("input", {
                value: i,
                onChange: function(a) {
                    return l(a.target.value);
                }
            }),
            c("ul", {
                children: j.hits.map(function(a) {
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
