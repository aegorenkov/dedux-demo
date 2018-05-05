// describe('Object_String', () => {
//   let reducer;
//   before(() => {
//     reducer = (state = {}, action) => {
//       switch (action.type) {
//         default:
//           return state;
//       }
//     };
//     reducer = Deduce(reducer);
//   });
//   it('INCREMENT', () => {
//     expect(reducer({ a: 1, b: 2 }, {
//       type: 'INCREMENT',
//       value: 3,
//       key: 'b'
//     })).toEqual({ a: 1, b: 5 });
//   });
//   it('DECREMENT', () => {
//     expect(reducer({ a: 1, b: 2 }, {
//       type: 'DECREMENT',
//       value: 3,
//       key: 'b'
//     })).toEqual({ a: 1, b: -1 });
//   });
//   it('INCREMENT_PATH', () => {
//     expect(reducer({ a: 1, b: 2 }, { type: 'INCREMENT_A', value: 3 })).toEqual({ a: 4, b: 2 });
//     expect(reducer({ a: 1, b: 2 }, { type: 'INCREMENT_B', value: 3 })).toEqual({ a: 1, b: 5 });
//     expect(reducer({ A: 1, b: 2 }, { type: 'INCREMENT_A', value: 3 })).toEqual({ A: 4, b: 2 });
//   });
//   it('TOGGLE_PATH', () => {
//     expect(reducer({ a: true, b: false }, { type: 'TOGGLE_A' })).toEqual({ a: false, b: false });
//     expect(reducer({ a: true, b: false }, { type: 'TOGGLE_B' })).toEqual({ a: true, b: true });
//     expect(reducer({ a: true, b: false }, { type: 'TOGGLE_C' })).toEqual({ a: true, b: false });
//   });
//   it('ADD_TO_PATH', () => {
//     expect(reducer(deepFreeze({ counts: [1, 2] }), { type: 'ADD_TO_COUNTS', value: 3 })).toEqual({ counts: [1, 2, 3] });
//     expect(reducer(deepFreeze({ widgets: [1, 2] }), { type: 'ADD_TO_WIDGETS', value: 4 })).toEqual({ widgets: [1, 2, 4] });
//   });
//   it('UPDATE_PATH', () => {
//     expect(reducer(
//       deepFreeze({ counts: [1, 2] }), 
//       { type: 'UPDATE_COUNTS', value: 3, where: (val) => val === 2 }
//     )).toEqual({ counts: [1, 3] });
//     expect(reducer(
//       deepFreeze({ widgets: [1, 2] }), 
//       { type: 'UPDATE_WIDGETS', value: 4, where: (val) => val === 1 }
//     )).toEqual({ widgets: [4, 2] });
//     expect(reducer(
//       deepFreeze({todos: [{ id: 1, text: 'Make todo list', completed: false }]}),
//       {type: 'UPDATE_TODOS', value: { completed: true }, where: (elem) => elem.id === 1} 
//     )).toEqual({todos: [{ id: 1, text: 'Make todo list', completed: true }]});
//     expect(reducer(
//       deepFreeze({root: {todos: [{ id: 1, text: 'Make todo list', completed: false }]}}),
//       {type: 'UPDATE_TODOS', value: { completed: true }, where: (elem) => elem.id === 1} 
//     )).toEqual({root: {todos: [{ id: 1, text: 'Make todo list', completed: true }]}});
//     expect(reducer(
//       deepFreeze({root: {todos: { 1 : {text: 'Make todo list', completed: false }}}}),
//       {type: 'UPDATE_TODOS', value: { completed: true }, key: 1} 
//     )).toEqual({root: {todos: { 1 : {text: 'Make todo list', completed: true }}}});
//   });
// });