# Add Pull Request to Project

A GitHub action that lets you automatically add Pull Requests to your Projects.

You will need the Column ID of the specific column it should go into. Extract this by clicking on the `...` of the column, choosing "Copy column link" and then taking the last number of the URL, e.g. in `https://github.com/orgs/BlackbirdHQ/projects/99999#column-123456` the Column ID is `123456`.

# Example Workflow

```yml
name: 'Bot: Add Pull Request to Project'
on:
  pull_request:
    types:
      # Only add it when the PR is opened.
      - opened

jobs:
  add-to-project:
    runs-on: ubuntu-latest
    steps:
      - uses: BlackirdHQ/action-add-pr-to-project@release/v1
        with:
          # The Column ID of the project
          columnId: 123456
          token: ${{ secrets.GITHUB_TOKEN }}
```
