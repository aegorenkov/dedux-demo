const counter = (state = false, action) => {
  switch (action.type) {
     default:
        return state;
  }
};

function Deduce(reducer) {
  return function(state, action) {
    let update = reducer(state, action);
    if (update !== state) return update;
    if (typeof state === 'number') {
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
    if (typeof state === 'boolean') {
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
  }
}

const Counter = ({
  value, 
  increment, 
  decrement,
  set,
  toggle
}) => (
  <div>
      <h1>{value.toString()}</h1>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={set}>SET</button>
        <button onClick={toggle}>TOGGLE</button>

  </div>
)

const { createStore } = Redux

const store = createStore(Deduce(counter));

//store.dispatch({type : 'INCREMENT', value: 1})

const render = () => {
  ReactDOM.render(
    <Counter 
      value={store.getState()} 
      increment = { ()=>     
        store.dispatch({type : 'INCREMENT', value: 1})
      }
      decrement = { ()=>     
        store.dispatch({type : 'DECREMENT', value: 1})
      }
      set = { ()=>     
        store.dispatch({type : 'SET', value: true})
      }
      toggle = { ()=>     
        store.dispatch({type : 'TOGGLE'})
      }
    />, 
    document.getElementById("root")
  );
}

store.subscribe(render);
render();





