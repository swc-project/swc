import { _ as e } from "@swc/helpers/_/_async_to_generator";
import { _ as t } from "@swc/helpers/_/_sliced_to_array";
import { _ as r } from "@swc/helpers/_/_ts_generator";
import { jsx as n, jsxs as s, Fragment as a } from "react/jsx-runtime";
import * as c from "react";
export default function i() {
    var i = t(c.useState({
        hits: []
    }), 2), o = i[0], u = i[1], l = t(c.useState("react"), 2), _ = l[0], h = l[1];
    return c.useEffect(function() {
        "" !== _ && /*#__PURE__*/ e(function() {
            return r(this, function(e) {
                switch(e.label){
                    case 0:
                        return [
                            4,
                            fetch("https://hn.algolia.com/api/v1/search?query=" + _)
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
        _
    ]), s(a, {
        children: [
            n("input", {
                value: _,
                onChange: function(e) {
                    return h(e.target.value);
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
