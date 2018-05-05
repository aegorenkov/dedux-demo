describe('String', () => {
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
      'Old String', 
      { type: 'SET', value: 'New String' }
    )).toEqual('New String');
  });
});