import { jsx as r, Fragment as t } from "react/jsx-runtime";
import "react";
import { useRouter as e } from "next/router";
import { useProject as o } from "@swr/use-project";
import a from "@swr/use-team";
export default function m() {
    var m = o(e().query.project).data;
    a().teamSlug;
    var u = null == m ? void 0 : m.id;
    return useProjectBranches(u).data, r(t, {});
}
