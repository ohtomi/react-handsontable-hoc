import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {HotTableContainer} from '../src/index';


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
];

const columns = [
    {data: 'id', type: 'numeric', width: 150, readOnly: true},
    {data: 'name', type: 'text', width: 150, readOnly: true},
    {data: 'year', type: 'numeric', width: 150, readOnly: true},
    {data: 'volume', type: 'numeric', width: 150, readOnly: true},
    {data: data => data.processed ? 'Yes' : 'No', type: 'text', width: 150, readOnly: true}
];

const colHeaders = ['ID', 'NAME', 'YEAR', 'VOLUME', 'PROCESSED?'];

storiesOf('Basic', module)
    .add('plain', () => {
        return (
            <HotTableContainer
                mode="debug" logger={action('debug')}
                data={data} columns={columns} colHeaders={colHeaders}
                width="800" height="250"
                columnSorting={true} sortIndicator={true}
                manualColumnMove={true}
                manualColumnResize={true}/>
        );
    })
    .add('move column', () => {
        const columnMapping = [0, 3, 4, 1, 2];

        return (
            <HotTableContainer
                mode="debug" logger={action('debug')} columnMapping={columnMapping}
                data={data} columns={columns} colHeaders={colHeaders}
                width="800" height="250"
                columnSorting={true} sortIndicator={true}
                manualColumnMove={true}
                manualColumnResize={true}/>
        );
    })
    .add('hide column', () => {
        const columnMapping = [0, 3, 4, 1, 2];
        const hiddenColumns = [3];

        return (
            <HotTableContainer
                mode="debug" logger={action('debug')} columnMapping={columnMapping} hiddenColumns={hiddenColumns}
                data={data} columns={columns} colHeaders={colHeaders}
                width="800" height="250"
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
        const columnMapping = [0, 3, 4, 1, 2];
        const hiddenColumns = [3];

        return (
            <HotTableContainer
                mode="debug" logger={action('debug')} columnMapping={columnMapping} hiddenColumns={hiddenColumns}
                data={data} columns={columns} colHeaders={colHeaders}
                width="800" height="250"
                columnSorting={columnSorting} sortIndicator={true}
                manualColumnMove={true}
                manualColumnResize={true}/>
        );
    })
    .add('with row header', () => {
        const columnSorting = {
            column: 4,
            sortOrder: false
        };
        const columnMapping = [0, 3, 4, 1, 2];
        const hiddenColumns = [3];

        return (
            <HotTableContainer
                mode="debug" logger={action('debug')} columnMapping={columnMapping} hiddenColumns={hiddenColumns}
                data={data} columns={columns} colHeaders={colHeaders} rowHeaders={true}
                width="800" height="250"
                columnSorting={columnSorting} sortIndicator={true}
                manualColumnMove={true}
                manualColumnResize={true}/>
        );
    });
