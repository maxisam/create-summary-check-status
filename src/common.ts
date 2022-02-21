import * as core from '@actions/core';
import {Octokit} from '@octokit/rest';
import {inspect} from 'util';
import {CommitState, IInputs, INPUTS} from './modal';
export const ERR_INVALID_OWNER = "Input 'owner' must be a valid GitHub username";

export function getInputs(): IInputs {
  const inputs: IInputs = {
    authToken: core.getInput(INPUTS.authToken),
    context: core.getInput(INPUTS.checkName),
    description: core.getInput(INPUTS.description),
    failureStates: core.getMultilineInput(INPUTS.failureStates),
    jobResults: core.getMultilineInput(INPUTS.jobResults),
    owner: core.getInput(INPUTS.owner),
    repo: core.getInput(INPUTS.repository),
    sha: core.getInput(INPUTS.sha),
    state: core.getInput(INPUTS.state) as CommitState,
    target_url: core.getInput(INPUTS.targetUrl)
  };
  core.debug(`Inputs: ${inspect(inputs)}`);
  return inputs;
}

export function getOwnerRepo(owner: string, repository: string): [string, string] {
  const regExUsername = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

  if (!regExUsername.test(owner)) {
    throw new Error(ERR_INVALID_OWNER);
  }

  if (repository.startsWith(`${owner}/`)) {
    const [repoOwner, repo] = repository.split('/');
    return [repoOwner, repo];
  }
  return [owner, repository];
}

export function getOctokit(authToken: string, userAgent = 'github-action'): Octokit | null {
  let octokit: Octokit | null = null;

  try {
    octokit = new Octokit({
      auth: authToken,
      userAgent,
      baseUrl: 'https://api.github.com',
      log: {
        debug: () => {},
        info: () => {},
        warn: console.warn,
        error: console.error
      },
      request: {
        agent: undefined,
        fetch: undefined,
        timeout: 0
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(`Error creating octokit:\n${error.message}`);
    }
  }
  return octokit;
}
