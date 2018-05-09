import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { createStore } from 'redux';
import { createDevTools } from 'redux-devtools';
import configureStore from './configureStore'
import DevTools from './DevTools'
import { D as De } from 'dedux';
import { connect } from 'react-redux';

const store = configureStore(3)

const mapStateToProps = (state) => {
  return { state };
}
class App extends Component {
  constructor(props) {
    super(props);
    this.actionCreator = React.createRef();
    this.renderedState = React.createRef();
    this.dispatch = this.dispatch.bind(this);
    this.updateState = this.updateState.bind(this);
  }
  dispatch() {
    let D = De; // Rebind D in scope
    const action = eval(this.actionCreator.current.innerText)
    store.dispatch(action);
  }
  updateState() {
    let D = De; // Rebind D in scope
    const val = JSON.parse(this.renderedState.current.innerText);
    store.dispatch({type: 'UPDATE_STATE', value: val});
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Redux-Dedux</h1>
        </header>
        <main>
        <pre>
        <p className="action-creator" contentEditable="true" ref={this.actionCreator}>
          actionCreator
        </p>
        </pre>
        <button className="dispatch" onClick={this.dispatch}>Dispatch</button>
        <pre>
        <p className="state" onBlur={this.updateState}contentEditable="true" ref={this.renderedState}>
          { JSON.stringify(this.props.state) }
        </p>
        </pre>
        </main>

        <DevTools />
      </div>
    );
  }
}

App = connect(mapStateToProps)(App);
export { App, store }
