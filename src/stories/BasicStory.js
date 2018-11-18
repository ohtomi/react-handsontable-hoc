import React from 'react'
import {action} from '@storybook/addon-actions'

import {HotTableContainer, HotTablePlugins, RowFilter} from '../lib'
import * as Expressions from '../lib/Expression'


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

const afterRowSelection = (rows) => {
    action('afterRowSelection')(...rows)
}

const initialColumnSorting = {
    initialConfig: {
        column: 2,
        sortOrder: 'desc'
    }
}

export class BasicStory extends React.Component {

    constructor(props) {
        super(props)

        this.ref = React.createRef()
        this.id = 'react-handsontable-hoc__src-stories-Basic'
        this.state = {
            mode: 'production',
            logger: action('BasicStory'),
            data: [],
            manualColumnsHide: [],
            rowFilter: new RowFilter([]),
            popover: {
                column: -1,
                values: columns.map(c => ''),
                top: '100px',
                left: '100px'
            }
        }
    }

    onChangeMode(ev) {
        const mode = ev.target.value
        this.setState({mode})
    }

    onChangeManualColumnsHide(index, ev) {
        const column = +index
        const checked = ev.target.checked
        const manualColumnsHide = this.state.manualColumnsHide.filter(v => v !== column).concat(checked ? [column] : [])
        this.setState({manualColumnsHide})
    }

    showRowFilterPopover(column, buttonEl) {
        const {values} = this.state.popover
        if (buttonEl) {
            const thEl = buttonEl.closest('th')
            const {bottom, right} = thEl.getBoundingClientRect()
            const top = `${bottom}px`
            const left = `${right - 200 - 1 - 5 - 2 - 2}px`
            this.setState({popover: {column, values, top, left}})
        } else {
            this.setState({popover: {column, values}})
        }
    }

    onChangeRowFilterValue(column, ev) {
        const expected = ev.target.value
        const {rowFilter, popover} = this.state
        rowFilter.expressions = rowFilter.expressions.filter(e => e.physical !== column)
            .concat({
                physical: column,
                expression: Expressions.byFunction((value) => {
                    if (columns[column].type === 'text') {
                        return value.indexOf(expected) !== -1
                    } else if (columns[column].type === 'numeric') {
                        return value > +expected
                    } else {
                        return true
                    }
                })
            })
        popover.values[column] = expected
        this.setState({rowFilter, popover})
    }

    onClickLoadDataButton(ev) {
        this.setState({data: data})
    }

    onClickClearLocalStorageButton(ev) {
        const hotInstance = this.ref.current.hotInstance()
        const plugin = hotInstance.getPlugin('PersistentState')
        plugin.resetValue()
    }

    render() {
        return (
            <div>
                <HotTableContainer
                    ref={this.ref}
                    id={this.id}
                    persistentState={true}
                    mode={this.state.mode} logger={this.state.logger}
                    data={this.state.data} columns={columns} colHeaders={colHeaders}
                    width="800" height="350"
                    manualColumnMove={true}
                    // for Row Selection
                    selectionMode="row"
                    afterRowSelection={afterRowSelection}
                    // for Initial Column Sorting
                    columnSorting={true}
                    initialColumnSorting={initialColumnSorting}
                    // for Manual Column Hide
                    manualColumnsHide={this.state.manualColumnsHide}
                    manualColumnResize={true}
                    // for Row Filter
                    rowFilter={this.state.rowFilter}
                    colHeaderButtonClassName={'basic-story'}
                    afterRowFiltering={action('afterRowFiltering')}
                    onClickColHeaderButton={this.showRowFilterPopover.bind(this)}
                />
                {
                    [this.state.popover].map((popover, index) => {
                        const style = {
                            display: popover.column !== -1 ? 'block' : 'none',
                            border: '1px solid',
                            backgroundColor: '#eee',
                            padding: '2px',
                            margin: '1px 1px 0 5px',
                            position: 'absolute',
                            zIndex: 9999,
                            top: popover.top || '100px',
                            left: popover.left || '100px',
                            width: '200px'
                        }
                        const value = popover.column !== -1 ? popover.values[popover.column] : ''
                        const onChange = (ev) => this.onChangeRowFilterValue(popover.column, ev)
                        const onClick = (ev) => this.showRowFilterPopover(-1)
                        return (
                            <div key={index} style={style}>
                                <input type="text" value={value} onChange={onChange}/>
                                <button style={{float: 'right'}} onClick={onClick}>X</button>
                            </div>
                        )
                    })
                }
                <hr/>
                mode:
                {
                    ['debug', 'production'].map((mode, index) => {
                        const checked = mode === this.state.mode
                        const onChange = this.onChangeMode.bind(this)
                        return (
                            <label key={index} style={{marginLeft: '6px'}}>
                                <input type="radio" name="mode-radio" checked={checked} value={mode} onChange={onChange}/>
                                {mode}
                            </label>
                        )
                    })
                }
                <br/>
                manualColumnHide:
                {
                    colHeaders.map((colHeader, index) => {
                            const checked = this.state.manualColumnsHide.some(v => v === index)
                            const onChange = this.onChangeManualColumnsHide.bind(this, index)
                            return (
                                <label key={index} style={{marginLeft: '6px'}}>
                                    <input type="checkbox" checked={checked} onChange={onChange}/>
                                    {colHeader}
                                </label>
                            )
                        }
                    )
                }
                <hr/>
                <button onClick={this.onClickLoadDataButton.bind(this)}>load data</button>
                <span>{' '}</span>
                <button onClick={this.onClickClearLocalStorageButton.bind(this)}>clear local storage</button>
            </div>
        )
    }
}

HotTablePlugins.registerPlugins()
