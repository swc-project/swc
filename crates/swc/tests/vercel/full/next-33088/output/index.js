import a from "@swc/helpers/src/_async_to_generator.mjs";
import b from "@swc/helpers/src/_sliced_to_array.mjs";
import c from "regenerator-runtime";
import { jsx as d, jsxs as e, Fragment as f } from "react/jsx-runtime";
import * as g from "react";
export default function h() {
    var h = b(g.useState({
        hits: []
    }), 2), i = h[0], j = h[1], k = b(g.useState("react"), 2), l = k[0], m = k[1];
    return g.useEffect(function() {
        "" !== l && function() {
            b.apply(this, arguments);
        }();
        function b() {
            return (b = a(c.mark(function a() {
                var b, d;
                return c.wrap(function(a) {
                    for(;;)switch(a.prev = a.next){
                        case 0:
                            return a.next = 2, fetch("https://hn.algolia.com/api/v1/search?query=" + l);
                        case 2:
                            return b = a.sent, a.next = 5, b.json();
                        case 5:
                            j(d = a.sent);
                        case 7:
                        case "end":
                            return a.stop();
                    }
                }, a);
            }))).apply(this, arguments);
        }
    }, [
        l
    ]), e(f, {
        children: [
            d("input", {
                value: l,
                onChange: function(a) {
                    return m(a.target.value);
                }
            }),
            d("ul", {
                children: i.hits.map(function(a) {
                    return d("li", {
                        children: d("a", {
                            href: a.url,
                            children: a.title
                        })
                    }, a.objectID);
                })
            })
        ]
    });
};
