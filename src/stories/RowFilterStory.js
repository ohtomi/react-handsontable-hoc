import React from 'react'
import {action} from '@storybook/addon-actions'

import {Expressions, HotTableContainer, RowFilter} from '../lib'


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

const names = 'oo'.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[^\uD800-\uDFFF]/g) // matches 'volvo' or 'toyota'

const filter = new RowFilter([
    {
        physical: 1,
        expression: Expressions.byFunction((value) => {
            if (!names.length) {
                return true
            }

            const reduced = names.reduce((accum, name) => {
                const result = accum.value.indexOf(name + '')
                if (result !== -1) {
                    return {value: accum.value.substring(result + 1), position: result}
                } else {
                    return {value: '', position: result}
                }
            }, {value: value + '', position: 0})

            return reduced.position !== -1
        })
    }
])

export const RowFilterStory = () => {
    return (
        <div>
            <HotTableContainer
                mode="debug" logger={action('RowFilterStory')}
                data={data} columns={columns} colHeaders={colHeaders}
                width="800" height="350"
                rowFilter={filter}
                colHeaderButtonClassName={'row-filter-story'}
                afterRowFiltering={action('afterRowFiltering')}
                onClickColHeaderButton={action('onClickColHeaderButton')}
            />
        </div>
    )
}
