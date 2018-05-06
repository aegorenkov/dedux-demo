describe('Object_Array', () => {
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
  it('UPDATE_PATH', () => {
    expect(reducer(
      deepFreeze({ counts: [1, 2] }), 
      { type: 'UPDATE_COUNTS', value: 3, where: (val) => val === 2 }
    )).toEqual({ counts: [1, 3] });
    expect(reducer(
      deepFreeze({ widgets: [1, 2] }), 
      { type: 'UPDATE_WIDGETS', value: 4, where: (val) => val === 1 }
    )).toEqual({ widgets: [4, 2] });
    expect(reducer(
      deepFreeze({todos: [{ id: 1, text: 'Make todo list', completed: false }]}),
      {type: 'UPDATE_TODOS', value: { completed: true }, where: (elem) => elem.id === 1} 
    )).toEqual({todos: [{ id: 1, text: 'Make todo list', completed: true }]});
    expect(reducer(
      deepFreeze({root: {todos: [{ id: 1, text: 'Make todo list', completed: false }]}}),
      {type: 'UPDATE_ROOT_TODOS', value: { completed: true }, where: (elem) => elem.id === 1} 
    )).toEqual({root: {todos: [{ id: 1, text: 'Make todo list', completed: true }]}});
  });
});