import React from 'react'
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'

import {HotTableContainer, RowFilter, Expressions} from '../lib'


const data = [
    {'id': 11, 'name': 'ford', 'year': 2015, 'volume': 1000, 'processed': true},
    {'id': 12, 'name': 'ford', 'year': 2016, 'volume': 1000, 'processed': true},
    {'id': 13, 'name': 'ford', 'year': 2017, 'volume': 1000, 'processed': true},
    {'id': 14, 'name': 'ford', 'year': 2018, 'volume': 1000, 'processed': false},
    {'id': 21, 'name': 'volvo', 'year': 2015, 'volume': 1000, 'processed': true},
    {'id': 22, 'name': 'volvo', 'year': 2016, 'volume': 1000, 'processed': true},
    {'id': 23, 'name': 'volvo', 'year': 2017, 'volume': 1000, 'processed': true},
    {'id': 24, 'name': 'volvo', 'year': 2017, 'volume': 1000, 'processed': false},
    {'id': 31, 'name': 'toyota', 'year': 2016, 'volume': 1000, 'processed': true},
    {'id': 32, 'name': 'toyota', 'year': 2017, 'volume': 1000, 'processed': true},
    {'id': 33, 'name': 'toyota', 'year': 2018, 'volume': 1000, 'processed': true},
    {'id': 41, 'name': 'honda', 'year': 2015, 'volume': 1000, 'processed': true}
]

const columns = [
    {data: 'id', type: 'numeric', width: 150, readOnly: true},
    {data: 'name', type: 'text', width: 150, readOnly: true},
    {data: 'year', type: 'numeric', width: 150, readOnly: true},
    {data: 'volume', type: 'numeric', width: 150, readOnly: true},
    {data: data => data.processed ? 'Yes' : 'No', type: 'text', width: 150, readOnly: true}
]

const colHeaders = ['ID', 'NAME', 'YEAR', 'VOLUME', 'PROCESSED?']

storiesOf('Row Filter', module)
    .add('plain', () => {
        const names = []

        const filter = new RowFilter([
            {
                physical: 1,
                expression: Expressions.byFunction((value) => {
                    if (!names.length) {
                        return true
                    }

                    const reduced = names.reduce((prev, name) => {
                        const result = prev.value.indexOf(name + '')
                        if (result !== -1) {
                            return {value: prev.value.substring(result + 1), position: result}
                        } else {
                            return {value: '', position: result}
                        }
                    }, {value: value + '', position: 0})

                    return reduced.position !== -1
                })
            }
        ])

        const onChange = (ev) => {
            const tokens = ev.target.value.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[^\uD800-\uDFFF]/g) || []
            names.splice(0)
            names.push(...tokens)
            filter.reevaluate()
        }

        return (
            <div>
                <HotTableContainer
                    mode="debug" logger={action('debug')}
                    data={data} columns={columns} colHeaders={colHeaders}
                    width="800" height="250"
                    columnSorting={true} sortIndicator={true}
                    manualColumnMove={true}
                    manualColumnResize={true}
                    rowFilter={filter}
                    onClickRowFilterIndicator={action('onClickRowFilterIndicator')}/>
                <label>NAME: <input type="text" onChange={onChange} autoFocus={true}/></label>
            </div>
        )
    })
