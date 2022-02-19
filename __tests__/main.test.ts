// import * as process from 'process';
// import * as cp from 'child_process';
// import * as path from 'path';
import {expect, test} from '@jest/globals';
import {CommitState, getState} from '../src/create-status-request';

test('with assigned state', async () => {
  const state = 'success';
  const jobResults = ['success'];
  const failureStates = ['failure'];
  await expect(getState(state, jobResults, failureStates)).toBe('success');
});

test('with no assigned state, with failure in jobResults', async () => {
  const state = '' as CommitState;
  const jobResults = ['success', 'failure'];
  const failureStates = ['failure'];
  await expect(getState(state, jobResults, failureStates)).toBe('failure');
});

test('with no assigned state, with no failure in jobResults', async () => {
  const state = '' as CommitState;
  const jobResults = ['success', 'skipped'];
  const failureStates = ['failure'];
  await expect(getState(state, jobResults, failureStates)).toBe('success');
});

// // shows how the runner will run a javascript action with env / stdout protocol
// test('test runs', () => {
//   process.env['INPUT_MILLISECONDS'] = '500';
//   const np = process.execPath;
//   const ip = path.join(__dirname, '..', 'lib', 'main.js');
//   const options: cp.ExecFileSyncOptions = {
//     env: process.env
//   };
//   console.log(cp.execFileSync(np, [ip], options).toString());
// });
