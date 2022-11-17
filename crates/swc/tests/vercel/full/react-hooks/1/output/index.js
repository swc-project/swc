import { jsx as r, Fragment as t } from "react/jsx-runtime";
import e from "react";
import { useRouter as o } from "next/router";
import { useProject as a } from "@swr/use-project";
import m from "@swr/use-team";
export default function u() {
    var e = o().query.project, u = a(e).data;
    m().teamSlug;
    var s = null == u ? void 0 : u.id;
    return useProjectBranches(s).data, r(t, {});
}
