import { millisecondsFromInput } from '../src/config';

describe('millisecondsFromInput', () => {
  let prevEnvValue: string | undefined;

  beforeEach(() => {
    prevEnvValue = process.env.INPUT_TIMEOUT;
    process.env.INPUT_TIMEOUT = '10';
  });

  afterEach(() => {
    process.env.INPUT_TIMEOUT = prevEnvValue;
  });

  it('should convert seconds string to milliseconds', () => {
    expect(millisecondsFromInput('timeout')).toBe(10_000);
  });
});
