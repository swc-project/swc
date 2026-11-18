import { _ as _ts_rewrite_relative_import_extension } from "@swc/helpers/_/_ts_rewrite_relative_import_extension";
import { Badge } from "./Badge.jsx";
import { Legacy } from "./Legacy.jsx";
import { util } from "./util.js";
import("./Badge.jsx");
import(_ts_rewrite_relative_import_extension("" + "./Badge.tsx", true));
export function App() {
    return <Badge>
            <Legacy label={util()}/>
        </Badge>;
}
