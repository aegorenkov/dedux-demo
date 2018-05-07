describe('Object', () => {
  let reducer;
  before(() => {
    reducer = (state = {}, action) => {
      switch (action.type) {
        default:
          return state;
      }
    };
    reducer = Deduce(reducer);
  });
  it('SET', () => {
    expect(reducer(
      deepFreeze({ a: true, b: false }),
      { type: 'SET', key: 'c', value: false }
    )).toEqual({ a: true, b: false, c: false });
  });
  it('SET_ALL', () => {
    expect(reducer(
      deepFreeze({ a: true, b: false }),
      { type: 'SET_ALL', value: true }
    )).toEqual({ a: true, b: true });
  });
  it('SET', () => {
    expect(reducer(
      deepFreeze({ a: true, b: false }),
      { type: 'SET', key: 'b', value: true }
    )).toEqual({ a: true, b: true });
    expect(reducer(
      deepFreeze({ a: true, b: false }),
      { type: 'SET', where: (key, val) => { return (key === 'b') && (val === false) }, value: true }
    )).toEqual({ a: true, b: true });
  });
  it('MERGE', () => {
    expect(reducer(
      deepFreeze({ a: true, b: false }),
      { type: 'MERGE', value: { b: true, a: false } }
    )).toEqual({ a: false, b: true });
  });
  it('REMOVE_ALL', () => {
    expect(reducer(
      deepFreeze({ a: true, b: false }),
      { type: 'REMOVE_ALL' }
    )).toEqual({});
  });
  it('REMOVE', () => {
    expect(reducer(
      deepFreeze({ a: true, b: false }),
      { type: 'REMOVE', key: 'a' }
    )).toEqual({ b: false });
    expect(reducer(
      deepFreeze({ a: true, b: false }),
      { type: 'REMOVE', where: (key, value) => key === 'a' && value === true }
    )).toEqual({ b: false });
  });
  it('SET_PATH', () => {
    expect(reducer(
      deepFreeze({ a: true, b: false }),
      { type: 'SET_A', value: false }
    )).toEqual({ a: false, b: false });
    expect(reducer(
      deepFreeze({ test: { a: true, b: false } }),
      { type: 'SET_TEST', value: false, key: 'a' }
    )).toEqual({ test: { a: false, b: false } });
    expect(reducer(
      deepFreeze({ test: { a: true, b: false } }),
      { type: 'SET_TEST', value: true, where: (key, value) => key === 'b' && value === false }
    )).toEqual({ test: { a: true, b: true } });
  });
  it('TOGGLE_PATH', () => {
    expect(reducer(
      deepFreeze({ a: true, b: false }),
      { type: 'TOGGLE_A' }
    )).toEqual({ a: false, b: false });
    expect(reducer(
      deepFreeze({ a: true, b: false }),
      { type: 'TOGGLE_B' }
    )).toEqual({ a: true, b: true });
  });
  it('TOGGLE_PATH_LOOKUP', () => {
    expect(reducer(
      deepFreeze({ test: { a: true, b: false } }),
      { type: 'TOGGLE_TEST', value: false, key: 'a' }
    )).toEqual({ test: { a: false, b: false } });
    expect(reducer(
      deepFreeze({ test: { a: true, b: false } }),
      { type: 'TOGGLE_TEST', value: false, where: (key, value) => key === 'a' && value === true }
    )).toEqual({ test: { a: false, b: false } });
  });
});