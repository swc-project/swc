import React from "react";
import { useRouter } from "next/router";

import { useProject } from "@swr/use-project";
import useTeam from "@swr/use-team";

export default function MyComp() {
    const { project: projectName } = useRouter().query;
    const { data: projectInfo } = useProject(projectName);
    const { teamSlug } = useTeam();
    const projectId = projectInfo?.id;
    let { data: branches } = useProjectBranches(projectId);

    return <></>;
}
