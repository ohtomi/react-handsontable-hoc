import * as Expressions from './Expression'


it('evaluate by single value', () => {
    const expression = Expressions.get({symbol: 'by_values', props: ['abc']})
    expect(expression.evaluate('abc')).toEqual(true)
    expect(expression.evaluate('ABC')).toEqual(false)
})

it('evaluate by multiple values', () => {
    const expression = Expressions.get({symbol: 'by_values', props: ['abc', 'xyz']})
    expect(expression.evaluate('abc')).toEqual(true)
    expect(expression.evaluate('ABC')).toEqual(false)
    expect(expression.evaluate('xyz')).toEqual(true)
    expect(expression.evaluate('XYZ')).toEqual(false)
})

it('byValues factory', () => {
    const expression = Expressions.byValues(['abc'])
    expect(expression.evaluate('abc')).toEqual(true)
    expect(expression.evaluate('ABC')).toEqual(false)
})

it('FilterByValues constructor', () => {
    const expression = new Expressions.FilterByValues('filter_by_values', ['abc'])
    expect(expression.evaluate('abc')).toEqual(true)
    expect(expression.evaluate('ABC')).toEqual(false)
})

it('evaluate by function', () => {
    const func = (value) => value === 'abc'
    const expression = Expressions.get({symbol: 'by_function', props: func})
    expect(expression.evaluate('abc')).toEqual(true)
    expect(expression.evaluate('ABC')).toEqual(false)
})

it('byFunction factory', () => {
    const func = (value) => value === 'abc'
    const expression = Expressions.byFunction(func)
    expect(expression.evaluate('abc')).toEqual(true)
    expect(expression.evaluate('ABC')).toEqual(false)
})

it('FilterByFunction constructor', () => {
    const func = (value) => value === 'abc'
    const expression = new Expressions.FilterByFunction('filter_by_function', func)
    expect(expression.evaluate('abc')).toEqual(true)
    expect(expression.evaluate('ABC')).toEqual(false)
})
