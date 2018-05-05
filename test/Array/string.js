// describe('Array_String', () => {
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
  
//   it('ADD', () => {
//     expect(reducer([true, false], { type: 'ADD', value: true })).toEqual([true, false, true]);
//     expect(reducer([1, 2, 3], { type: 'ADD', value: 4 })).toEqual([1, 2, 3, 4]);
//     expect(reducer([{ id: 1 }], { type: 'ADD', value: { id: 2 } })).toEqual([{ id: 1 }, { id: 2 }]);
//   });
//   it('REMOVE', () => {
//     expect(reducer([1, 2, 3], { type: 'REMOVE' })).toEqual([1, 2]);
//     expect(reducer([true, false], { type: 'REMOVE', index: 0 })).toEqual([false]);
//     expect(reducer([{ id: 1 }], { type: 'REMOVE' })).toEqual([]);
//   });
//   it('INCREMENT', () => {
//     expect(reducer([1, 2, 3], {
//       type: 'INCREMENT',
//       value: 4,
//       index: 1
//     })).toEqual([1, 6, 3]);
//   });
//   it('INCREMENT_ALL', () => {
//     expect(reducer([1, 2, 3], {
//       type: 'INCREMENT_ALL',
//       value: 4
//     })).toEqual([5, 6, 7]);
//   });
//   it('DECREMENT', () => {
//     expect(reducer([1, 6, 3], {
//       type: 'DECREMENT',
//       value: 4,
//       index: 1
//     })).toEqual([1, 2, 3]);
//   });
//   it('DECREMENT_ALL', () => {
//     expect(reducer([1, 2, 3], {
//       type: 'DECREMENT_ALL',
//       value: 4
//     })).toEqual([-3, -2, -1]);
//   });
//   it('SET', () => {
//     expect(reducer([1, 2, 3], { type: 'SET', index: 0, value: 3 })).toEqual([3, 2, 3]);
//     expect(reducer([false, false, true], { type: 'SET', index: 2, value: false })).toEqual([false, false, false]);
//     expect(reducer([{ id: 2 }], { type: 'SET', index: 0, value: { id: 1 } })).toEqual([{ id: 1 }]);
//   });
//   it('SET_ALL', () => {
//     expect(reducer([1, 2, 3], {
//       type: 'SET_ALL',
//       value: 2
//     })).toEqual([2, 2, 2]);
//   });
//   it('INSERT', () => {
//     expect(reducer([1, 2, 3], {
//       type: 'INSERT',
//       value: 4,
//       index: 1
//     })).toEqual([1, 4, 2, 3]);
//   });
//   it('UPDATE', () => {
//     expect(reducer([1, 2, 3], {
//       type: 'UPDATE',
//       value: 4,
//       where: (val) => val === 2,
//     })).toEqual([1, 4, 3]);
//   });
// });