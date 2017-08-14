import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {HotTableContainer} from '../src/index';


const data = [
    {'id': 1, 'name': 'ford', 'year': 2018, 'volume': 1000, 'good': true},
    {'id': 2, 'name': 'volvo', 'year': 2017, 'volume': 1000, 'good': false},
    {'id': 3, 'name': 'toyota', 'year': 2016, 'volume': 1000, 'good': true},
    {'id': 4, 'name': 'honda', 'year': 2015, 'volume': 1000, 'good': true},
];

const columns = [
    {data: 'id', type: 'numeric', width: 150, readOnly: true},
    {data: 'name', type: 'text', width: 150, readOnly: true},
    {data: 'year', type: 'numeric', width: 150, readOnly: true},
    {data: 'volume', type: 'numeric', width: 150, readOnly: true},
    {data: data => data.good ? 'GOOD' : 'BAD', type: 'text', width: 150, readOnly: true}
];

const colHeaders = ['ID', 'NAME', 'YEAR', 'VOLUME', 'GOOD/BAD'];

storiesOf('Basic', module)
    .add('plain', () => {
        return (
            <HotTableContainer
                mode="debug" logger={action('debug')}
                data={data} columns={columns} colHeaders={colHeaders}
                width="800" height="300"
                columnSorting={true} sortIndicator={true}
                manualColumnMove={true}
                manualColumnResize={true}/>
        );
    })
    .add('move column', () => {
        const columnMapping = [0, 2, 3, 4, 1];

        return (
            <HotTableContainer
                mode="debug" logger={action('debug')} columnMapping={columnMapping}
                data={data} columns={columns} colHeaders={colHeaders}
                width="800" height="300"
                columnSorting={true} sortIndicator={true}
                manualColumnMove={true}
                manualColumnResize={true}/>
        );
    })
    .add('hide column', () => {
        const columnMapping = [0, 2, 3, 4, 1];
        const hiddenColumns = [3];

        return (
            <HotTableContainer
                mode="debug" logger={action('debug')} columnMapping={columnMapping} hiddenColumns={hiddenColumns}
                data={data} columns={columns} colHeaders={colHeaders}
                width="800" height="300"
                columnSorting={true} sortIndicator={true}
                manualColumnMove={true}
                manualColumnResize={true}/>
        );
    })
    .add('sort column', () => {
        const columnSorting = {
            column: 4,
            sortOrder: false
        };
        const columnMapping = [0, 2, 3, 4, 1];
        const hiddenColumns = [3];

        return (
            <HotTableContainer
                mode="debug" logger={action('debug')} columnMapping={columnMapping} hiddenColumns={hiddenColumns}
                data={data} columns={columns} colHeaders={colHeaders}
                width="800" height="300"
                columnSorting={columnSorting} sortIndicator={true}
                manualColumnMove={true}
                manualColumnResize={true}/>
        );
    });
