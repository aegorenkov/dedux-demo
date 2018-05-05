describe('Object_Object', () => {
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
      deepFreeze({root: {todos: [{ id: 1, text: 'Make todo list', completed: false }]}}),
      {type: 'UPDATE_TODOS', value: { completed: true }, where: (elem) => elem.id === 1} 
    )).toEqual({root: {todos: [{ id: 1, text: 'Make todo list', completed: true }]}});
    expect(reducer(
      deepFreeze({root: {todos: { 1 : {text: 'Make todo list', completed: false }}}}),
      {type: 'UPDATE_TODOS', value: { completed: true }, key: 1} 
    )).toEqual({root: {todos: { 1 : {text: 'Make todo list', completed: true }}}});
  });
});