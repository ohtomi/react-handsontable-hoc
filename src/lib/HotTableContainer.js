// @flow

import React from 'react'
import Handsontable from 'handsontable'
import {HotTable} from '@handsontable/react'

import type {
    HotTableColHeaders,
    HotTableColumns,
    HotTableColumnSorting,
    HotTableColumnSortingObject,
    HotTableData
} from './HandsontableTypes'
import {RowFilter} from './RowFilter'

import 'handsontable/dist/handsontable.full.css'


type propsType = {
    ref?: { current: any },
    id?: string,
    persistentState?: boolean,
    mode?: 'production' | 'debug' | '',
    logger?: (messages: Iterator<any>) => void,
    data: HotTableData,
    columns: HotTableColumns,
    colHeaders: HotTableColHeaders,
    width?: number,
    height?: number,
    manualColumnMove?: boolean | Array<number>,
    selectionMode?: 'row' | 'cell' | 'range',
    afterRowSelection?: (rows: Array<number>) => void,
    columnSorting?: HotTableColumnSorting,
    initialColumnSorting?: HotTableColumnSortingObject,
    manualColumnsHide?: Array<number>,
    manualColumnResize?: boolean | Array<number>,
    rowFilter?: RowFilter,
    colHeaderButtonClassName?: string,
    afterRowFiltering?: (countRows: number) => void,
    onClickColHeaderButton?: (ev: MouseEvent) => void
};

export const HotTableContainer = React.forwardRef((props: propsType, ref: { current: any }) => {
    const {mode, logger, data, colHeaders} = props

    const debug = (...messages: any) => {
        if (mode !== 'debug') {
            return
        }
        if (!logger) {
            return
        }
        const stringifier = (value) => typeof value === 'object' ? JSON.stringify(value) : value
        logger(...messages.map(stringifier))
    }

    const toData2 = (values) => {
        return values.map((value, index) => {
            if (Array.isArray(value)) {
                // value is array
                return value.concat(index)
            } else {
                // value is object
                return Object.assign(value, {'__index__': index})
            }
        })
    }
    const data2 = Array.isArray(data) ? toData2(data) : toData2(data())

    return (
        <HotTable ref={ref} {...props} logger={debug} data2={data2} colHeaders2={colHeaders}/>
    )
})

export {Handsontable}
