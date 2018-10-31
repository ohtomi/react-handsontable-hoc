// @flow

import React from 'react'
import Handsontable from 'handsontable'
import {HotTable} from '@handsontable/react'

import type {Column, ColumnSorting, ColumnSortingObject} from './HandsontableTypes'
import type {PhysicalToExpression, Reevaluator} from './RowFilter'
import {RowFilter} from './RowFilter'
import {debounce} from './EventThrottle'

import 'handsontable/dist/handsontable.full.css'


type propsType = {
    mode?: 'production' | 'debug' | '',
    logger?: (messages: Iterator<any>) => void,
    data: Array<any>,
    columns: Array<Column>,
    rowHeaders?: boolean,
    columnSorting?: ColumnSorting | null,
    columnMapping?: Array<number>,
    hiddenColumns?: Array<number>,
    selectionMode?: 'cell' | 'row',
    afterGetColHeader: (column: number, th: HTMLElement) => void,
    afterColumnSort?: (column: number, sortOrder?: boolean) => void,
    beforeColumnMove?: (columns: Array<number>, target: number) => void,
    afterColumnMove?: (columns: Array<number>, target: number) => void,
    afterColumnResize?: (column: number, width: number, isDoubleClick: boolean) => void,
    beforeOnCellMouseDown?: (ev: MouseEvent, coords: { row: number }, td: HTMLElement) => void,
    afterSelection?: (r1: number, c1: number, r2: number, c2: number, preventScrolling: { value: boolean }) => void,
    afterScrollHorizontally: () => void,
    afterScrollVertically: () => void,
    afterUpdateSettings?: (settings: any) => void,
    rowFilter?: RowFilter,
    rowFilterIndicatorClassName?: string,
    onClickRowFilterIndicator?: (ev: MouseEvent, column: number) => void
};

type stateType = {
    data: ?Array<any>,
    maxRows: number,
    columns: Array<Column>,
    columnSorting: ColumnSorting,
    columnMapping: Array<number>,
    hiddenColumns: Array<number>
};

export class HotTableContainer extends React.Component<propsType, stateType> {

    props: propsType
    state: stateType

    initialized: boolean
    selectingCells: boolean
    hot: { hotInstance: Handsontable }

    constructor(props: propsType) {
        super(props)

        const reevaluator: Reevaluator = this.evaluateRowFilter.bind(this, props.data, props.columns)
        if (props.rowFilter) {
            props.rowFilter.reevaluator = reevaluator
        }

        const filtered = props.rowFilter ? props.rowFilter.evaluate(props.data, props.columns) : props.data
        const columns = props.columns.map((column: Column, index: number): Column => {
            const hidden = (props.hiddenColumns || []).some((hidden: number): boolean => hidden === index)
            if (hidden) {
                return Object.assign({}, column, {width: () => 1e-20})
            } else {
                return column
            }
        })
        const columnSorting = props.columnSorting || false
        const columnMapping = props.columnMapping || []
        const hiddenColumns = props.hiddenColumns || []

        this.state = {
            data: filtered.length ? filtered : null,
            maxRows: filtered.length,
            columns: columns,
            columnSorting: columnSorting,
            columnMapping: columnMapping,
            hiddenColumns: hiddenColumns
        }
    }

    evaluateRowFilter(data: Array<any>, columns: Array<Column>, rowFilter: RowFilter) {
        const filtered = rowFilter.evaluate(data, columns)
        this.setState({
            data: filtered.length ? filtered : null,
            maxRows: filtered.length
        })
    }

    afterGetColHeader(/*column: number, thEl: HTMLElement*/) {
        // column is visual column index.
    }

    afterColumnSort(column: number, sortOrder?: boolean) {
        // column is visual column index.
        this.debug('after column sort', column, sortOrder)

        try {
            if (this.state.columnSorting && this.state.columnSorting.column === column && this.state.columnSorting.sortOrder === sortOrder) {
                return
            }

            if (sortOrder !== undefined) {
                this.setState({
                    columnSorting: {
                        column: column,
                        sortOrder: sortOrder
                    }
                })
            } else {
                this.setState({
                    columnSorting: {
                        column: column,
                        sortOrder: null
                    }
                })
            }
        } finally {
            if (this.props.afterColumnSort) {
                this.props.afterColumnSort(column, sortOrder)
            }
        }
    }

    beforeColumnMove(columns: Array<number>, target: number) {
        // columns are an array of visual column indexes.
        // target is visual column index.
        this.debug('before column move', `[${columns.join(', ')}]`, target)

        try {
            if (!this.state.columnSorting) {
                return
            }

            if (typeof this.state.columnSorting === 'object') {
                const columnSorting: ColumnSortingObject = this.state.columnSorting
                const from = columns[0]
                const to = columns[columns.length - 1]

                if (columnSorting.column < from && columnSorting.column < target) {
                    return
                }
                if (columnSorting.column > to && columnSorting.column > target) {
                    return
                }

                const rangeLength = to < target ? target : to + 1
                const range = Array.from({length: rangeLength}, (v: any, k: number): number => k)

                if (to < target) {
                    range.splice(target, 0, ...range.slice(from, to + 1))
                    range.splice(from, to + 1 - from)
                } else if (from > target) {
                    range.splice(target, 0, ...range.splice(from, to + 1 - from))
                }
                this.debug('range', `[${range.join(', ')}]`)

                let newSortIndex = columnSorting.column
                range.forEach((column: number, index: number) => {
                    if (column === columnSorting.column) {
                        newSortIndex = index
                    }
                })
                this.debug('sort index', `${columnSorting.column} -> ${newSortIndex}`)

                this.setState({
                    columnSorting: {
                        column: newSortIndex,
                        sortOrder: columnSorting.sortOrder
                    }
                })
            }
        } finally {
            if (this.props.beforeColumnMove && this.initialized) {
                this.props.beforeColumnMove(columns, target)
            }
        }
    }

    afterColumnMove(columns: Array<number>, target: number) {
        // columns are an array of physical column indexes. document bug?
        // target is visual column index.
        this.debug('after column move', `[${columns.join(', ')}]`, target)

        try {
            this.hot.hotInstance.updateSettings({})
        } finally {
            if (this.props.afterColumnMove && this.initialized) {
                this.props.afterColumnMove(columns, target)
            }
        }
    }

    afterColumnResize(column: number, width: number, isDoubleClick: boolean) {
        // column is visual column index.
        this.debug('after column resize', column, width, isDoubleClick)

        try {
            this.hot.hotInstance.updateSettings({})
        } finally {
            if (this.props.afterColumnResize) {
                this.props.afterColumnResize(column, width, isDoubleClick)
            }
        }
    }

    beforeOnCellMouseDown(ev: MouseEvent, coords: { row: number }, td: HTMLElement) {
        // In case the row/column header was clicked, the index is negative.
        this.debug('before on cell mouse down', ev, coords, td)

        try {
            if (coords.row < 0) {
                this.selectingCells = false
            } else {
                this.selectingCells = true
            }
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
                const toCol = this.hot.hotInstance.countCols() - 1
                const selected = this.hot.hotInstance.getSelectedRangeLast()
                if (r1 === selected.from.row && c1 === fromCol && r2 === selected.to.row && c2 === toCol) {
                    return
                }
                this.hot.hotInstance.selectRows(r1, r2)
            }
        } finally {
            if (this.props.afterSelection) {
                this.props.afterSelection(r1, c1, r2, c2, preventScrolling)
            }
        }
    }

    afterScrollHorizontally() {
        try {
            this.hot.hotInstance.updateSettings({})
        } finally {
            if (this.props.afterScrollHorizontally) {
                this.props.afterScrollHorizontally()
            }
        }
    }

    afterScrollVertically() {
        try {
            this.hot.hotInstance.updateSettings({})
        } finally {
            if (this.props.afterScrollVertically) {
                this.props.afterScrollVertically()
            }
        }
    }

    afterUpdateSettings(settings: any) {
        try {
            requestAnimationFrame(() => {
                const tables = this.hot.hotInstance.rootElement.querySelectorAll('.htCore')
                const elementOffset = this.props.rowHeaders ? 2 : 1
                const viewportOffset = this.hot.hotInstance.colOffset()

                const countCols = this.hot.hotInstance.countCols()
                const range = Array.from({length: countCols}, (v: any, k: number): number => k)

                range.forEach((column: number) => {

                    const hidden = this.state.hiddenColumns.some((hidden: number): boolean => {
                        const visual = this.hot.hotInstance.toVisualColumn(hidden)
                        return visual === column
                    })

                    tables.forEach((table: HTMLElement) => {
                        table.querySelectorAll(`col:nth-child(${column + elementOffset - viewportOffset})`).forEach((cell: HTMLElement) => {
                            if (hidden) {
                                cell.classList.add('hidden')
                            } else {
                                cell.classList.remove('hidden')
                            }
                        })
                        table.querySelectorAll(`th:nth-child(${column + elementOffset - viewportOffset})`).forEach((cell: HTMLElement) => {
                            if (hidden) {
                                cell.classList.add('hidden')
                            } else {
                                cell.classList.remove('hidden')
                            }
                            this.addRowFilterIndicator(column, cell, hidden)
                        })
                        table.querySelectorAll(`td:nth-child(${column + elementOffset - viewportOffset})`).forEach((cell: HTMLElement) => {
                            if (hidden) {
                                cell.classList.add('hidden')
                            } else {
                                cell.classList.remove('hidden')
                            }
                        })
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
        try {
            if (!this.props.rowFilter || !this.props.onClickRowFilterIndicator || hidden) {
                if (thEl.firstChild && thEl.firstChild.lastChild && thEl.firstChild.lastChild.nodeName.toLowerCase() === 'button') {
                    thEl.firstChild.removeChild(thEl.firstChild.lastChild)
                }
                return
            }

            const physical = this.hot.hotInstance.toPhysicalColumn(column)
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
        } finally {
            if (this.props.afterGetColHeader) {
                this.props.afterGetColHeader(column, thEl)
            }
        }
    }

    componentDidMount() {
        this.initializeHotTable()
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
        if (nextProps.hiddenColumns !== this.props.hiddenColumns) {
            newState.columns = nextProps.columns.map((column: Column, index: number): Column => {
                const hidden = (nextProps.hiddenColumns || []).some((hidden: number): boolean => hidden === index)
                if (hidden) {
                    return Object.assign({}, column, {width: 1e-20})
                } else {
                    return column
                }
            })
            newState.hiddenColumns = nextProps.hiddenColumns
        }
        this.setState(newState)
        this.hot.hotInstance.updateSettings({})
    }

    componentDidUpdate() {
        if (!this.initialized) {
            this.initializeHotTable()
        }
    }

    render() {
        const props = Object.assign({}, this.props)

        return (
            <HotTable ref={hot => {
                if (hot) {
                    this.hot = hot
                }
            }}
                      {...props}
                      data={this.state.data}
                      startCols={this.state.columns.length}
                      maxRows={this.state.maxRows}
                      columns={this.state.columns}
                      columnSorting={this.state.columnSorting}
                      afterGetColHeader={this.afterGetColHeader.bind(this)}
                      afterColumnSort={this.afterColumnSort.bind(this)}
                      beforeColumnMove={this.beforeColumnMove.bind(this)}
                      afterColumnMove={this.afterColumnMove.bind(this)}
                      afterColumnResize={this.afterColumnResize.bind(this)}
                      beforeOnCellMouseDown={this.beforeOnCellMouseDown.bind(this)}
                      afterSelection={this.afterSelection.bind(this)}
                      afterScrollHorizontally={debounce(this.afterScrollHorizontally.bind(this), 100)}
                      afterScrollVertically={debounce(this.afterScrollVertically.bind(this), 100)}
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
        return this.hot.hotInstance
    }

    initializeHotTable() {
        if (!this.hot || !this.hot.hotInstance) {
            return
        }

        const plugin = this.hot.hotInstance.getPlugin('ManualColumnMove')
        this.debug('plugin?', !!plugin)

        if (plugin) {
            /**
             * move columns according to this.state.columnMapping
             */
            this.state.columnMapping.map((element: number, index: number): { physical: number, visual: number } => {
                return {physical: element, visual: index}
            }).sort((a: { physical: number, visual: number }, b: { physical: number, visual: number }): number => {
                return a.visual - b.visual
            }).forEach((element: { physical: number, visual: number }) => {
                const visual = this.hot.hotInstance.toVisualColumn(element.physical)
                const target = element.visual
                plugin.moveColumn(visual, target)
            })

            this.initialized = true
        }
    }
}
