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
  it('SET_ALL', () => {
    expect(reducer(
      deepFreeze([false, false, false]), 
      { type: 'SET_ALL', value: true}
    )).toEqual([true, true, true]);
  });
  it('SET', () => {
    expect(reducer(
      deepFreeze([false, false, true]), 
      { type: 'SET', index: 2, value: false }
    )).toEqual([false, false, false]);
  });
  it('INSERT', () => {
    expect(reducer(
      deepFreeze([true, true]), 
      { type: 'INSERT', value: true, index: 1 }
    )).toEqual([true, true, true]);
  });
  it('REMOVE', () => {
    expect(reducer(
      deepFreeze([true, false]), 
      { type: 'REMOVE', index: 0 }
    )).toEqual([false]);
  });
  it('UPDATE', () => {
    expect(reducer(
      deepFreeze([false, true]), 
      { type: 'UPDATE', value: true, where: (val) => val === false,}
    )).toEqual([true, true]);
  });
});