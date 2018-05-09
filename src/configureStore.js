import { createStore, applyMiddleware, compose } from 'redux';
import DevTools from './DevTools'
import { deduce } from 'dedux';

const rootReducer = function (state = {}, action) {
  switch (action.type) {
    case 'UPDATE_STATE':
      return action.value;
    default:
      return state;
  }
}

const enhancer = compose(
  DevTools.instrument()
)

export default function configureStore (initialState) {
  return createStore(deduce(rootReducer), initialState, enhancer);
}