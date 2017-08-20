import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';

import {HotTableContainer, RowFilter, Expressions} from '../dist/';


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

    t.is(2, filtered.length);
    t.is(1, filtered[0].id);
    t.is(2, filtered[1].id);
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

    t.is(2, filtered.length);
    t.is(1, filtered[0].id);
    t.is(2, filtered[1].id);
});
