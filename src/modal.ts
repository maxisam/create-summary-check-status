export enum INPUTS {
  jobResults = 'jobResults',
  authToken = 'authToken',
  owner = 'owner',
  repository = 'repository',
  state = 'state',
  failureStates = 'failureStates',
  checkName = 'checkName',
  sha = 'sha',
  description = 'description',
  targetUrl = 'targetUrl'
}

export enum COMMIT_STATE {
  success = 'success',
  error = 'error',
  failure = 'failure',
  pending = 'pending'
}

export type CommitState = keyof typeof COMMIT_STATE;

export interface IInputs {
  authToken: string;
  context: string;
  description: string;
  failureStates: string[];
  jobResults: string[];
  owner: string;
  repo: string;
  sha: string;
  state: CommitState;
  target_url: string;
}
