const counter = (state = {}, action) => {
  switch (action.type) {
     default:
        return state;
  }
};

function switch_number(state, action) {
  switch(action.type) {
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
  switch(action.type) {
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
  switch(action.type) {
          case 'ADD':
            return [...state, action.value];
          case 'EDIT':
            return [
              ...state.slice(0, action.index), 
              action.value, 
              ...state.slice(action.index + 1)
            ];
          case 'REMOVE':
            return [
              ...state.slice(0, action.index), 
              ...state.slice(action.index + 1)
            ];
          default:
            return state;
        }
}

function switch_object(state, action) {
  switch(action.type) {
           case 'SET':
             return {...state, [action.key]: action.value};
          case 'REMOVE':
            object = {...state};
            delete object[action.key];
            return object;
          default:
            return state;
        }
}

function Deduce(reducer) {
  return function(state, action) {
    let update = reducer(state, action);
    if (update !== state) return update;
    if (typeof state === 'number') return switch_number(state, action);
    if (typeof state === 'boolean') return switch_boolean(state, action);
    if (Array.isArray(state)) return switch_array(state, action);
    if (typeof state === 'object') return switch_object(state, action);
  }
}

const Counter = ({
  value, 
  increment, 
  decrement,
  set,
  toggle,
  add,
  edit,
  remove
}) => (
  <div>
      <h1>{JSON.stringify(value)}</h1>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={set}>SET</button>
      <button onClick={toggle}>TOGGLE</button>
      <button onClick={add}>ADD</button>
      <button onClick={edit}>EDIT</button>
      <button onClick={remove}>REMOVE</button>
  </div>
)

const { createStore } = Redux

const store = createStore(Deduce(counter));

//store.dispatch({type : 'INCREMENT', value: 1})

const render = () => {
  ReactDOM.render(
    <Counter 
      value={store.getState()} 
      increment = { ()=> store.dispatch({type : 'INCREMENT', value: 1})}
      decrement = { ()=> store.dispatch({type : 'DECREMENT', value: 1})}
      //set = { ()=> store.dispatch({type : 'SET', value: true})}
      toggle = { ()=> store.dispatch({type : 'TOGGLE'})}
      add = { ()=> store.dispatch({type : 'ADD', value: 0})}
      edit = { ()=> store.dispatch({type : 'EDIT', value: 4, index: 0})}
//      remove = { ()=> store.dispatch({type : 'REMOVE', value: 4, index: 0})}
      set = { ()=> store.dispatch({type : 'SET', value: true, key:'test'})}
      remove = { ()=> store.dispatch({type : 'REMOVE', key: 'test'})}
    />, 
    document.getElementById("root")
  );
}

store.subscribe(render);
render();
