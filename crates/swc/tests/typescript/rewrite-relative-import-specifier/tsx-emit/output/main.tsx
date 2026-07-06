import { _ as _ts_rewrite_relative_import_extension } from "@swc/helpers/_/_ts_rewrite_relative_import_extension";
import { jsx as _jsx } from "react/jsx-runtime";
import { Badge } from "./Badge.js";
import { Legacy } from "./Legacy.js";
import { util } from "./util.js";
import("./Badge.js");
import(_ts_rewrite_relative_import_extension("" + "./Badge.tsx"));
export function App() {
    return /*#__PURE__*/ _jsx(Badge, {
        children: /*#__PURE__*/ _jsx(Legacy, {
            label: util()
        })
    });
}
