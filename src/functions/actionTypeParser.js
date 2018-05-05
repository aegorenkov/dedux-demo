function actionTypeParser(actionType) {
  const validActions = [
    'SET_ALL',
    'SET',
    'INCREMENT_ALL',
    'INCREMENT',
    'DECREMENT_ALL',
    'DECREMENT',
    'TOGGLE',
    'ADD_TO',
    'ADD',
    'REMOVE',
    'UPDATE',
  ];
  let verb;
  let path;
  for (let action of validActions) {
    if (actionType.startsWith(action)) {
      verb = action;
      path = actionType.replace(verb, '').replace('_', '');
      return {verb, path}
    }
  }
  return {verb, path} // Undefined if no match
}

module.exports = actionTypeParser;