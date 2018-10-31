import {RowFilter} from './RowFilter'
import * as Expressions from './Expression'

const rows = 50
const cols = 15

const data = Array.from({length: rows}).map((v1, k1) => {
    return Array.from({length: cols}).map((v2, k2) => {
        const columnName = `col-${k2}`
        const columnValue = `${new Intl.NumberFormat().format(k1)}-${new Intl.NumberFormat().format(k2)}`
        return new Map().set(columnName, columnValue)
    }).reduce((prev, cell) => {
        Array.from(cell.keys()).forEach((name) => {
            prev[name] = cell.get(name)
        })
        return prev
    }, {})
})

const columns = Array.from({length: cols}).map((v2, k2) => {
    const columnName = `col-${k2}`
    return {
        data: columnName,
        type: 'text',
        width: 100,
        readOnly: true,
        wordWrap: false
    }
})


it('filter by values', () => {
    const filter = new RowFilter([
        {
            physical: 0,
            expression: Expressions.byValues(['0-0', '1-0'])
        }
    ])

    const filtered = filter.evaluate(data, columns)

    expect(filtered.length).toEqual(2)
    expect(filtered[0]['col-0']).toEqual('0-0')
    expect(filtered[1]['col-0']).toEqual('1-0')
})

it('filter by function', () => {
    const filter = new RowFilter([
        {
            physical: 0,
            expression: Expressions.byFunction(value => {
                return value === '0-0' || value === '1-0'
            })
        }
    ])

    const filtered = filter.evaluate(data, columns)

    expect(filtered.length).toEqual(2)
    expect(filtered[0]['col-0']).toEqual('0-0')
    expect(filtered[1]['col-0']).toEqual('1-0')
})

it('skip filtering', () => {
    const filter = new RowFilter([
        {
            physical: 0,
            expression: Expressions.byFunction(value => {
                return value <= '1-0'
            })
        }, {
            physical: 1,
            expression: Expressions.byFunction(value => {
                return value >= '1-1'
            })
        }
    ])

    {
        const filtered = filter.evaluate(data, columns)

        expect(filtered.length).toEqual(1)
        expect(filtered[0]['col-0']).toEqual('1-0')
    }
    {
        const filtered = filter.evaluate(data, columns, [0])

        expect(filtered.length).toEqual(49)
        expect(filtered[0]['col-0']).toEqual('1-0')
        expect(filtered[1]['col-0']).toEqual('2-0')
        expect(filtered[2]['col-0']).toEqual('3-0')
    }
})
