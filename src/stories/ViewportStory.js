import React from 'react'
import {action} from '@storybook/addon-actions'

import {HotTableContainer} from '../lib'


const rows = 50
const cols = 20


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

const colHeaders = true

export const ViewportStory = () => {
    return (
        <HotTableContainer
            mode="debug" logger={action('debug')}
            data={data} columns={columns} colHeaders={colHeaders}
            width="800" height="350"
        />
    )
}
