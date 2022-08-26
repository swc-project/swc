import { jsx as r, Fragment as t } from "react/jsx-runtime";
import e from "react";
import { useRouter as o } from "next/router";
import { useProject as m } from "@swr/use-project";
import a from "@swr/use-team";
export default function u() {
    var e = o().query, u = m(e.project), i = u.data;
    return a().teamSlug, useProjectBranches(null == i ? void 0 : i.id).data, r(t, {});
};
