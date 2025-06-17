import { _ as e } from "@swc/helpers/_/_async_to_generator";
import { _ as t } from "@swc/helpers/_/_sliced_to_array";
import { _ as r } from "@swc/helpers/_/_ts_generator";
import { jsx as n, jsxs as s, Fragment as a } from "react/jsx-runtime";
import * as _ from "react";
export default function c() {
    var c = t(_.useState({
        hits: []
    }), 2), i = c[0], o = c[1], u = t(_.useState("react"), 2), l = u[0], h = u[1];
    return _.useEffect(function() {
        "" !== l && e(function() {
            return r(this, function(e) {
                switch(e.label){
                    case 0:
                        return [
                            4,
                            fetch("https://hn.algolia.com/api/v1/search?query=" + l)
                        ];
                    case 1:
                        return [
                            4,
                            e.sent().json()
                        ];
                    case 2:
                        return o(e.sent()), [
                            2
                        ];
                }
            });
        })();
    }, [
        l
    ]), /*#__PURE__*/ s(a, {
        children: [
            /*#__PURE__*/ n("input", {
                value: l,
                onChange: function(e) {
                    return h(e.target.value);
                }
            }),
            /*#__PURE__*/ n("ul", {
                children: i.hits.map(function(e) {
                    return /*#__PURE__*/ n("li", {
                        children: /*#__PURE__*/ n("a", {
                            href: e.url,
                            children: e.title
                        })
                    }, e.objectID);
                })
            })
        ]
    });
}
