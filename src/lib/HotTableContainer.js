// @flow

import React from 'react'
import Handsontable from 'handsontable'
import {HotTable} from '@handsontable/react'

import type {Column} from './HandsontableTypes'
import type {PhysicalToExpression, Reevaluator} from './RowFilter'
import {RowFilter} from './RowFilter'

import 'handsontable/dist/handsontable.full.css'


type propsType = {
    mode?: 'production' | 'debug' | '',
    logger?: (messages: Iterator<any>) => void,
    data: Array<any>,
    columns: Array<Column>,
    rowHeaders?: boolean,
    selectionMode?: 'cell' | 'row',
    beforeOnCellMouseDown?: (ev: MouseEvent, coords: { row: number }, td: HTMLElement) => void,
    afterSelection?: (r1: number, c1: number, r2: number, c2: number, preventScrolling: { value: boolean }) => void,
    afterUpdateSettings?: (settings: any) => void,
    rowFilter?: RowFilter,
    rowFilterIndicatorClassName?: string,
    onClickRowFilterIndicator?: (ev: MouseEvent, column: number) => void
};

type stateType = {
    data: ?Array<any>,
    maxRows: number
};

export class HotTableContainer extends React.Component<propsType, stateType> {

    props: propsType
    state: stateType

    selectingCells: boolean
    hot: { current: { hotInstance: Handsontable } }

    constructor(props: propsType) {
        super(props)

        this.hot = React.createRef()

        const reevaluator: Reevaluator = this.evaluateRowFilter.bind(this, props.data, props.columns)
        if (props.rowFilter) {
            props.rowFilter.reevaluator = reevaluator
        }

        const filtered = props.rowFilter ? props.rowFilter.evaluate(props.data, props.columns) : props.data

        this.state = {
            data: filtered.length ? filtered : null,
            maxRows: filtered.length
        }
    }

    evaluateRowFilter(data: Array<any>, columns: Array<Column>, rowFilter: RowFilter) {
        const filtered = rowFilter.evaluate(data, columns)
        this.setState({
            data: filtered.length ? filtered : null,
            maxRows: filtered.length
        })
    }

    beforeOnCellMouseDown(ev: MouseEvent, coords: { row: number }, td: HTMLElement) {
        // In case the row/column header was clicked, the index is negative.
        this.debug('before on cell mouse down', ev, coords, td)

        try {
            this.selectingCells = coords.row >= 0
        } finally {
            if (this.props.beforeOnCellMouseDown) {
                this.props.beforeOnCellMouseDown(ev, coords, td)
            }
        }
    }

    afterSelection(r1: number, c1: number, r2: number, c2: number, preventScrolling: { value: boolean }) {
        this.debug('after selection', r1, c1, r2, c2, preventScrolling)

        try {
            if (!this.selectingCells) {
                return
            }
            if (this.props.selectionMode === 'row') {
                const fromCol = 0
                const toCol = this.hot.current.hotInstance.countCols() - 1
                const selected = this.hot.current.hotInstance.getSelectedRangeLast()
                if (r1 === selected.from.row && c1 === fromCol && r2 === selected.to.row && c2 === toCol) {
                    return
                }
                this.hot.current.hotInstance.selectRows(r1, r2)
            }
        } finally {
            if (this.props.afterSelection) {
                this.props.afterSelection(r1, c1, r2, c2, preventScrolling)
            }
        }
    }

    afterUpdateSettings(settings: any) {
        try {
            const tables = this.hot.current.hotInstance.rootElement.querySelectorAll('.htCore')
            const elementOffset = this.props.rowHeaders ? 2 : 1
            const viewportOffset = this.hot.current.hotInstance.colOffset()

            const manualColumnResize = this.hot.current.hotInstance.getSettings().manualColumnResize
            const hiddenColumns = (manualColumnResize && Array.isArray(manualColumnResize)) ?
                manualColumnResize.map((width, logical) => (width && width >= 20) ? -1 : logical).filter(logical => logical >= 0) : []

            const countCols = this.hot.current.hotInstance.countCols()
            const range = Array.from({length: countCols}, (v: any, k: number): number => k)

            range.forEach((column: number) => {

                const hidden = hiddenColumns.some((hidden: number): boolean => {
                    const visual = this.hot.current.hotInstance.toVisualColumn(hidden)
                    return visual === column
                })

                tables.forEach((table: HTMLElement) => {
                    table.querySelectorAll(`th:nth-child(${column + elementOffset - viewportOffset})`).forEach((cell: HTMLElement) => {
                        this.addRowFilterIndicator(column, cell, hidden)
                    })
                })
            })
        } finally {
            if (this.props.afterUpdateSettings) {
                this.props.afterUpdateSettings(settings)
            }
        }
    }

    addRowFilterIndicator(column: number, thEl: HTMLElement, hidden: boolean) {
        if (!this.props.rowFilter || !this.props.onClickRowFilterIndicator || hidden) {
            if (thEl.firstChild && thEl.firstChild.lastChild && thEl.firstChild.lastChild.nodeName.toLowerCase() === 'button') {
                thEl.firstChild.removeChild(thEl.firstChild.lastChild)
            }
            return
        }

        const physical = this.hot.current.hotInstance.toPhysicalColumn(column)
        const active = this.props.rowFilter && this.props.rowFilter.expressions.some((expression: PhysicalToExpression): boolean => {
            return expression.physical === physical
        })

        if (thEl.firstChild && thEl.firstChild.lastChild && thEl.firstChild.lastChild.nodeName.toLowerCase() === 'button') {
            // buttonEl will be HTMLElement though lastChild property has a pointer to Node.
            const buttonEl: any = thEl.firstChild.lastChild
            if (buttonEl) {
                buttonEl.className = `${this.props.rowFilterIndicatorClassName || 'rowFilterIndicator'} ${active ? 'active' : ''}`
            }
        } else {
            const buttonEl = document.createElement('button')
            buttonEl.innerHTML = '\u25BC'
            buttonEl.className = `${this.props.rowFilterIndicatorClassName || 'rowFilterIndicator'} ${active ? 'active' : ''}`
            buttonEl.addEventListener('click', (ev: MouseEvent) => {
                if (this.props.onClickRowFilterIndicator) {
                    this.props.onClickRowFilterIndicator(ev, column)
                }
            })

            if (thEl.firstChild) {
                thEl.firstChild.appendChild(buttonEl)
                thEl.style.whiteSpace = 'normal'
            }
        }
    }

    componentDidMount() {
    }

    UNSAFE_componentWillReceiveProps(nextProps: propsType) {
        const reevaluator: Reevaluator = this.evaluateRowFilter.bind(this, nextProps.data, nextProps.columns)
        if (nextProps.rowFilter) {
            nextProps.rowFilter.reevaluator = reevaluator
        }

        const newState = {}
        if (nextProps.data !== this.props.data || nextProps.rowFilter !== this.props.rowFilter) {
            newState.data = nextProps.rowFilter ? nextProps.rowFilter.evaluate(nextProps.data, nextProps.columns) : nextProps.data
        }
        this.setState(newState)
    }

    componentDidUpdate() {
    }

    render() {
        return (
            <HotTable ref={this.hot}
                      {...this.props}
                      data={this.state.data}
                      startCols={this.props.columns.length}
                      maxRows={this.state.maxRows}
                      beforeOnCellMouseDown={this.beforeOnCellMouseDown.bind(this)}
                      afterSelection={this.afterSelection.bind(this)}
                      afterUpdateSettings={this.afterUpdateSettings.bind(this)}/>
        )
    }

    debug(...messages: any) {
        if (this.props.mode !== 'debug') {
            return
        }
        if (!this.props.logger) {
            return
        }
        this.props.logger(...messages)
    }

    hotInstance(): Handsontable {
        return this.hot.current.hotInstance
    }
}
