import { _ as t } from "@swc/helpers/_/_async_to_generator";
import { _ as e } from "@swc/helpers/_/_sliced_to_array";
import { _ as r } from "@swc/helpers/_/_ts_generator";
import { jsx as n, jsxs as s, Fragment as a } from "react/jsx-runtime";
import * as i from "react";
export default function c() {
    var c = e(i.useState({
        hits: []
    }), 2), l = c[0], h = c[1], o = e(i.useState("react"), 2), u = o[0], f = o[1];
    return i.useEffect(function() {
        function e() {
            return (e = t(function() {
                return r(this, function(t) {
                    switch(t.label){
                        case 0:
                            return [
                                4,
                                fetch("https://hn.algolia.com/api/v1/search?query=" + u)
                            ];
                        case 1:
                            return [
                                4,
                                t.sent().json()
                            ];
                        case 2:
                            return h(t.sent()), [
                                2
                            ];
                    }
                });
            })).apply(this, arguments);
        }
        "" !== u && function() {
            e.apply(this, arguments);
        }();
    }, [
        u
    ]), s(a, {
        children: [
            n("input", {
                value: u,
                onChange: function(t) {
                    return f(t.target.value);
                }
            }),
            n("ul", {
                children: l.hits.map(function(t) {
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
}
