import escape from 'escape-string-regexp'

export function compareSoft (val1, val2) {
  return new RegExp(escape(val1 || ''), 'i').test(val2 || '')
}

export function compareHard (val1, val2) {
  return new RegExp(`^${escape(val1 || '')}$`, 'i').test(val2 || '')
}
