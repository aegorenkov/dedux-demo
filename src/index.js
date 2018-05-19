const actionTypeParser = require('./functions/actionTypeParser');
const updateAtPath = require('./functions/updateAtPath');
const findPath = require('./functions/findPath');
const processState = require('./proxy')
const checkForEntities = require('./functions/checkForEntities')
const { replace } = require('./symbols')
const getPath = (path, state) => {
  const paths = findPath(path, state);
  if (paths.length === 0) throw new Error('Path not found.');
  if (paths.length > 1) throw new Error('Path not unique, try a longer path specification.');
  return paths[0].split('_');
}

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
    case 'REMOVE_IN':
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
    case 'SET_IN':
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
    case 'TOGGLE_IN':
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
    case 'INCREMENT_IN':
      if (action.index !== undefined) {
        return [
          ...state.slice(0, action.index),
          state[action.index] + action.value,
          ...state.slice(action.index + 1)
        ];
      }
      if (action.where !== undefined) {
        return state.map((el) => {
          if (action.where(el)) return el + action.value;
          return el;
        });
      }
    case 'DECREMENT_IN':
      if (action.index !== undefined) {
        return [
          ...state.slice(0, action.index),
          state[action.index] - action.value,
          ...state.slice(action.index + 1)
        ];
      }
      if (action.where !== undefined) {
        return state.map((el) => {
          if (action.where(el)) return el - action.value;
          return el;
        });
      }
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
    case 'MERGE_ALL':
      return state.map((obj) => {
        return Object.assign({ ...obj }, action.value);
      });
    case 'MERGE_IN':
      if (action.index !== undefined) {
        return [...state.slice(0, action.index),
        Object.assign({ ...state[action.index] }, action.value),
        ...state.slice(action.index + 1)
        ];
      }
      if (action.where !== undefined) {
        return state.map((obj) => {
          if (action.where(obj)) return Object.assign({ ...obj }, action.value);
          return obj;
        });
      }

    default:
      return state;
  }
}

function switch_object(state, action) {
  let { verb, path } = actionTypeParser(action.type);
  let newObj = {}

  if (path) {
    //if (!updateAtPath(getPath(path, state), state, (el) => el)) return { ...state };
    if (verb === 'SET') {
      if (action.key !== undefined) {
        return updateAtPath(getPath(path, state), state, (obj) => { return { ...obj, [action.key]: action.value } });
      }
      if (action.where !== undefined) {
        return updateAtPath(getPath(path, state), state, (obj) => {
          //const newObj = {};
          Object.entries(obj).forEach(([key, val]) => {
            if (action.where(key, val)) {
              newObj[key] = action.value;
            } else {
              newObj[key] = val;
            }
          });
          return newObj;
        });
      }
      return updateAtPath(getPath(path, state), state, () => action.value)
    }
    if (verb === 'INCREMENT_ALL') return updateAtPath(getPath(path, state), state, (arr) => arr.map(num => num + action.value));
    if (verb === 'INCREMENT_IN') {
      if (action.index !== undefined) {
        return updateAtPath(getPath(path, state), state, (arr) => {
          return [...arr.slice(0, action.index), arr[action.index] + action.value, ...arr.slice(action.index + 1)];
        });
      }
      if (action.where !== undefined) {
        return updateAtPath(getPath(path, state), state, (arr) => {
          return arr.map((el) => {
            if (action.where(el)) return el + action.value;
            return el;
          })
        });
      }
    }
    if (verb === 'DECREMENT_ALL') return updateAtPath(getPath(path, state), state, (arr) => arr.map(num => num - action.value));
    if (verb === 'DECREMENT_IN') {
      if (action.index !== undefined) {
        return updateAtPath(getPath(path, state), state, (arr) => {
          return [...arr.slice(0, action.index), arr[action.index] - action.value, ...arr.slice(action.index + 1)];
        });
      }
      if (action.where !== undefined) {
        return updateAtPath(getPath(path, state), state, (arr) => {
          return arr.map((el) => {
            if (action.where(el)) return el - action.value;
            return el;
          })
        });
      }
    }
    if (verb === 'INCREMENT') return updateAtPath(getPath(path, state), state, (number) => number + action.value);
    if (verb === 'DECREMENT') return updateAtPath(getPath(path, state), state, (number) => number - action.value);
    if (verb === 'TOGGLE') {
      return updateAtPath(getPath(path, state), state, (bool) => !bool);
    }
    if (verb === 'TOGGLE_IN') {
      if (action.index !== undefined) {
        return updateAtPath(getPath(path, state), state, (obj) => {
          return [...obj.slice(0, action.index), !obj[action.index], ...obj.slice(action.index + 1)]
        });
      }
      if (action.key !== undefined) {
        return updateAtPath(getPath(path, state), state, (obj) => {
          return { ...obj, [action.key]: !obj[action.key] }
        })
      }
      if (action.where !== undefined) {
        return updateAtPath(getPath(path, state), state, (obj) => {
          if (Array.isArray(obj)) {
            return obj.map((el) => {
              if (action.where(el)) return !el;
              return el;
            });
          }
          //const newObj = {};
          Object.entries(obj).forEach(([key, val]) => {
            if (action.where(key, val)) {
              newObj[key] = !val;
            } else {
              newObj[key] = val;
            }
          });
          return newObj;
        });
      }
    }

    if (verb === 'MERGE') {
      return updateAtPath(getPath(path, state), state, (obj) => {
        return Object.assign({ ...obj }, action.value)
      })
    }

    if (verb === 'MERGE_IN') {
      return updateAtPath(getPath(path, state), state, (obj) => {
        if (Array.isArray(obj)) {
          if (action.index) {
            let newState = [...obj];
            newState[action.index] = Object.assign({ ...newState[action.index] }, action.value);
            return newState;
          }

          if (action.where) {
            return obj.map(value => {
              if (action.where(value)) {
                // Special case to merge object props instead of setting the value.
                if (typeof value === 'object') return Object.assign({ ...value }, action.value);
                return action.value;
              }
              return value;
            });
          }
        }
        if (typeof obj === 'object') {
          if (action.key !== undefined && typeof action.value === 'object') return { ...obj, [action.key]: Object.assign({ ...obj[action.key] }, action.value) };
          if (action.key !== undefined) return { ...obj, [action.key]: action.value };
          if (action.where !== undefined) {
            //const newObj = {};
            Object.entries(obj).forEach(([key, subObj]) => {
              if (action.where(key, subObj)) {
                newObj[key] = Object.assign({ ...subObj }, action.value);
              }
              else newObj[key] = { ...subObj }
            })
            return newObj;
          }
        }
      });
    }
    if (verb === 'MERGE_ALL') {
      return updateAtPath(getPath(path, state), state, (obj) => {
        //const newObj = {};
        Object.entries(obj).forEach(([key, subObj]) => {
          if (Array.isArray(subObj)) newObj[key] = [...subObj]
          else newObj[key] = Object.assign({ ...subObj }, action.value);
        })
        return newObj;
      });
    }
    if (verb === 'ADD_TO') {
      return updateAtPath(getPath(path, state), state, (arr) => [...arr, action.value]);
    }
    if (verb === 'INSERT_IN') {
      return updateAtPath(getPath(path, state), state, (arr) => [...arr.slice(0, action.index), action.value, ...arr.slice(action.index)]);
    }
    if (verb === 'REMOVE_ALL') {
      return updateAtPath(getPath(path, state), state, (arr) => []);
    }
    if (verb === 'REMOVE_FROM') {
      if (action.index !== undefined) {
        return updateAtPath(getPath(path, state), state, (arr) => [...arr.slice(0, action.index), ...arr.slice(action.index + 1)]);
      }
      if (action.where !== undefined) {
        return updateAtPath(getPath(path, state), state, (arr) => arr.filter(el => !action.where(el)));
      }
    }
    if (verb === 'SET_ALL') {
      return updateAtPath(getPath(path, state), state, (arr) => arr.map(el => action.value));
    }
    if (verb === 'SET_IN') {
      if (action.index !== undefined) {
        return updateAtPath(getPath(path, state), state, (arr) => [...arr.slice(0, action.index), action.value, ...arr.slice(action.index + 1)]);
      }
      if (action.where !== undefined) {
        return updateAtPath(getPath(path, state), state, (arr) => {
          return arr.map((el) => {
            if (action.where(el)) return action.value;
            return el;
          });
        });
      }
    }
    if (verb === 'TOGGLE_ALL') {
      return updateAtPath(getPath(path, state), state, (arr) => arr.map(bool => !bool));
    }
  }
  switch (action.type) {
    case 'SET_ALL':
      Object.keys(state).forEach((key) => {
        newObj[key] = action.value
      });
      return newObj;
    case 'SET_IN':
      if (action.key !== undefined) {
        return { ...state, [action.key]: action.value };
      }
      if (action.where !== undefined) {
        Object.entries(state).forEach(([key, val]) => {
          if (action.where(key, val)) {
            newObj[key] = action.value;
          } else {
            newObj[key] = val;
          }
        });
        return newObj;
      }
    case 'MERGE_IN':
      if (action.value) {
        Object.entries(state).forEach(([key, subObj]) => {
          newObj[key] = { ...subObj, ...action.value }
        })
        return newObj
      }
    case 'MERGE_ALL':
      {
        newObj = {};
        Object.entries(state).forEach(([key, subObj]) => {
          newObj[key] = Object.assign({ ...subObj }, action.value);
        });
        return newObj;
      }
    case 'MERGE':
      return Object.assign({ ...state }, action.value);
    case 'REMOVE_ALL':
      return {};
    case 'REMOVE_IN':
      if (action.key !== undefined) {
        newObj = { ...state };
        delete newObj[action.key];
        return newObj;
      }
      if (action.where !== undefined) {
        //let newObj = {};
        Object.entries(state).forEach(([key, val]) => {
          if (!action.where(key, val)) newObj[key] = val;
        });
        return newObj;
      }
    case 'INCREMENT_IN':
      return { ...state, [action.key]: state[action.key] + action.value };
    case 'DECREMENT_IN':
      return { ...state, [action.key]: state[action.key] - action.value };
    case 'TOGGLE_ALL':
      //let newObj = {};
      Object.entries(state).forEach(([key, value]) => {
        newObj[key] = !value;
      });
      return newObj;
    default:
      return state;
  }
}

// function Deduce(reducer) {
//   return function (state, action) {
//     let update = reducer(state, action);
//     if (update !== state) return update;
//     if (typeof state === 'number') {
//       return switch_number(state, action);
//     }
//     if (typeof state === 'boolean') {
//       closedState = switch_boolean(state, action);
//       return closedState;
//     }
//     if (typeof state === 'string') {
//       closedState = switch_string(state, action);
//       return closedState;
//     }
//     if (Array.isArray(state)) {
//       closedState = switch_array(state, action);
//       return closedState;
//     }
//     if (typeof state === 'object') {
//       closedState = switch_object(state, action);;
//       return closedState;
//     }
//   }
// }
function checkPath(path, state) {
  if (path) {
    let paths = findPath(path, state);
    if (paths.length === 0) throw new Error(`Path: ${path} could not be found.`);
    if (paths.length > 1) throw new Error(`Multiple valid paths found. Use a longer path to ensure a unique selection.`)
  }
}
function validatePayload(action, payload, required) {
  if (!payload) return;
  if (required.includes('value') && !('value' in payload)) {
    throw new Error(`${action} should include a value property in the payload.`)
  }
  if (required.includes('in')
    && payload.index === undefined
    && payload.key === undefined
    && payload.where === undefined) {
    throw new Error(`${action} should include either a key, index, or where property in the payload.`)
  }
  if (required.includes('index') && payload.index === undefined) {
    throw new Error(`${action} should include either a key or index property in the payload.`)
  }
}
function handleAction(action, config, required, state) {
  if (!config) throw new Error('All actions need to have a configuration object.');
  checkPath(config.path, state);
  validatePayload(action, config, required);
  // Final configuration for action
  let path = config.path;
  delete config['path'];
  if (path) return Object.assign({ type: `${action}_${path}` }, config);
  return Object.assign({ type: action }, config);
}

class Actions {
  constructor(closedState) {
    this.closedState = closedState;
  }
  SET_ALL(config) {
    return handleAction('SET_ALL', config, ['value'], this.closedState.state);
  }
  SET_IN(config) {
    return handleAction('SET_IN', config, ['value', 'in'], this.closedState.state);
  }
  SET(config) {
    return handleAction('SET', config, ['value'], this.closedState.state);
  }
  INCREMENT_ALL(config) {
    return handleAction('INCREMENT_ALL', config, ['value'], this.closedState.state);
  }
  INCREMENT_IN(config) {
    return handleAction('INCREMENT_IN', config, ['value', 'in'], this.closedState.state);
  }
  INCREMENT(config) {
    return handleAction('INCREMENT', config, ['value'], this.closedState.state);
  }
  DECREMENT_ALL(config) {
    return handleAction('DECREMENT_ALL', config, ['value'], this.closedState.state);
  }
  DECREMENT_IN(config) {
    return handleAction('DECREMENT_IN', config, ['value', 'in'], this.closedState.state);
  }
  DECREMENT(config) {
    return handleAction('DECREMENT', config, ['value'], this.closedState.state);
  }
  TOGGLE_ALL(config) {
    return handleAction('TOGGLE_ALL', config, [], this.closedState.state);
  }
  TOGGLE_IN(config) {
    return handleAction('TOGGLE_IN', config, ['in'], this.closedState.state);
  }
  TOGGLE(config) {
    return handleAction('TOGGLE', config, [], this.closedState.state);
  }
  ADD_TO(config) {
    return handleAction('ADD_TO', config, ['value'], this.closedState.state);
  }
  ADD(config) {
    return handleAction('ADD', config, ['value'], this.closedState.state);
  }
  INSERT_IN(config) {
    return handleAction('INSERT_IN', config, ['value', 'in'], this.closedState.state);
  }
  INSERT(config) {
    return handleAction('INSERT', config, ['value'], this.closedState.state);
  }
  REMOVE_ALL(config) {
    return handleAction('REMOVE_ALL', config, [], this.closedState.state);
  }
  REMOVE_IN(config) {
    return handleAction('REMOVE_IN', config, ['in'], this.closedState.state);
  }
  REMOVE(config) {
    return handleAction('REMOVE', config, [], this.closedState.state);
  }
  MERGE_ALL(config) {
    return handleAction('MERGE_ALL', config, ['value'], this.closedState.state);
  }
  MERGE_IN(config) {
    return handleAction('MERGE_IN', config, ['value', 'in'], this.closedState.state);
  }
  MERGE(config) {
    return handleAction('MERGE', config, ['value'], this.closedState.state);
  }
}

class Container {
  constructor() {
    this.closedState = {};
    this.deduce = (reducer) => {
      const initialState = reducer(undefined, {})
      const shouldNormalize = checkForEntities(initialState)
      let proxied = shouldNormalize && processState(initialState)
      return (state, action) => {
        let update = reducer(state, action);
        proxied = shouldNormalize ? proxied[replace](update) : update
        this.closedState.state = proxied;
        if (proxied !== state) return proxied;
        if (typeof state === 'number') {
          this.closedState.state = switch_number(state, action)
          return this.closedState.state;
        }
        if (typeof state === 'boolean') {
          this.closedState.state = switch_boolean(state, action);
          return this.closedState.state;
        }
        if (typeof state === 'string') {
          this.closedState.state = switch_string(state, action);
          return this.closedState.state;
        }
        if (Array.isArray(state)) {
          this.closedState.state = switch_array(state, action);
          return this.closedState.state;
        }
        if (typeof state === 'object') {
          this.closedState.state = switch_object(state, action);
          return this.closedState.state;
        }
      }
    };
    this.actions = new Actions(this.closedState);
  }
}

const container = new Container();
module.exports = {
  deduce: container.deduce,
  D: container.actions
};