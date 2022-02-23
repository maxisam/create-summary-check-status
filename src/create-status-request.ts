import * as core from '@actions/core';
import {RequestParameters} from '@octokit/types';
import {inspect} from 'util';
import {CommitState, COMMIT_STATE, IInputs} from './modal';

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

export function createStatusRequest(owner: string, repo: string, inputs: IInputs): StatusRequest {
  const request: StatusRequest = {
    description: inputs.description,
    context: inputs.context,
    owner,
    repo,
    sha: inputs.sha,
    target_url: inputs.target_url,
    state: getState(inputs.state, inputs.jobResults, inputs.failureStates)
  };

  return request;
}

export function getState(state: CommitState, jobResults: string[], failureStates: string[]): CommitState {
  if (validateState(state)) {
    return state;
  }
  core.debug(`jobResults: ${inspect(jobResults)}`);
  core.debug(`failureStates: ${inspect(failureStates)}`);
  const isFailure = !!jobResults.find(jobResult => failureStates.includes(jobResult));
  if (isFailure) {
    return COMMIT_STATE.failure;
  }
  return COMMIT_STATE.success;
}

function validateState(state: string): boolean {
  return Object.values(COMMIT_STATE).includes(state as COMMIT_STATE);
}
