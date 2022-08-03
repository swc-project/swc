import { jsx as r, Fragment as o } from "react/jsx-runtime";
import t from "react";
import { useRouter as m } from "next/router";
import { useProject as a } from "@swr/use-project";
import i from "@swr/use-team";
export default function e() {
    var t = m().query.project, e = a(t).data;
    return i().teamSlug, useProjectBranches(null == e ? void 0 : e.id).data, r(o, {});
};
