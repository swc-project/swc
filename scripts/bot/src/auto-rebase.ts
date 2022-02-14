import { getLatestCommitMesssage } from "./util/git";
import { octokit } from "./util/octokit";

// We only auto-rebase if the latest commit message is one of 
//
// - test(*)
// - chore:


(async () => {
    const latestCommitMessage = await getLatestCommitMesssage();

    console.log(`Latest commit message: ${latestCommitMessage}`);

    if (!latestCommitMessage.startsWith("test(") && !latestCommitMessage.startsWith("chore:")) {
        console.log(`Auto rebase script cannot work because the latest commit may require a version bump`);
        return;
    }

    // octokit.rest.repos.mergeUpstream({
    //     owner,
    //     repo,
    //     branch,
    // });
})()
