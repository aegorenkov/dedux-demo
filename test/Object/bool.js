describe('Object_Boolean', () => {
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

  it('TOGGLE_PATH', () => {
    expect(reducer(
      deepFreeze({ a: true, b: false }), 
      { type: 'TOGGLE_A' }
    )).toEqual({ a: false, b: false });
    expect(reducer(
      deepFreeze({ a: true, b: false }), 
      { type: 'TOGGLE_B' }
    )).toEqual({ a: true, b: true });
    expect(reducer(
      deepFreeze({ a: true, b: false }), 
      { type: 'TOGGLE_C' }
    )).toEqual({ a: true, b: false });
  });
});