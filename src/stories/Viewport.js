import React from 'react'
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'

import {HotTableContainer} from '../lib'


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

const colHeaders = Array.from({length: cols}).map((v2, k2) => {
    return `col-${k2}`
})

storiesOf('Viewport', module)
    .add('plain', () => {
        const columnMapping = Array.from({length: cols}).map((v, k) => k)
        const hiddenColumns = []

        return (
            <HotTableContainer
                mode="debug" logger={action('debug')} columnMapping={columnMapping} hiddenColumns={hiddenColumns}
                data={data} columns={columns} colHeaders={colHeaders}
                width="800" height="250"
                columnSorting={true} sortIndicator={true}
                manualColumnMove={true}
                manualColumnResize={true}/>
        )
    })
    .add('hide column', () => {
        const columnMapping = Array.from({length: cols}).map((v, k) => k)
        const hiddenColumns = [1, 3]

        return (
            <HotTableContainer
                mode="debug" logger={action('debug')} columnMapping={columnMapping} hiddenColumns={hiddenColumns}
                data={data} columns={columns} colHeaders={colHeaders}
                width="800" height="250"
                columnSorting={true} sortIndicator={true}
                manualColumnMove={true}
                manualColumnResize={true}/>
        )
    })
