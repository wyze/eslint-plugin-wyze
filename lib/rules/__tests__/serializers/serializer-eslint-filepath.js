'use strict'

const cwd = process.cwd()
const replace = new RegExp(cwd, 'g')
const isObject = val => val !== null && typeof val === 'object'

module.exports = {
  print( val, serialize ) {
    return serialize(
      Object.assign(
        {},
        val,
        { filePath: val.filePath.replace(replace, '..') }
      )
    )
  },
  test( val ) {
    return isObject(val) && val.filePath && val.filePath.indexOf(cwd) > -1
  },
}
