[![CI](https://github.com/maxisam/create-summary-check-status/actions/workflows/CI.yml/badge.svg)](https://github.com/maxisam/create-summary-check-status/actions/workflows/CI.yml)

# Create Summary Check Status

This is a simple action to handle situation if you have multiple jobs in a workflow and some of them might be skipped sometime

However, you want to use this workflow to check for PRs.

If you have this issue, this action provides a input called jobResults

It takes all the result from previous jobs

```yml
check:
  runs-on: ubuntu-latest
  # the jobs need to pass
  needs: [job1, job2]
  # use always() so if previous jobs fail, this job will still run
  if: always()
  steps:
    - uses: maxisam/create-summary-check-status@v1
      with:
        jobResults: |
          ${{ needs.job1.result }}
          ${{ needs.job2.result }}
        authToken: ${{secrets.GITHUB_TOKEN}}
        # name showing on the check
        checkName: CI PASSED
        # if any result in job1,job2 is [failure,cacelled], the check will be failure, otherwise the check will be success
        failureStates: |
          failure
          cancelled
        # for PR or Push
        sha: ${{ github.event.pull_request.head.sha || github.sha }}
```

Of course, you can use this action to assign any state to a commit

if you just use `state` input, it will ignore `jobResults` and `failureStates`
