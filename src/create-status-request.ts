import * as core from '@actions/core';
import {RequestParameters} from '@octokit/types';
import {COMMIT_STATE, INPUTS} from './modal';

export type CommitState = keyof typeof COMMIT_STATE;
export type StatusRequest = RequestParameters &
  Omit<
    {
      owner: string;
      repo: string;
      sha: string;
    } & {
      state: 'success' | 'error' | 'failure' | 'pending';
      target_url?: string | undefined;
      description?: string | undefined;
      context?: string | undefined;
    },
    'baseUrl'
  >;
export const ERR_INVALID_OWNER = "Input 'owner' must be a valid GitHub username";
export const ERR_INVALID_STATE = "Input 'state' must be one of success | error | failure | pending";

const regExUsername = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

export function createStatusRequest(): StatusRequest {
  const request: StatusRequest = {} as StatusRequest;

  request.context = core.getInput(INPUTS.checkName);
  request.description = core.getInput(INPUTS.description);
  request.state = getState();
  request.owner = core.getInput(INPUTS.owner);
  request.repo = core.getInput(INPUTS.repository);
  request.sha = core.getInput(INPUTS.sha);
  request.target_url = core.getInput(INPUTS.targetUrl);

  if (!regExUsername.test(request.owner)) {
    throw new Error(ERR_INVALID_OWNER);
  }

  if (!validateState(request.state)) {
    throw new Error(ERR_INVALID_STATE);
  }

  if (request.repo.startsWith(`${request.owner}/`)) {
    request.repository = request.repo.replace(`${request.owner}/`, '');
  }

  return request;
}

function getState(): CommitState {
  const state = core.getInput(INPUTS.state) as CommitState;
  if (validateState(state)) {
    return state;
  }

  const jobResults = core.getMultilineInput(INPUTS.jobResults);
  const failureStates = core.getMultilineInput(INPUTS.failureStates);
  const isFailure = !!jobResults.find(jobResult => failureStates.includes(jobResult));
  if (isFailure) {
    return COMMIT_STATE.failure;
  }
  return COMMIT_STATE.success;
}

function validateState(state: string): boolean {
  return Object.values(COMMIT_STATE).includes(state as COMMIT_STATE);
}
