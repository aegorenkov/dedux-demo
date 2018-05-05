function switch_number(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      if (typeof action.value !== 'number') {
        throw new Error(`${action.type} expected number value`);
      }
      return state + action.value;
    case 'DECREMENT':
      if (typeof action.value !== 'number') {
        throw new Error(`${action.type} expected number value`);
      }
      return state - action.value;
    case 'SET':
      if (typeof action.value !== 'number') {
        throw new Error(`${action.type} expected number value`);
      }
      return action.value;
    default:
      return state;
  }
}

function switch_boolean(state, action) {
  switch (action.type) {
    case 'SET':
      if (typeof action.value !== 'boolean') {
        throw new Error(`${action.type} expected boolean value`);
      }
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
    default:
      return state;
  }
}

function switch_object(state, action) {
  let locations = {};
  let verb;
  let path;
  Object.keys(state).forEach((location) => {
    locations[location.toUpperCase()] = location;
  });
  const findLocation = (key) => locations[key];
  const parsed = action.type.match(/^(.+?)_(.+)+$/)
  if (parsed) {
    verb = parsed[1];
    path = findLocation(parsed[2]);
  }
  if (parsed) {
    if (!state.hasOwnProperty(path)) return { ...state };
    if(verb === 'INCREMENT') return { ...state, [path]: state[path] + action.value };
    if (verb === 'TOGGLE') return { ...state, [path]: !state[path]};
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