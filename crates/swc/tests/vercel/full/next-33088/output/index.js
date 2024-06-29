import { _ as r } from "@swc/helpers/_/_async_to_generator";
import { _ as t } from "@swc/helpers/_/_sliced_to_array";
import { _ as e } from "@swc/helpers/_/_ts_generator";
import { jsx as s } from "react/jsx-runtime";
import { jsxs as a } from "react/jsx-runtime";
import { Fragment as n } from "react/jsx-runtime";
import * as o from "react";
export default function i() {
    var i = t(o.useState({
        hits: []
    }), 2), c = i[0], u = i[1], p = t(o.useState("react"), 2), l = p[0], m = p[1];
    return o.useEffect(function() {
        function t() {
            return (t = r(function() {
                return e(this, function(r) {
                    switch(r.label){
                        case 0:
                            return [
                                4,
                                fetch("https://hn.algolia.com/api/v1/search?query=" + l)
                            ];
                        case 1:
                            return [
                                4,
                                r.sent().json()
                            ];
                        case 2:
                            return u(r.sent()), [
                                2
                            ];
                    }
                });
            })).apply(this, arguments);
        }
        "" !== l && function() {
            t.apply(this, arguments);
        }();
    }, [
        l
    ]), a(n, {
        children: [
            s("input", {
                value: l,
                onChange: function(r) {
                    return m(r.target.value);
                }
            }),
            s("ul", {
                children: c.hits.map(function(r) {
                    return s("li", {
                        children: s("a", {
                            href: r.url,
                            children: r.title
                        })
                    }, r.objectID);
                })
            })
        ]
    });
}
import "@swc/helpers/_/_async_to_generator";
import "@swc/helpers/_/_sliced_to_array";
import "@swc/helpers/_/_ts_generator";
import "react/jsx-runtime";
import "react";
export { i as default };
