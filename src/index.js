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

function switch_string(state, action) {
  switch (action.type) {
    case 'SET':
      return action.value;
    default:
      return state;
  }
}

function switch_array(state, action) {
  switch (action.type) {
    case 'ADD':
      return [...state, action.value];
    case 'CONCAT':
      return [...state, ...action.value];
    case 'REMOVE_ALL':
      return [];
    case 'REMOVE':
      if (action.where !== undefined) {
        return state.filter((el) => !action.where(el));
      }
      if (action.index === undefined) action.index = state.length - 1;
      if (action.index !== undefined) {
        return [
          ...state.slice(0, action.index),
          ...state.slice(action.index + 1)
        ];
      }
    case 'SET':
      if (action.index !== undefined) {
        return [
          ...state.slice(0, action.index),
          action.value,
          ...state.slice(action.index + 1)
        ];
      }
      if (action.where !== undefined) {
        return state.map(el => {
          if (action.where(el)) return action.value;
          return el;
        });
      }
    case 'SET_ALL':
      return state.map((val) => action.value);
    case 'TOGGLE':
    if (action.index !== undefined) {
      return [
        ...state.slice(0, action.index),
        !state[action.index],
        ...state.slice(action.index + 1)
      ];
    }
    if (action.where !== undefined) {
      return state.map((el) => {
        if (action.where(el)) return !el;
        return el;
      })
    }
    case 'TOGGLE_ALL':
      return state.map((el) => !el);
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
  let { verb, path } = actionTypeParser(action.type);

  if (path) {
    if (!updateAtPath(path, state, (el) => el)) return { ...state };
    if (verb === 'SET') {
      if (action.key !== undefined) {
        return updateAtPath(path.split('_'), state, (obj) => {return { ...obj, [action.key]: action.value }});
      }
      if (action.where !== undefined) {
        return updateAtPath(path.split('_'), state, (obj) => {
          const newObj = {};
          Object.entries(obj).forEach(([key, val]) => {
            if (action.where(key, val)) {
              newObj[key] = action.value;
            } else {
              newObj[key] =  val;
            }
          });
          return newObj;
        });
      }
      return updateAtPath(path, state, () => action.value); 
    }
    if (verb === 'INCREMENT') return updateAtPath(path.split('_'), state, (number) => number + action.value);
    if (verb === 'TOGGLE') {
      if (action.key !== undefined) {
        return updateAtPath(path.split('_'), state, (obj) => {return { ...obj, [action.key]: !obj[action.key] }})
      }
      if (action.where !== undefined) {
        return updateAtPath(path.split('_'), state, (obj) => {
          const newObj = {};
          Object.entries(obj).forEach(([key, val]) => {
            if (action.where(key, val)) {
              newObj[key] = !val;
            } else {
              newObj[key] =  val;
            }
          });
          return newObj;
        });
      }
      return updateAtPath(path, state, (bool) => !bool);
    }
    if (verb === 'UPDATE') {
      return updateAtPath(path.split('_'), state, (obj) => {
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
    case 'SET_ALL':
      const newObj = {};
      Object.keys(state).forEach((key) => {
        newObj[key] = action.value
      });
      return newObj;
    case 'SET':
      if (action.key !== undefined) {
        return { ...state, [action.key]: action.value };
      }
      if (action.where !== undefined) {
        const newObj = {};
        Object.entries(state).forEach(([key, val]) => {
          if (action.where(key, val)) {
            newObj[key] = action.value;
          } else {
            newObj[key] =  val;
          }
        });
        return newObj;
      }
      case 'REMOVE_ALL':
      return {};
    case 'REMOVE':
    if (action.key !== undefined) {
      object = { ...state };
      delete object[action.key];
      return object;
    }
    if (action.where !== undefined) {
      const newObj = {};
      Object.entries(state).forEach(([key, val]) => {
        if (!action.where(key, val)) newObj[key] =  val;
      });
      return newObj;
    }
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
    if (typeof state === 'string') return switch_string(state, action);
    if (Array.isArray(state)) return switch_array(state, action);
    if (typeof state === 'object') return switch_object(state, action);
  }
}

module.exports = Deduce;