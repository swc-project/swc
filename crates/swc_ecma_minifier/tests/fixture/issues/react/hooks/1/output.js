import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useRouter } from "next/router";
import { useProject } from "@swr/use-project";
import useTeam from "@swr/use-team";
export default function MyComp() {
    var _query = useRouter().query, ref = useProject(_query.project), projectInfo = ref.data, ref1 = useTeam();
    return ref1.teamSlug, useProjectBranches(null == projectInfo ? void 0 : projectInfo.id).data, _jsx(_Fragment, {});
};
