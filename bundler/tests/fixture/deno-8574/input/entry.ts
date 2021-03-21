import { request } from "https://cdn.skypack.dev/@octokit/request";

const { data } = await request('GET /repos/{owner}/{repo}/license', {
    headers: {
        authorization: `token ${Deno.env.get('GITHUB_TOKEN')}`,
    },
    owner: 'denoland',
    repo: 'deno'
})

console.log(data.license.name);