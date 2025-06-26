import { _ as e } from "@swc/helpers/_/_async_to_generator";
import { _ as t } from "@swc/helpers/_/_sliced_to_array";
import { _ as r } from "@swc/helpers/_/_ts_generator";
import { jsx as n, jsxs as s, Fragment as a } from "react/jsx-runtime";
import * as c from "react";
export default function i() {
    var i = t(c.useState({
        hits: []
    }), 2), o = i[0], u = i[1], l = t(c.useState("react"), 2), h = l[0], f = l[1];
    return c.useEffect(function() {
        "" !== h && e(function() {
            return r(this, function(e) {
                switch(e.label){
                    case 0:
                        return [
                            4,
                            fetch("https://hn.algolia.com/api/v1/search?query=" + h)
                        ];
                    case 1:
                        return [
                            4,
                            e.sent().json()
                        ];
                    case 2:
                        return u(e.sent()), [
                            2
                        ];
                }
            });
        })();
    }, [
        h
    ]), s(a, {
        children: [
            n("input", {
                value: h,
                onChange: function(e) {
                    return f(e.target.value);
                }
            }),
            n("ul", {
                children: o.hits.map(function(e) {
                    return n("li", {
                        children: n("a", {
                            href: e.url,
                            children: e.title
                        })
                    }, e.objectID);
                })
            })
        ]
    });
}
