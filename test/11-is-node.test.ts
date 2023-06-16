import { isNode } from '../src/utils';

describe('Is Node', () => {
  it('chech', async () => {
    expect(isNode()).toEqual(true);
  });
});
