// @flow

import React from 'react'
import Handsontable from 'handsontable'
import {HotTable} from '@handsontable/react'

// import type {Column} from './HandsontableTypes'
import {RowFilter} from './RowFilter'

import 'handsontable/dist/handsontable.full.css'


type propsType = {
    mode?: 'production' | 'debug' | '',
    logger?: (messages: Iterator<any>) => void,
    data: Array<Array<any>> | Array<any> | () => Array<Array<any>> | Array<any>,
    colHeaders: Array<string> | boolean | (index: number) => any,
    rowFilter?: RowFilter,
    colHeaderButtonClassName?: string,
    onClickColHeaderButton?: (ev: MouseEvent) => void
};

type stateType = {};

export class HotTableContainer extends React.Component<propsType, stateType> {

    props: propsType
    state: stateType

    hot: { current: { hotInstance: Handsontable } }

    constructor(props: propsType) {
        super(props)

        this.hot = React.createRef()
    }

    render() {
        const {mode, logger, data, colHeaders, ...otherProps} = this.props

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
            <HotTable
                ref={this.hot}
                mode={mode}
                logger={this.debug.bind(this)}
                data={data}
                data2={data2}
                colHeaders={colHeaders}
                colHeaders2={colHeaders}
                {...otherProps}
            />
        )
    }

    debug(...messages: any) {
        const {mode, logger} = this.props
        if (mode !== 'debug') {
            return
        }
        if (!logger) {
            return
        }
        const stringifier = (value) => typeof value === 'object' ? JSON.stringify(value) : value
        logger(...messages.map(stringifier))
    }

    hotInstance(): Handsontable {
        return this.hot.current.hotInstance
    }
}

export {Handsontable}
