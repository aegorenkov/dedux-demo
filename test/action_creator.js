const { D, dedux } = require('../src/index.js');

describe('Action creators', () => {
  describe('On Objects', () => {
    let reducer;
    before(() => {
      let initialState = {
        a: 1,
        b: 2
      }
      reducer = (state = initialState, action) => {
        switch (action.type) {
          default:
            return state;
        }
      };
      reducer = deduce(reducer);
      reducer(undefined, { type: '@@INIT' })
    });
    it('SET', () => {
      expect(D.SET({ path: 'A', value: 3 })).toEqual({ type: 'SET_A', value: 3 });
    });
  });
  describe('On shallow types', () => {
    before(() => {
      let initialState = 5;
      reducer = (state = initialState, action) => {
        switch (action.type) {
          default:
            return state;
        }
      };
      reducer = deduce(reducer);
      reducer(undefined, { type: '@@INIT' })
    });
    it('SET', () => {
      expect(D.SET({ value: 3 })).toEqual({ type: 'SET', value: 3 });
    });
  });
});