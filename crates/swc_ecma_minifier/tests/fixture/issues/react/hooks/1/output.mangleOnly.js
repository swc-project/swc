import { jsx as a, Fragment as b } from "react/jsx-runtime";
import { useRouter as c } from "next/router";
import { useProject as d } from "@swr/use-project";
import e from "@swr/use-team";
export default function f() {
    var g = c().query, h = g.project;
    var i = d(h), f = i.data;
    var j = e(), m = j.teamSlug;
    var k = f === null || f === void 0 ? void 0 : f.id;
    var l = useProjectBranches(k), n = l.data;
    return a(b, {});
};
