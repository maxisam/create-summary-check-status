import * as core from '@actions/core';
import {inspect} from 'util';
import {getInputs, getOctokit, getOwnerRepo} from './common';
import {createStatusRequest, StatusRequest} from './create-status-request';

async function run(): Promise<void> {
  const inputs = getInputs();
  const [owner, repo] = getOwnerRepo(inputs.owner, inputs.repo);
  const octokit = getOctokit(inputs.authToken, 'github-action-create-summary-check-status');
  let request: StatusRequest;
  try {
    request = createStatusRequest(owner, repo, inputs);
    core.debug(`dispatch event request: ${inspect(request)}`);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(`Error creating status request object: ${error.message}`);
    }
    return;
  }

  if (octokit === null) {
    core.setFailed('Error creating octokit:\noctokit was null');
  } else {
    try {
      await octokit.repos.createCommitStatus(request);
    } catch (error) {
      core.debug(inspect(error));
      if (error instanceof Error) {
        core.setFailed(`Error setting status:\n${error.message}\nRequest object:\n${JSON.stringify(request, null, 2)}`);
      }
    }
  }
}

run();
