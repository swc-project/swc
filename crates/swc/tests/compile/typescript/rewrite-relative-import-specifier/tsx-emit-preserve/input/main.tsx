import { Badge } from "./Badge.tsx";
import { Legacy } from "./Legacy.jsx";
import { util } from "./util.ts";

import("./Badge.tsx");
import("" + "./Badge.tsx");

export function App() {
    return (
        <Badge>
            <Legacy label={util()} />
        </Badge>
    );
}
