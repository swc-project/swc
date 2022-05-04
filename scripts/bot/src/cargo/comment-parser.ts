import { octokit } from "../util/octokit";
import YAML from "yaml";

const owner = "swc-project";
const repo = "swc";
const maintainer = "kdy1";

export interface Action {
    crate: string;
    breaking: boolean;
}

export async function parsePrComments(prNumber: number): Promise<Action[]> {
    const comments = await octokit.pulls.listReviews({
        owner,
        repo,
        pull_number: prNumber,
    });

    return comments.data
        .filter((c) => c.user && c.user.login === maintainer)
        .map((c) => {
            const idx = c.body.indexOf("swc-bump:");
            if (idx === -1) {
                return undefined;
            }
            return c.body.substring(idx);
        })
        .filter((text) => !!text)
        .map((text) => text!)
        .map((text) => YAML.parse(text))
        .map((data) => data["swc-bump"])
        .flatMap((data) => data)
        .map((line) => {
            if (typeof line !== "string") {
                throw new Error(`Non-string data: ${line}`);
            }
            line = line.trim();

            console.log(`Comment line: '${line}'`);

            if (line.endsWith(" --breaking")) {
                return {
                    crate: line.substring(
                        0,
                        line.length - " --breaking".length
                    ),
                    breaking: true,
                };
            }

            return {
                crate: line,
                breaking: false,
            };
        });
}
