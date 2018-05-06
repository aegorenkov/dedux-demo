describe('Array_Number', () => {
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
      deepFreeze([1, 2, 3]), 
      { type: 'ADD', value: 4 }
    )).toEqual([1, 2, 3, 4]);
  });
  it('CONCAT', () => {
    expect(reducer(
      deepFreeze([1, 2, 3]), 
      { type: 'CONCAT', value: [4, 5] }
    )).toEqual([1, 2, 3, 4, 5]);
  });
  it('SET_ALL', () => {
    expect(reducer(
      deepFreeze([1, 2, 3]), 
      { type: 'SET_ALL', value: 2 }
    )).toEqual([2, 2, 2]);
  });
  it('SET', () => {
    expect(reducer(
      deepFreeze([1, 2, 3]), 
      { type: 'SET', index: 0, value: 3 }
    )).toEqual([3, 2, 3]);
    expect(reducer(
      deepFreeze([1, 2, 3]), 
      { type: 'SET', where: (val) => val === 2, value: 3 }
    )).toEqual([1, 3, 3]);
  });
  it('INSERT', () => {
    expect(reducer(
      deepFreeze([1, 2, 3]), 
      { type: 'INSERT', value: 4, index: 1 }
    )).toEqual([1, 4, 2, 3]);
  });
  it('REMOVE_ALL', () => {
    expect(reducer(
      deepFreeze([1, 2, 3]), 
      { type: 'REMOVE_ALL' }
    )).toEqual([]);
  });
  it('REMOVE', () => {
    expect(reducer(
      deepFreeze([1, 2, 3]), 
      { type: 'REMOVE' }
    )).toEqual([1, 2]);
    expect(reducer(
      deepFreeze([1, 2, 3]), 
      { type: 'REMOVE', index: 0 }
    )).toEqual([2, 3]);
    expect(reducer(
      deepFreeze([1, 2, 3]), 
      { type: 'REMOVE', where: (val) => val === 2 }
    )).toEqual([1, 3]);  
  });
  it('INCREMENT_ALL', () => {
    expect(reducer(
      deepFreeze([1, 2, 3]), 
      { type: 'INCREMENT_ALL', value: 4 }
    )).toEqual([5, 6, 7]);
  });
  it('INCREMENT', () => {
    expect(reducer(
      deepFreeze([1, 2, 3]), 
      { type: 'INCREMENT', value: 4, index: 1 }
    )).toEqual([1, 6, 3]);
  });
  it('DECREMENT_ALL', () => {
    expect(reducer(
      deepFreeze([1, 2, 3]), 
      { type: 'DECREMENT_ALL',value: 4 }
    )).toEqual([-3, -2, -1]);
  });
  it('DECREMENT', () => {
    expect(reducer(
      deepFreeze([1, 6, 3]), 
      { type: 'DECREMENT', value: 4, index: 1 }
    )).toEqual([1, 2, 3]);
  });
});