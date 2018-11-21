import React from 'react'
import ReactDOM from 'react-dom'

import {Expressions, HotTableContainer, HotTablePlugins, RowFilter} from '@ohtomi/react-handsontable-hoc'


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

// sort by YEAR
const initialColumnSorting = {
    initialConfig: {
        column: 2,
        sortOrder: 'desc'
    }
}

// VOLUME is hidden
const manualColumnsHide = [3]

// filter by NAME
const rowFilter = new RowFilter([
    {
        physical: 1,
        expression: Expressions.get({
            symbol: 'by_values',
            props: ['ford', 'volvo']
        })
    }
])

class Demo extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            messages: []
        }
    }

    render() {
        return (
            <div>
                <HotTableContainer
                    data={data} columns={columns} colHeaders={colHeaders}
                    width="800" height="250"
                    manualColumnMove={true}
                    // for Row Selection
                    selectionMode="row"
                    afterRowSelection={this.afterRowSelection.bind(this)}
                    // for Initial Column Sorting
                    columnSorting={true}
                    initialColumnSorting={initialColumnSorting}
                    // for Manual Column Hide
                    manualColumnsHide={manualColumnsHide}
                    manualColumnResize={true}
                    // for Row Filter
                    rowFilter={rowFilter}
                    colHeaderButtonClassName={'my-col-header-button'}
                    afterRowFiltering={this.afterRowFiltering.bind(this)}
                    onClickColHeaderButton={this.showRowFilterPopover.bind(this)}
                />
                <textarea rows={10} cols={100} value={this.state.messages.join('\n')} readOnly={true}/>
            </div>
        )
    }

    afterRowSelection(rows) {
        const messages = [`afterRowSelection(${rows}) @${new Date()}`].concat(this.state.messages)
        this.setState({messages})
    }

    afterRowFiltering(filteredRows) {
        const messages = [`afterRowFiltering(${filteredRows}) @${new Date()}`].concat(this.state.messages)
        this.setState({messages})
    }

    showRowFilterPopover(column, buttonEl) {
        const messages = [`showRowFilterPopover(${column}), ${buttonEl} @${new Date()}`].concat(this.state.messages)
        this.setState({messages})
    }
}

HotTablePlugins.registerPlugins()

const containerEl = document.getElementById('root')

ReactDOM.render(<Demo/>, containerEl)
