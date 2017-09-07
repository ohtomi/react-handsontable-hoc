import test from 'ava';
import React from 'react';

import {RowFilter, Expressions} from '../dist/';


const rows = 50;
const cols = 15;

const data = Array.from({length: rows}).map((v1, k1) => {
    return Array.from({length: cols}).map((v2, k2) => {
        const columnName = `col-${k2}`;
        const columnValue = `${new Intl.NumberFormat().format(k1)}-${new Intl.NumberFormat().format(k2)}`;
        return new Map().set(columnName, columnValue);
    }).reduce((prev, cell) => {
        Array.from(cell.keys()).forEach((name) => {
            prev[name] = cell.get(name);
        });
        return prev;
    }, {});
});

const columns = Array.from({length: cols}).map((v2, k2) => {
    const columnName = `col-${k2}`;
    return {
        data: columnName,
        type: 'text',
        width: 100,
        readOnly: true,
        wordWrap: false
    };
});


test('filter by values', t => {
    const filter = new RowFilter([
        {
            physical: 0,
            expression: Expressions.get({symbol: 'by_values', props: ['0-0', '1-0']})
        }
    ]);

    const filtered = filter.evaluate(data, columns);

    t.is(filtered.length, 2);
    t.is(filtered[0]['col-0'], '0-0');
    t.is(filtered[1]['col-0'], '1-0');
});

test('filter by function', t => {
    const filter = new RowFilter([
        {
            physical: 0,
            expression: Expressions.byFunction((value: any): boolean => {
                return value === '0-0' || value === '1-0';
            })
        }
    ]);

    const filtered = filter.evaluate(data, columns);

    t.is(filtered.length, 2);
    t.is(filtered[0]['col-0'], '0-0');
    t.is(filtered[1]['col-0'], '1-0');
});

test('skip filtering', t => {
    const filter = new RowFilter([
        {
            physical: 0,
            expression: Expressions.byFunction((value: any): boolean => {
                return value <= '1-0';
            })
        }, {
            physical: 1,
            expression: Expressions.byFunction((value: any): boolean => {
                return value >= '1-1';
            })
        }
    ]);

    {
        const filtered = filter.evaluate(data, columns);

        t.is(filtered.length, 1);
        t.is(filtered[0]['col-0'], '1-0');
    }
    {
        const filtered = filter.evaluate(data, columns, [0]);

        t.is(filtered.length, 49);
        t.is(filtered[0]['col-0'], '1-0');
        t.is(filtered[1]['col-0'], '2-0');
        t.is(filtered[2]['col-0'], '3-0');
    }
});
