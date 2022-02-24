import { getLatestCommitMesssage } from "./util/git";
import { octokit } from "./util/octokit";

// We only auto-rebase if the latest commit message is one of 
//
// - test(*)
// - chore:

const owner = 'swc-project';
const repo = 'swc';

(async () => {
    const latestCommitMessage = await getLatestCommitMesssage();

    console.log(`Latest commit message: ${latestCommitMessage}`);

    if (!latestCommitMessage.startsWith("test(") && !latestCommitMessage.startsWith("chore:")) {
        console.log(`Auto rebase script cannot work because the latest commit may require a version bump`);
        return;
    }

    const allPrs = await octokit.rest.pulls.list({
        owner,
        repo,
        state: 'open',
        sort: 'long-running',
        direction: 'desc',
    });

    const autoMergePrs = allPrs.data.filter(pr => !!pr.auto_merge);

    if (autoMergePrs.length === 0) {
        console.log(`No PRs with auto-merge enabled`);
        return;
    }

    const pr = autoMergePrs[0];

    await octokit.rest.pulls.updateBranch({
        owner,
        repo,
        pull_number: pr.number,
        expected_head_sha: pr.head.sha
    });

    console.log(`Updated PR ${pr.number} to merge upstream`);

})()
