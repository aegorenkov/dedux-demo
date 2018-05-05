describe('Object_Number', () => {
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
  it('INCREMENT', () => {
    expect(reducer(
      deepFreeze({ a: 1, b: 2 }), 
      { type: 'INCREMENT', value: 3, key: 'b' }
    )).toEqual({ a: 1, b: 5 });
  });
  it('DECREMENT', () => {
    expect(reducer(
      deepFreeze({ a: 1, b: 2 }), 
      { type: 'DECREMENT', value: 3, key: 'b' }
    )).toEqual({ a: 1, b: -1 });
  });
  it('INCREMENT_PATH', () => {
    expect(reducer(
      deepFreeze({ a: 1, b: 2 }), 
      { type: 'INCREMENT_A', value: 3 }
    )).toEqual({ a: 4, b: 2 });
    expect(reducer(
      deepFreeze({ a: 1, b: 2 }), 
      { type: 'INCREMENT_B', value: 3 }
    )).toEqual({ a: 1, b: 5 });
    expect(reducer(
      deepFreeze({ A: 1, b: 2 }), 
      { type: 'INCREMENT_A', value: 3 }
    )).toEqual({ A: 4, b: 2 });
  });
});