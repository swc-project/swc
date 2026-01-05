// npx ts-node .github/bot/src/milestone-manager.ts $version
// This script creates a milestone for the published version and moves all issues/PRs from "Planned" milestone to it

import { octokit, owner, repo } from "./util/octokit";

async function main() {
  const version = process.argv[2];

  if (!version) {
    console.error(
      "Usage: npx ts-node .github/bot/src/milestone-manager.ts <version>"
    );
    process.exit(1);
  }

  console.log(`Managing milestone for version: ${version}`);

  try {
    // 1. Create a new milestone for the version
    console.log(`Creating milestone: ${version}`);

    let newMilestone;
    try {
      const { data: milestone } = await octokit.issues.createMilestone({
        owner,
        repo,
        title: version,
        description: `Release milestone for version ${version}`,
        state: "open",
      });
      newMilestone = milestone;
      console.log(
        `✓ Created milestone: ${milestone.title} (#${milestone.number})`
      );
    } catch (error: any) {
      if (error.status === 422) {
        // Milestone already exists, fetch it
        console.log(`Milestone ${version} already exists, fetching it...`);
        const { data: milestones } = await octokit.issues.listMilestones({
          owner,
          repo,
          state: "open",
        });
        newMilestone = milestones.find((m) => m.title === version);
        if (!newMilestone) {
          throw new Error(`Could not find existing milestone: ${version}`);
        }
        console.log(
          `✓ Found existing milestone: ${newMilestone.title} (#${newMilestone.number})`
        );
      } else {
        throw error;
      }
    }

    // 2. Find the "Planned" milestone
    console.log(`Looking for "Planned" milestone...`);
    const { data: milestones } = await octokit.issues.listMilestones({
      owner,
      repo,
      state: "open",
    });

    const plannedMilestone = milestones.find((m) => m.title === "Planned");
    if (!plannedMilestone) {
      console.log(`⚠ No "Planned" milestone found, nothing to move`);
      return;
    }

    console.log(`✓ Found "Planned" milestone (#${plannedMilestone.number})`);

    // 3. Get all issues from the "Planned" milestone
    console.log(`Fetching issues from "Planned" milestone...`);
    const { data: issues } = await octokit.issues.listForRepo({
      owner,
      repo,
      milestone: plannedMilestone.number.toString(),
      state: "all",
      per_page: 100,
    });

    // Filter out PRs from issues list
    const onlyIssues = issues.filter((issue) => !issue.pull_request);
    console.log(`✓ Found ${onlyIssues.length} issues in "Planned" milestone`);

    // 4. Get all PRs from the "Planned" milestone separately
    console.log(`Fetching PRs from "Planned" milestone...`);
    const { data: allPRs } = await octokit.pulls.list({
      owner,
      repo,
      state: "all",
      per_page: 100,
    });

    // Filter PRs that belong to the "Planned" milestone
    const prs = allPRs.filter(
      (pr) => pr.milestone?.number === plannedMilestone.number
    );
    console.log(`✓ Found ${prs.length} PRs in "Planned" milestone`);

    if (onlyIssues.length === 0 && prs.length === 0) {
      console.log(`⚠ No issues or PRs found in "Planned" milestone`);
      return;
    }

    let movedCount = 0;

    // 5. Move closed issues to the new milestone
    console.log(`\nProcessing issues...`);
    for (const issue of onlyIssues) {
      if (issue.state === "open") {
        console.log(`⊘ Skipping issue #${issue.number} (still open)`);
        continue;
      }

      try {
        await octokit.issues.update({
          owner,
          repo,
          issue_number: issue.number,
          milestone: newMilestone.number,
        });

        console.log(`✓ Moved issue #${issue.number}: ${issue.title}`);
        movedCount++;
      } catch (error: any) {
        console.error(`✗ Failed to move issue #${issue.number}: ${error.message}`);
      }
    }

    // 6. Move closed PRs to the new milestone
    console.log(`\nProcessing PRs...`);
    for (const pr of prs) {
      if (pr.state === "open") {
        console.log(`⊘ Skipping PR #${pr.number} (still open)`);
        continue;
      }

      try {
        await octokit.issues.update({
          owner,
          repo,
          issue_number: pr.number,
          milestone: newMilestone.number,
        });

        console.log(`✓ Moved PR #${pr.number}: ${pr.title}`);
        movedCount++;
      } catch (error: any) {
        console.error(`✗ Failed to move PR #${pr.number}: ${error.message}`);
      }
    }

    console.log(
      `\n🎉 Successfully moved ${movedCount}/${onlyIssues.length + prs.length} items from "Planned" to "${version}" milestone`
    );
  } catch (error: any) {
    console.error(`❌ Error managing milestone: ${error.message}`);
    process.exit(1);
  }
}

main();
