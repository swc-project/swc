import { jsx as r, Fragment as a } from "react/jsx-runtime";
import { useRouter as o } from "next/router";
import { useProject as t } from "@swr/use-project";
import m from "@swr/use-team";
export default function i() {
    var i = o().query, e = i.project;
    var v = t(e), d = v.data;
    var f = m(), p = f.teamSlug;
    var u = d === null || d === void 0 ? void 0 : d.id;
    var n = useProjectBranches(u), l = n.data;
    return r(a, {});
};
