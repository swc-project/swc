import { jsx as r, Fragment as t } from "react/jsx-runtime";
import { useRouter as a } from "next/router";
import { useProject as e } from "@swr/use-project";
import o from "@swr/use-team";
export default function m() {
    var m = a().query, u = m.project;
    var i = e(u), s = i.data;
    var n = o(), p = n.teamSlug;
    var v = s === null || s === void 0 ? void 0 : s.id;
    var d = useProjectBranches(v), f = d.data;
    return r(t, {});
};
