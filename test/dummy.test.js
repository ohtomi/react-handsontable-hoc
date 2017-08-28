import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';

import {HotTableContainer, RowFilter, Expressions} from '../dist/';


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

test('table exist', t => {
    const wrapper = shallow(
        <HotTableContainer
            data={data} columns={columns} colHeaders={colHeaders}
            width="800" height="300"
            columnSorting={true} sortIndicator={true}
            manualColumnMove={true}
            manualColumnResize={true}/>
    );
    t.truthy(wrapper.find('.htCore'));
});

test('filter by values', t => {
    const filter = new RowFilter([
        {
            physical: 1,
            expression: Expressions.get({symbol: 'by_values', props: ['ford', 'volvo']})
        }
    ]);

    const filtered = filter.evaluate(data, columns);

    t.is(8, filtered.length);
    t.is(11, filtered[0].id);
    t.is(24, filtered[7].id);
});

test('filter by function', t => {
    const filter = new RowFilter([
        {
            physical: 1,
            expression: Expressions.byFunction((value: any): boolean => {
                return value === 'ford' || value === 'volvo';
            })
        }
    ]);

    const filtered = filter.evaluate(data, columns);

    t.is(8, filtered.length);
    t.is(11, filtered[0].id);
    t.is(24, filtered[7].id);
});

test('skip filtering', t => {
    const filter = new RowFilter([
        {
            physical: 0,
            expression: Expressions.byFunction((value: any): boolean => {
                return value >= 10 && value <= 19;
            })
        }, {
            physical: 1,
            expression: Expressions.byFunction((value: any): boolean => {
                return value === 'ford' || value === 'volvo';
            })
        }
    ]);

    {
        const filtered = filter.evaluate(data, columns);

        t.is(4, filtered.length);
        t.is(11, filtered[0].id);
    }
    {
        const filtered = filter.evaluate(data, columns, [0]);

        t.is(8, filtered.length);
        t.is(11, filtered[0].id);
        t.is(24, filtered[7].id);
    }
});
