describe('Array_Object', () => {
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
      deepFreeze([{ a: 1 }]),
      { type: 'ADD', value: { b: 2 } }
    )).toEqual([{ a: 1 }, { b: 2 }]);
  });
  it('CONCAT', () => {
    expect(reducer(
      deepFreeze([{ a: 1 }]),
      { type: 'CONCAT', value: [{ b: 2 }, { c: 3 }] }
    )).toEqual([{ a: 1 }, { b: 2 }, { c: 3 }]);
  });
  it('SET_ALL', () => {
    expect(reducer(
      deepFreeze([{ b: 2 }, { c: 3 }]),
      { type: 'SET_ALL', value: { d: 4 } }
    )).toEqual([{ d: 4 }, { d: 4 }]);
  });
  it('SET', () => {
    expect(reducer(
      deepFreeze([{ b: 2 }, { c: 3 }]),
      { type: 'SET', index: 0, value: { d: 4 } }
    )).toEqual([{ d: 4 }, { c: 3 }]);
    expect(reducer(
      deepFreeze([{ b: 2 }, { c: 3 }]),
      { type: 'SET', where: (val) => val.hasOwnProperty('c'), value: { d: 4 } }
    )).toEqual([{ b: 2 }, { d: 4 }]);
  });
  it('INSERT', () => {
    expect(reducer(
      deepFreeze([{ a: 1 }, { c: 3 }]),
      { type: 'INSERT', value: { b: 2 }, index: 1 }
    )).toEqual([{ a: 1 }, { b: 2 }, { c: 3 }]);
  });
  it('REMOVE_ALL', () => {
    expect(reducer(
      deepFreeze([{ a: 1 }, { b: 2 }, { c: 3 }]),
      { type: 'REMOVE_ALL' }
    )).toEqual([]);
  });
  it('REMOVE', () => {
    expect(reducer(
      deepFreeze([{ a: 1 }, { b: 2 }, { c: 3 }]),
      { type: 'REMOVE' }
    )).toEqual([{ a: 1 }, { b: 2 }]);
    expect(reducer(
      deepFreeze([{ a: 1 }, { b: 2 }, { c: 3 }]),
      { type: 'REMOVE', index: 0 }
    )).toEqual([{ b: 2 }, { c: 3 }]);
    expect(reducer(
      deepFreeze([{ a: 1 }, { b: 2 }, { c: 3 }]),
      { type: 'REMOVE', where: (val) => Object.values(val).includes(2) }
    )).toEqual([{ a: 1 }, { c: 3 }]);
  });
  it('MERGE_ALL', () => {
    expect(reducer(
      deepFreeze([{ a: 1 }, { b: 2 }, { c: 3 }]),
      { type: 'MERGE_ALL', value: { d: 4 } }
    )).toEqual[{ a: 1, d: 4 }, { b: 2, d: 4 }, { c: 3, d: 4 }];
  });
  it('MERGE', () => {
    expect(reducer(
      deepFreeze([{ a: 1 }, { b: 2 }, { c: 3 }]),
      { type: 'MERGE', value: { d: 4 }, index: 0 }
    )).toEqual[{ a: 1, d: 4 }, { b: 2 }, { c: 3 }];
    expect(reducer(
      deepFreeze([{ a: 1 }, { b: 2 }, { c: 3 }]),
      { type: 'MERGE', value: { d: 4 }, where: (val) => val.c === 3 }
    )).toEqual[{ a: 1, d: 4 }, { b: 2 }, { c: 3, d: 4 }];
  });
});