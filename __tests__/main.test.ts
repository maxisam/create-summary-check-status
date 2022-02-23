import {expect, test} from '@jest/globals';
import {getState} from '../src/create-status-request';
import {CommitState} from '../src/modal';

test('with assigned state', async () => {
  const state = 'success';
  const jobResults = ['success'];
  const failureStates = ['failure'];
  await expect(getState(state, jobResults, failureStates)).toBe('success');
});

test('with no assigned state, with failure and success in jobResults', async () => {
  const state = '' as CommitState;
  const jobResults = ['success', 'failure'];
  const failureStates = ['failure'];
  await expect(getState(state, jobResults, failureStates)).toBe('failure');
});

test('with no assigned state, with failure in jobResults', async () => {
  const state = '' as CommitState;
  const jobResults = ['failure', 'failure', 'failure'];
  const failureStates = ['failure', 'cancled'];
  await expect(getState(state, jobResults, failureStates)).toBe('failure');
});

test('with no assigned state, with no failure in jobResults', async () => {
  const state = '' as CommitState;
  const jobResults = ['success', 'skipped'];
  const failureStates = ['failure'];
  await expect(getState(state, jobResults, failureStates)).toBe('success');
});
