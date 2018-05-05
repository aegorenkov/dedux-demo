describe('Boolean', () => {
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
      false, 
      { type: 'SET', value: true }
    )).toEqual(true);
  });
  it('TOGGLE', () => {
    expect(reducer(
      false, 
      { type: 'TOGGLE' }
    )).toEqual(true);
  });
});