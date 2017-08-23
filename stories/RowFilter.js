import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {HotTableContainer, RowFilter, Expressions} from '../src/index';


const data = [
    {'id': 1, 'name': 'ford', 'year': 2018, 'volume': 1000, 'good': true},
    {'id': 2, 'name': 'volvo', 'year': 2017, 'volume': 1000, 'good': false},
    {'id': 3, 'name': 'toyota', 'year': 2016, 'volume': 1000, 'good': true},
    {'id': 4, 'name': 'honda', 'year': 2015, 'volume': 1000, 'good': true}
];

const columns = [
    {data: 'id', type: 'numeric', width: 150, readOnly: true},
    {data: 'name', type: 'text', width: 150, readOnly: true},
    {data: 'year', type: 'numeric', width: 150, readOnly: true},
    {data: 'volume', type: 'numeric', width: 150, readOnly: true},
    {data: data => data.good ? 'GOOD' : 'BAD', type: 'text', width: 150, readOnly: true}
];

const colHeaders = ['ID', 'NAME', 'YEAR', 'VOLUME', 'GOOD/BAD'];

storiesOf('Row Filter', module)
    .add('plain', () => {
        const ref = {hoc: null};
        const names = [];

        const filter = new RowFilter([
            {
                physical: 1,
                expression: Expressions.byFunction((value) => {
                    if (!names.length) {
                        return true;
                    }

                    const reduced = names.reduce((prev, name) => {
                        const result = prev.value.indexOf(name + '');
                        if (result !== -1) {
                            return {value: prev.value.substring(result + 1), position: result};
                        } else {
                            return {value: '', position: result};
                        }
                    }, {value: value + '', position: 0});

                    return reduced.position !== -1;
                })
            }
        ]);

        const onChange = (ev) => {
            const tokens = ev.target.value.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[^\uD800-\uDFFF]/g) || [];
            names.splice(0);
            names.push(...tokens);
            filter.reevaluate();
        };

        return (
            <div>
                <HotTableContainer
                    mode="debug" logger={action('debug')}
                    data={data} columns={columns} colHeaders={colHeaders}
                    width="800" height="150"
                    columnSorting={true} sortIndicator={true}
                    manualColumnMove={true}
                    manualColumnResize={true}
                    rowFilter={filter}/>
                <label>NAME: <input type="text" onChange={onChange} autoFocus={true}/></label>
            </div>
        );
    });
