import { jsx as r, Fragment as t } from "react/jsx-runtime";
import { useRouter as e } from "next/router";
import { useProject as o } from "@swr/use-project";
import a from "@swr/use-team";
export default function m() {
    var m = e().query.project, u = o(m).data;
    a().teamSlug;
    var s = null == u ? void 0 : u.id;
    return useProjectBranches(s).data, r(t, {});
}
