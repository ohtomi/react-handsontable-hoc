import React from 'react'
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'

import {getHiddenColumnsPlugin, registerHiddenColumnsPlugin, HotTableContainer, RowFilter} from '../lib'
import * as Expressions from '../lib/Expression'


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

const colHeaders = Array.from({length: cols}).map((v2, k2) => {
    return `col-${k2}`
})

const columnSorting = {
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

            const reduced = names.reduce((prev, name) => {
                const result = prev.value.indexOf(name + '')
                if (result !== -1) {
                    return {value: prev.value.substring(result + 1), position: result}
                } else {
                    return {value: '', position: result}
                }
            }, {value: value + '', position: 0})

            return reduced.position !== -1
        })
    }
])

const h2Renderer = (instance, td, row, col, prop, value, cellProperties) => {
    if (td.children.length) return td

    const aEl = document.createElement('a')
    aEl.href = '#'
    aEl.textContent = value

    td.appendChild(aEl)

    return td
}

columns[0].renderer = h2Renderer

class App extends React.Component {

    constructor(props) {
        super(props)

        this.ref = React.createRef()
        this.id = 'react-handsontable-hoc__src-stories-Viewport'
        this.state = {
            hiddenColumns: []
        }
    }

    onClick1(ev) {
        const plugin = getHiddenColumnsPlugin(this.ref.current.hotInstance())
        const hiddenColumns = this.state.hiddenColumns.length ? [] : [1, 3, 5, 7, 9]
        plugin.hideColumns(hiddenColumns)
        this.setState({hiddenColumns})
    }

    onChange(ev) {
        const tokens = ev.target.value.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[^\uD800-\uDFFF]/g) || []
        names.splice(0)
        names.push(...tokens)
        filter.reevaluate()
    }

    onClick2(ev) {
        const hotInstance = this.ref.current.hotInstance()
        const plugin = hotInstance.getPlugin('PersistentState')
        plugin.resetValue()
    }

    render() {
        return (
            <div>
                <HotTableContainer
                    ref={this.ref} id={this.id} persistentState={true}
                    mode="debug" logger={action('debug')}
                    data={data} columns={columns} colHeaders={colHeaders} selectionMode="row"
                    width="800" height="250"
                    columnSorting={columnSorting}
                    manualColumnMove={true}
                    manualColumnResize={true}
                    rowFilter={filter}
                    onClickRowFilterIndicator={action('onClickRowFilterIndicator')}/>
                <hr/>
                <button onClick={this.onClick1.bind(this)}>{this.state.hiddenColumns.length ? 'show' : 'hide'} some columns</button>
                <br/>
                <label>filter by col-1: <input type="text" onChange={this.onChange.bind(this)} autoFocus={true}/></label>
                <br/>
                <button onClick={this.onClick2.bind(this)}>clear localstorage</button>
            </div>
        )
    }
}

registerHiddenColumnsPlugin()

storiesOf('Viewport', module)
    .add('plain', () => {
        return <App/>
    })
