import { jsx as a, Fragment as b } from "react/jsx-runtime";
import { useRouter as c } from "next/router";
import { useProject as d } from "@swr/use-project";
import e from "@swr/use-team";
export default function f() {
    var f = c().query, g = f.project;
    var h = d(g), i = h.data;
    var j = e(), k = j.teamSlug;
    var l = i === null || i === void 0 ? void 0 : i.id;
    var m = useProjectBranches(l), n = m.data;
    return a(b, {});
};
