import t from "@swc/helpers/src/_async_to_generator.mjs";
import r from "@swc/helpers/src/_sliced_to_array.mjs";
import e from "@swc/helpers/src/_ts_generator.mjs";
import { jsx as n, jsxs as i, Fragment as u } from "react/jsx-runtime";
import * as o from "react";
export default function s() {
    var s = r(o.useState({
        hits: []
    }), 2), a = s[0], c = s[1], f = r(o.useState("react"), 2), l = f[0], h = f[1];
    return o.useEffect(function() {
        "" !== l && function() {
            r.apply(this, arguments);
        }();
        function r() {
            return (r = t(function() {
                var t, r;
                return e(this, function(e) {
                    switch(e.label){
                        case 0:
                            return [
                                4,
                                fetch("https://hn.algolia.com/api/v1/search?query=" + l)
                            ];
                        case 1:
                            return [
                                4,
                                (t = e.sent()).json()
                            ];
                        case 2:
                            return c(r = e.sent()), [
                                2
                            ];
                    }
                });
            })).apply(this, arguments);
        }
    }, [
        l
    ]), i(u, {
        children: [
            n("input", {
                value: l,
                onChange: function(t) {
                    return h(t.target.value);
                }
            }),
            n("ul", {
                children: a.hits.map(function(t) {
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
