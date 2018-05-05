Deduce = require('../deduce/index.js');
expect = require('expect');
deepFreeze = require('deep-freeze');

describe('main', () => {
  describe('Number', () => {
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
    it('No change', () => {
      expect(reducer(0, { type: 'NOT_AN_ACTION' })).toEqual(0);
    });
    it('INCREMENT', () => {
      expect(reducer(0, { type: 'INCREMENT', value: 1 })).toEqual(1);
      expect(reducer(1, { type: 'INCREMENT', value: 1 })).toEqual(2);
      expect(reducer(1, { type: 'INCREMENT', value: 2 })).toEqual(3);
    });
    it('DECREMENT', () => {
      expect(reducer(0, { type: 'DECREMENT', value: 1 })).toEqual(-1);
      expect(reducer(2, { type: 'DECREMENT', value: 1 })).toEqual(1);
      expect(reducer(2, { type: 'DECREMENT', value: 2 })).toEqual(0);
    });
    it('SET', () => {
      expect(reducer(0, { type: 'SET', value: 6 })).toEqual(6);
    });
  });
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
      expect(reducer(false, { type: 'SET', value: true })).toEqual(true);
    });
    it('TOGGLE', () => {
      expect(reducer(false, { type: 'TOGGLE' })).toEqual(true);
    });
  });
  describe('Array', () => {
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
      expect(reducer([1, 2, 3], { type: 'ADD', value: 4 })).toEqual([1, 2, 3, 4]);
      expect(reducer([true, false], { type: 'ADD', value: true })).toEqual([true, false, true]);
      expect(reducer([{ id: 1 }], { type: 'ADD', value: { id: 2 } })).toEqual([{ id: 1 }, { id: 2 }]);
    });
    it('REMOVE', () => {
      expect(reducer([1, 2, 3], { type: 'REMOVE' })).toEqual([1, 2]);
      expect(reducer([true, false], { type: 'REMOVE', index: 0 })).toEqual([false]);
      expect(reducer([{ id: 1 }], { type: 'REMOVE' })).toEqual([]);
    });
    it('INCREMENT', () => {
      expect(reducer([1, 2, 3], {
        type: 'INCREMENT',
        value: 4,
        index: 1
      })).toEqual([1, 6, 3]);
    });
    it('INCREMENT_ALL', () => {
      expect(reducer([1, 2, 3], {
        type: 'INCREMENT_ALL',
        value: 4
      })).toEqual([5, 6, 7]);
    });
    it('DECREMENT', () => {
      expect(reducer([1, 6, 3], {
        type: 'DECREMENT',
        value: 4,
        index: 1
      })).toEqual([1, 2, 3]);
    });
    it('DECREMENT_ALL', () => {
      expect(reducer([1, 2, 3], {
        type: 'DECREMENT_ALL',
        value: 4
      })).toEqual([-3, -2, -1]);
    });
    it('SET', () => {
      expect(reducer([1, 2, 3], { type: 'SET', index: 0, value: 3 })).toEqual([3, 2, 3]);
      expect(reducer([false, false, true], { type: 'SET', index: 2, value: false })).toEqual([false, false, false]);
      expect(reducer([{ id: 2 }], { type: 'SET', index: 0, value: { id: 1 } })).toEqual([{ id: 1 }]);
    });
    it('SET_ALL', () => {
      expect(reducer([1, 2, 3], {
        type: 'SET_ALL',
        value: 2
      })).toEqual([2, 2, 2]);
    });
    it('INSERT', () => {
      expect(reducer([1, 2, 3], {
        type: 'INSERT',
        value: 4,
        index: 1
      })).toEqual([1, 4, 2, 3]);
    });
    it('UPDATE', () => {
      expect(reducer([1, 2, 3], {
        type: 'UPDATE',
        value: 4,
        where: (val) => val === 2, 
      })).toEqual([1, 4, 3]);
    });
  });
  describe('Object', () => {
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
    it('INCREMENT', () => {
      expect(reducer({ a: 1, b: 2 }, {
        type: 'INCREMENT',
        value: 3,
        key: 'b'
      })).toEqual({ a: 1, b: 5 });
    });
    it('DECREMENT', () => {
      expect(reducer({ a: 1, b: 2 }, {
        type: 'DECREMENT',
        value: 3,
        key: 'b'
      })).toEqual({ a: 1, b: -1 });
    });
    it('INCREMENT_PATH', () => {
      expect(reducer({ a: 1, b: 2 }, { type: 'INCREMENT_A', value: 3 })).toEqual({ a: 4, b: 2 });
      expect(reducer({ a: 1, b: 2 }, { type: 'INCREMENT_B', value: 3 })).toEqual({ a: 1, b: 5 });
      expect(reducer({ A: 1, b: 2 }, { type: 'INCREMENT_A', value: 3 })).toEqual({ A: 4, b: 2 });
    });
    it('TOGGLE_PATH', () => {
      expect(reducer({ a: true, b: false }, { type: 'TOGGLE_A' })).toEqual({ a: false, b: false });
      expect(reducer({ a: true, b: false }, { type: 'TOGGLE_B' })).toEqual({ a: true, b: true });
      expect(reducer({ a: true, b: false }, { type: 'TOGGLE_C' })).toEqual({ a: true, b: false });
    });
    it('ADD_TO_PATH', () => {
      expect(reducer(deepFreeze({ counts: [1, 2] }), { type: 'ADD_TO_COUNTS', value: 3 })).toEqual({ counts: [1, 2, 3] });
      expect(reducer(deepFreeze({ widgets: [1, 2] }), { type: 'ADD_TO_WIDGETS', value: 4 })).toEqual({ widgets: [1, 2, 4] });
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
        {type: 'UPDATE_TODOS', value: { completed: true }, where: (elem) => elem.id === 1} 
      )).toEqual({root: {todos: [{ id: 1, text: 'Make todo list', completed: true }]}});
      expect(reducer(
        deepFreeze({root: {todos: { 1 : {text: 'Make todo list', completed: false }}}}),
        {type: 'UPDATE_TODOS', value: { completed: true }, key: 1} 
      )).toEqual({root: {todos: { 1 : {text: 'Make todo list', completed: true }}}});
    });
  });
});
