const API_VERSION = "2022-11-28";

/** Minimal repository-scoped client; HTTP failures never become policy denials. */
export class GitHubClient {
  constructor({
    repository,
    token,
    apiUrl = "https://api.github.com",
    fetchImpl = globalThis.fetch,
  }) {
    if (
      typeof repository !== "string" ||
      !/^[\w.-]+\/[\w.-]+$/.test(repository)
    ) {
      throw new Error("GITHUB_REPOSITORY must use the owner/repository format");
    }
    if (typeof token !== "string" || !token)
      throw new Error("A repository token is required");
    this.repository = repository;
    this.token = token;
    this.apiUrl = apiUrl.replace(/\/$/, "");
    this.fetchImpl = fetchImpl;
  }

  async request(path, { method = "GET", body } = {}) {
    const response = await this.fetchImpl(
      `${this.apiUrl}/repos/${this.repository}${path}`,
      {
        method,
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
          "X-GitHub-Api-Version": API_VERSION,
        },
        signal: AbortSignal.timeout(30_000),
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      }
    );
    if (!response.ok)
      throw new Error(
        `GitHub ${method} ${path} failed (HTTP ${response.status})`
      );
    return response.json();
  }

  getPullRequest(number) {
    return this.request(`/pulls/${number}`);
  }

  async getPermission(login) {
    const result = await this.request(
      `/collaborators/${encodeURIComponent(login)}/permission`
    );
    return result.permission;
  }

  /** Paginate all comments so an earlier notice remains visible on busy PRs. */
  async hasNotice(number, marker) {
    for (let page = 1; ; page++) {
      const comments = await this.request(
        `/issues/${number}/comments?per_page=100&page=${page}`
      );
      if (!Array.isArray(comments))
        throw new Error("GitHub returned an invalid comments response");
      if (
        comments.some(
          (comment) =>
            comment.user?.login === "github-actions[bot]" &&
            comment.user?.type === "Bot" &&
            typeof comment.body === "string" &&
            comment.body.includes(marker)
        )
      )
        return true;
      if (comments.length < 100) return false;
    }
  }

  createComment(number, body) {
    return this.request(`/issues/${number}/comments`, {
      method: "POST",
      body: { body },
    });
  }

  closePullRequest(number) {
    return this.request(`/pulls/${number}`, {
      method: "PATCH",
      body: { state: "closed" },
    });
  }
}
