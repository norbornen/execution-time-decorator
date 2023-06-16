import { isPrimitive, isPrimitiveOrDate } from '../src/utils';

describe('Is Primitive', () => {
  it('chech isPrimitive', async () => {
    expect(isPrimitive(true)).toEqual(true);
    expect(isPrimitive(1)).toEqual(true);
    expect(isPrimitive(BigInt(1))).toEqual(true);
    expect(isPrimitive(new Date())).toEqual(false);
    expect(isPrimitive({})).toEqual(false);
    expect(isPrimitive([])).toEqual(false);
    expect(isPrimitive(() => void 1)).toEqual(false);
  });
  it('chech isPrimitiveOrDate', async () => {
    expect(isPrimitiveOrDate(true)).toEqual(true);
    expect(isPrimitiveOrDate(1)).toEqual(true);
    expect(isPrimitiveOrDate(BigInt(1))).toEqual(true);
    expect(isPrimitiveOrDate(new Date())).toEqual(true);
    expect(isPrimitiveOrDate({})).toEqual(false);
    expect(isPrimitiveOrDate([])).toEqual(false);
    expect(isPrimitiveOrDate(() => void 1)).toEqual(false);
  });
});
