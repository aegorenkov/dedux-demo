function dfs(target, prevKey, obj, callback, path='') {
  if (prevKey !== '') path += (path ? '_': '') + prevKey.toUpperCase();
  if (prevKey.toUpperCase() === target) {
    callback(path)
  } else {
    if (typeof obj !== 'object') return;
    for (let key of Object.keys(obj)) {
      dfs(target, key, obj[key], callback, path)
    }
  }
}

function findPath(path, obj) {
  let paths = [];
  dfs(path, '', obj, (p) => paths.push(p))
  return paths;
}

module.exports = findPath;