import a from "@swc/helpers/lib/_async_to_generator.js";
import b from "@swc/helpers/lib/_sliced_to_array.js";
import c from "regenerator-runtime";
import { jsx as d, jsxs as e, Fragment as f } from "react/jsx-runtime";
import * as g from "react";
export default function h() {
    var h = b(g.useState({
        hits: []
    }), 2), k = h[0], l = h[1], i = b(g.useState("react"), 2), j = i[0], m = i[1];
    return g.useEffect(function() {
        "" !== j && function() {
            b.apply(this, arguments);
        }();
        function b() {
            return (b = a(c.mark(function a() {
                var b, d;
                return c.wrap(function(a) {
                    for(;;)switch(a.prev = a.next){
                        case 0:
                            return a.next = 2, fetch("https://hn.algolia.com/api/v1/search?query=" + j);
                        case 2:
                            return b = a.sent, a.next = 5, b.json();
                        case 5:
                            l(d = a.sent);
                        case 7:
                        case "end":
                            return a.stop();
                    }
                }, a);
            }))).apply(this, arguments);
        }
    }, [
        j
    ]), e(f, {
        children: [
            d("input", {
                value: j,
                onChange: function(a) {
                    return m(a.target.value);
                }
            }),
            d("ul", {
                children: k.hits.map(function(a) {
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
