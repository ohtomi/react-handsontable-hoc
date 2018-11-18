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

const names = []

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

export class BasicStory extends React.Component {

    constructor(props) {
        super(props)

        this.ref = React.createRef()
        this.id = 'react-handsontable-hoc__src-stories-Basic'
        this.state = {
            mode: 'production',
            logger: action('production'),
            data: [],
            manualColumnsHide: [],
            rowFilter: filter
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

    onChange(ev) {
        const tokens = ev.target.value.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[^\uD800-\uDFFF]/g) || []
        names.splice(0)
        names.push(...tokens)
        this.setState({rowFilter: filter})
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
                    onClickColHeaderButton={action('onClickColHeaderButton')}
                />
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
                <br/>
                <label>filter by col-1: <input type="text" onChange={this.onChange.bind(this)} autoFocus={true}/></label>
                <hr/>
                <button onClick={this.onClickLoadDataButton.bind(this)}>load data</button>
                <span>{' '}</span>
                <button onClick={this.onClickClearLocalStorageButton.bind(this)}>clear local storage</button>
            </div>
        )
    }
}

HotTablePlugins.registerPlugins()
