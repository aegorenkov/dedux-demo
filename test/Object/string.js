describe('Object_String', () => {
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
      deepFreeze({ a: 'a', b: 'b' }), 
      { type: 'SET', value: 'c', key: 'b' }
    )).toEqual({ a: 'a', b: 'c' });
  });
});