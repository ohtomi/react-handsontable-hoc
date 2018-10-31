import React from 'react'
import {render} from 'react-dom'
import {HotTableContainer, RowFilter, Expressions} from './lib'

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

// column order: ID, YEAR, VOLUME, PROCESSED?, NAME
const columnMapping = [0, 2, 3, 4, 1]

// VOLUME is hidden
const hiddenColumns = [3]

// sort by NAME
const columnSorting = {
    column: 4,
    sortOrder: false
}

// filter by NAME
const filter = new RowFilter([
    {
        physical: 1,
        expression: Expressions.get({
            symbol: 'by_values',
            props: ['ford', 'volvo']
        })
    }
])

const App = () => (
    <HotTableContainer
        width="800" height="300"
        data={data} columns={columns} colHeaders={colHeaders}
        columnMapping={columnMapping} hiddenColumns={hiddenColumns}
        columnSorting={columnSorting} sortIndicator={true}
        manualColumnMove={true}
        manualColumnResize={true}
        rowFilter={filter}/>
)

render(<App/>, document.getElementById('root'))
