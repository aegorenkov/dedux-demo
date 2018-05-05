describe('Array_Boolean', () => {
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

  it('ADD', () => {
    expect(reducer(
      deepFreeze([true, false]),
      { type: 'ADD', value: true }
    )).toEqual([true, false, true]);
  });
  it('CONCAT', () => {
    expect(reducer(
      deepFreeze([true, false]),
      { type: 'CONCAT', value: [true, false] }
    )).toEqual([true, false, true, false]);
  });
  it('SET_ALL', () => {
    expect(reducer(
      deepFreeze([false, true, false]),
      { type: 'SET_ALL', value: true }
    )).toEqual([true, true, true]);
  });
  it('SET', () => {
    expect(reducer(
      deepFreeze([false, false, true]),
      { type: 'SET', index: 2, value: false }
    )).toEqual([false, false, false]);
    expect(reducer(
      deepFreeze([false, true]),
      { type: 'SET', value: true, where: (val) => val === false }
    )).toEqual([true, true]);
  });
  it('INSERT', () => {
    expect(reducer(
      deepFreeze([false, true]),
      { type: 'INSERT', value: true, index: 1 }
    )).toEqual([false, true, true]);
  });
  it('REMOVE_ALL', () => {
    expect(reducer(
      deepFreeze([true, false]),
      { type: 'REMOVE_ALL' }
    )).toEqual([]);
  });
  it('REMOVE', () => {
    expect(reducer(
      deepFreeze([true, false]),
      { type: 'REMOVE', index: 0 }
    )).toEqual([false]);
    expect(reducer(
      deepFreeze([true, false]),
      { type: 'REMOVE' }
    )).toEqual([true]);
  });
  it('TOGGLE_ALL', () => {
    expect(reducer(
      deepFreeze([true, false]),
      { type: 'TOGGLE_ALL' }
    )).toEqual([false, true]);
  });
  it('TOGGLE', () => {
    expect(reducer(
      deepFreeze([true, false]),
      { type: 'TOGGLE', index: 0 }
    )).toEqual([false, false]);
    expect(reducer(
      deepFreeze([true, false]),
      { type: 'TOGGLE', where: (el) => el === false }
    )).toEqual([true, true]);
  });
});