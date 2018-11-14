import React from 'react'
import {action} from '@storybook/addon-actions'

import {HotTableContainer, HotTablePlugins} from '../lib'


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

export class HiddenColumnsStory extends React.Component {

    constructor(props) {
        super(props)

        this.ref = React.createRef()
        this.state = {
            hiddenColumns: []
        }
    }

    onClick(ev) {
        const plugin = HotTablePlugins.HiddenColumnsPlugin.getHiddenColumnsPlugin(this.ref.current.hotInstance())
        const hiddenColumns = this.state.hiddenColumns.length ? [] : [3]
        plugin.hideColumns(hiddenColumns)
        this.setState({hiddenColumns})
    }

    render() {
        return (
            <div>
                <HotTableContainer
                    ref={this.ref}
                    mode="debug" logger={action('debug')}
                    data={data} columns={columns} colHeaders={colHeaders}
                    width="800" height="350"
                />
                <hr/>
                <button onClick={this.onClick.bind(this)}>{this.state.hiddenColumns.length ? 'show' : 'hide'} volumn column</button>
            </div>
        )
    }
}

HotTablePlugins.HiddenColumnsPlugin.registerHiddenColumnsPlugin()
