import * as core from '@actions/core';
import * as github from '@actions/github';

type Await<T> = T extends {
  then(onfulfilled?: (value: infer U) => unknown): unknown;
} ? U : T;

async function run() {
  const columnId = core.getInput('columnId');
  const token = core.getInput('token');
  const projectToken = core.getInput('projectToken');
  const octokit = new github.GitHub(token);
  const projectOctokit = new github.GitHub(projectToken);
  const owner = github.context.repo.owner;
  const repo = github.context.repo.repo;

  // FIXME: Ugly hack to get to `Octokit.PullsGetResponse`, but didn't find where it was
  // exported from...
  let pullRequest: Await<ReturnType<typeof octokit.pulls.get>>["data"];

  try {
    const { data } = await octokit.pulls.get({
      owner,
      repo,
      pull_number: github.context.payload?.pull_request?.number!,
    });
    pullRequest = data;
  } catch (err) {
    core.setFailed(
      `Failed to get pull request #${github.context.payload?.pull_request?.number!} information.`,
    );
  }

  try {
    const res = await projectOctokit.projects.createCard({
      column_id: parseInt(columnId, 10),
      content_id: pullRequest!.id,
      content_type: 'PullRequest'
    });
    core.info(`Successfully added Pull request #${github.context.payload?.pull_request?.number!} (${pullRequest!.id}) to Project on column id '${columnId}'.`);
  } catch (err) {
    core.setFailed(
      `Pull request #${github.context.payload?.pull_request?.number!} (${pullRequest!.id}) could not be added to Project on column id '${columnId}'.`,
    );
  }
}

run();
