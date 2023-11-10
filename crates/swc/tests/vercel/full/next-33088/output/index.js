import { _ as t } from "@swc/helpers/_/_async_to_generator";
import { _ as e } from "@swc/helpers/_/_sliced_to_array";
import { _ as r } from "@swc/helpers/_/_ts_generator";
import { jsx as n, jsxs as s, Fragment as a } from "react/jsx-runtime";
import * as i from "react";
export default function c() {
    var c = e(i.useState({
        hits: []
    }), 2), o = c[0], u = c[1], l = e(i.useState("react"), 2), h = l[0], f = l[1];
    return i.useEffect(function() {
        function e() {
            return (e = t(function() {
                return r(this, function(t) {
                    switch(t.label){
                        case 0:
                            return [
                                4,
                                fetch("https://hn.algolia.com/api/v1/search?query=" + h)
                            ];
                        case 1:
                            return [
                                4,
                                t.sent().json()
                            ];
                        case 2:
                            return u(t.sent()), [
                                2
                            ];
                    }
                });
            })).apply(this, arguments);
        }
        "" !== h && function() {
            e.apply(this, arguments);
        }();
    }, [
        h
    ]), s(a, {
        children: [
            n("input", {
                value: h,
                onChange: function(t) {
                    return f(t.target.value);
                }
            }),
            n("ul", {
                children: o.hits.map(function(t) {
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
