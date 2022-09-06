import { jsx as r, Fragment as t } from "react/jsx-runtime";
import { useRouter as e } from "next/router";
import { useProject as a } from "@swr/use-project";
import o from "@swr/use-team";
export default function m() {
    var m = e().query, u = m.project;
    var s = a(u), i = s.data;
    var n = o(), p = n.teamSlug;
    var v = i === null || i === void 0 ? void 0 : i.id;
    var c = useProjectBranches(v), d = c.data;
    return r(t, {});
};
