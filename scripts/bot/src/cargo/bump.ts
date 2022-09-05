import { exec } from "child_process";
import { getTitleOfLatestCommit } from "../util/git";
import { parsePrComments } from "./comment-parser";
import { promisify } from "util";

const execAsync = promisify(exec);

(async () => {
    const latestCommitMessage = await getTitleOfLatestCommit();
    console.log("Latest commit message:", latestCommitMessage);

    const lParenIndex = latestCommitMessage.lastIndexOf("(#");

    console.log(lParenIndex);

    if (!latestCommitMessage.endsWith(")") || lParenIndex === -1) {
        console.log(`This commit does not seems like a PR merge`);
        process.exit(1);
        return;
    }

    const prNumber = parseInt(
        latestCommitMessage.substring(
            lParenIndex + 2,
            latestCommitMessage.length - 1
        )
    );

    const actions = await parsePrComments(prNumber);

    if (actions.length === 0) {
        throw new Error("This commit does not require a bump commit");
    }

    for (const action of actions) {
        console.log(action);

        if (action.breaking) {
            await execAsync(`cargo mono bump ${action.crate} --breaking`);
        } else {
            await execAsync(`cargo mono bump ${action.crate} -D`);
        }
    }
})();
