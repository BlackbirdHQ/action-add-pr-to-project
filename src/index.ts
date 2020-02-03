import * as core from '@actions/core'
import * as github from '@actions/github'

async function run() {
  const columnId = core.getInput('columnId', { required: true });
  const token = core.getInput('token', { required: true });
  const octokit = new github.GitHub(token);
  const owner = github.context.repo.owner;
  const repo = github.context.repo.repo;

  const { data: pullRequest } = await octokit.pulls.get({
    owner,
    repo,
    pull_number: github.context.payload?.pull_request?.number!,
  });


  try {
    await octokit.projects.createCard({
      column_id: parseInt(columnId, 10),
      content_id: pullRequest.id,
      content_type: 'PullRequest'
    });
    octokit.projects.getCard
  } catch (err) {
    core.setFailed(
      `Pull request "${github.context.payload?.pull_request?.number!}" could not be added to Project on column id '${columnId}'.`,
    );
  }
}

run();
