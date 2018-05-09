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
  it('MERGE_ALL', () => {
    expect(reducer(
      deepFreeze({ 
        0 : {text: 'Make todo list', completed: false }, 
        1 : {text: 'Check todo list', completed: false }
      }),
      {type: 'MERGE_ALL', value: { completed: true } } 
    )).toEqual({ 
      0 : {text: 'Make todo list', completed: true }, 
      1 : {text: 'Check todo list', completed: true }
    });
  });
  it('MERGE_IN', () => {
    expect(reducer(
      deepFreeze({ 
        0 : {text: 'Make todo list', completed: false }, 
        1 : {text: 'Check todo list', completed: false }
      }),
      {type: 'MERGE_IN', value: { completed: true } } 
    )).toEqual({ 
      0 : {text: 'Make todo list', completed: true }, 
      1 : {text: 'Check todo list', completed: true }
    });
    // expect(reducer(
    //   deepFreeze({ 
    //     0 : {text: 'Make todo list', completed: false }, 
    //     1 : {text: 'Check todo list', completed: false }
    //   }),
    //   {type: 'MERGE_IN', value: { completed: true }, where: (key, value) => key === 0 && value.completed === false } 
    // )).toEqual({ 
    //   0 : {text: 'Make todo list', completed: true }, 
    //   1 : {text: 'Check todo list', completed: true }
    // });
  });
  it('MERGE_ALL_PATH', () => {
    expect(reducer(
      deepFreeze({root: {todos: { 
        0 : {text: 'Make todo list', completed: false }, 
        1 : {text: 'Check todo list', completed: false }
      }}}),
      {type: 'MERGE_ALL_ROOT_TODOS', value: { completed: true } } 
    )).toEqual({root: {todos: { 
      0 : {text: 'Make todo list', completed: true }, 
      1 : {text: 'Check todo list', completed: true }
    }}});
  });
  it('MERGE_IN_PATH', () => {
    expect(reducer(
      deepFreeze({root: {todos: { 1 : {text: 'Make todo list', completed: false }}}}),
      {type: 'MERGE_IN_ROOT_TODOS', value: { completed: true }, key: 1} 
    )).toEqual({root: {todos: { 1 : {text: 'Make todo list', completed: true }}}});
  });
});