import r from "@swc/helpers/src/_async_to_generator.mjs";
import t from "@swc/helpers/src/_sliced_to_array.mjs";
import e from "@swc/helpers/src/_ts_generator.mjs";
import { jsx as n, jsxs as s, Fragment as a } from "react/jsx-runtime";
import * as c from "react";
export default function i() {
    var i = t(c.useState({
        hits: []
    }), 2), o = i[0], u = i[1], l = t(c.useState("react"), 2), h = l[0], f = l[1];
    return c.useEffect(function() {
        "" !== h && function() {
            t.apply(this, arguments);
        }();
        function t() {
            return (t = r(function() {
                var r, t;
                return e(this, function(e) {
                    switch(e.label){
                        case 0:
                            return [
                                4,
                                fetch("https://hn.algolia.com/api/v1/search?query=" + h)
                            ];
                        case 1:
                            return [
                                4,
                                (r = e.sent()).json()
                            ];
                        case 2:
                            return u(t = e.sent()), [
                                2
                            ];
                    }
                });
            })).apply(this, arguments);
        }
    }, [
        h
    ]), s(a, {
        children: [
            n("input", {
                value: h,
                onChange: function(r) {
                    return f(r.target.value);
                }
            }),
            n("ul", {
                children: o.hits.map(function(r) {
                    return n("li", {
                        children: n("a", {
                            href: r.url,
                            children: r.title
                        })
                    }, r.objectID);
                })
            })
        ]
    });
};
