const actionTypeParser = require('./functions/actionTypeParser');
const updateAtPath = require('./functions/updateAtPath');

function switch_number(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + action.value;
    case 'DECREMENT':
      return state - action.value;
    case 'SET':
      return action.value;
    default:
      return state;
  }
}

function switch_boolean(state, action) {
  switch (action.type) {
    case 'SET':
      return action.value;
    case 'TOGGLE':
      return !state;
    default:
      return state;
  }
}

function switch_array(state, action) {
  switch (action.type) {
    case 'ADD':
      return [...state, action.value];
    case 'REMOVE':
      if (action.index === undefined) action.index = state.length - 1;
      return [
        ...state.slice(0, action.index),
        ...state.slice(action.index + 1)
      ];
    case 'SET':
      return [
        ...state.slice(0, action.index),
        action.value,
        ...state.slice(action.index + 1)
      ];
    case 'SET_ALL':
      return state.map((val) => action.value);
    case 'INCREMENT':
      return [
        ...state.slice(0, action.index),
        state[action.index] + action.value,
        ...state.slice(action.index + 1)
      ];
    case 'DECREMENT':
      return [
        ...state.slice(0, action.index),
        state[action.index] - action.value,
        ...state.slice(action.index + 1)
      ];
    case 'INSERT':
      return [
        ...state.slice(0, action.index),
        action.value,
        ...state.slice(action.index)
      ];
    case 'INCREMENT_ALL':
      return state.map(value => value + action.value);
    case 'DECREMENT_ALL':
      return state.map(value => value - action.value);
    case 'UPDATE':
      return state.map(value => {
        if (action.where(value)) return action.value;
        return value;
      })
    default:
      return state;
  }
}

function switch_object(state, action) {
  let { verb, path } = actionTypeParser(action.type);

  if (path) {
    if (!updateAtPath(path, state, (el) => el)) return { ...state };
    if (verb === 'INCREMENT') return updateAtPath(path, state, (number) => number + action.value);
    if (verb === 'TOGGLE') return updateAtPath(path, state, (bool) => !bool);
    if (verb === 'UPDATE') {
      return updateAtPath(path, state, (obj) => {
        if (Array.isArray(obj)) {
          return obj.map(value => {
            if (action.where(value)) {
              // Special case to merge object props instead of setting the value.
              if (typeof value === 'object') return Object.assign({ ...value }, action.value);
              return action.value;
            }
            return value;
          });
        }
        if (typeof obj === 'object') {
          if (action.key && typeof action.value === 'object') return { ...obj, [action.key]: Object.assign({ ...obj[action.key] }, action.value) };
          if (action.key) return { ...obj, [action.key]: action.value };
        }
      });
    }
    if (verb === 'ADD_TO') {
      return updateAtPath(path, state, (arr) => [...arr, action.value])
    }
  }

  switch (action.type) {
    case 'SET':
      return { ...state, [action.key]: action.value };
    case 'REMOVE':
      object = { ...state };
      delete object[action.key];
      return object;
    case 'INCREMENT':
      return { ...state, [action.key]: state[action.key] + action.value };
    case 'DECREMENT':
      return { ...state, [action.key]: state[action.key] - action.value };
    default:
      return state;
  }
}

function Deduce(reducer) {

  return function (state, action) {
    let update = reducer(state, action);
    if (update !== state) return update;
    if (typeof state === 'number') return switch_number(state, action);
    if (typeof state === 'boolean') return switch_boolean(state, action);
    if (Array.isArray(state)) return switch_array(state, action);
    if (typeof state === 'object') return switch_object(state, action);
  }
}

module.exports = Deduce;