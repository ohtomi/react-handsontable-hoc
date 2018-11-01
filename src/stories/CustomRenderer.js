import React from 'react'
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'

import {HotTableContainer} from '../lib'


const data = [
    {
        'id': 11,
        'logo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Ford_Motor_Company_Logo.svg/440px-Ford_Motor_Company_Logo.svg.png',
        'name': 'ford',
        'year': 2015,
        'volume': 1000,
        'processed': true
    },
    {
        'id': 12,
        'logo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Ford_Motor_Company_Logo.svg/440px-Ford_Motor_Company_Logo.svg.png',
        'name': 'ford',
        'year': 2016,
        'volume': 1000,
        'processed': true
    },
    {
        'id': 13,
        'logo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Ford_Motor_Company_Logo.svg/440px-Ford_Motor_Company_Logo.svg.png',
        'name': 'ford',
        'year': 2017,
        'volume': 1000,
        'processed': true
    },
    {
        'id': 14,
        'logo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Ford_Motor_Company_Logo.svg/440px-Ford_Motor_Company_Logo.svg.png',
        'name': 'ford',
        'year': 2018,
        'volume': 1000,
        'processed': false
    },
    {
        'id': 21,
        'logo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Volvo_logo.svg/440px-Volvo_logo.svg.png',
        'name': 'volvo',
        'year': 2015,
        'volume': 1000,
        'processed': true
    },
    {
        'id': 22,
        'logo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Volvo_logo.svg/440px-Volvo_logo.svg.png',
        'name': 'volvo',
        'year': 2016,
        'volume': 1000,
        'processed': true
    },
    {
        'id': 23,
        'logo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Volvo_logo.svg/440px-Volvo_logo.svg.png',
        'name': 'volvo',
        'year': 2017,
        'volume': 1000,
        'processed': true
    },
    {
        'id': 24,
        'logo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Volvo_logo.svg/440px-Volvo_logo.svg.png',
        'name': 'volvo',
        'year': 2017,
        'volume': 1000,
        'processed': false
    },
    {
        'id': 31,
        'logo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Toyota_carlogo.svg/500px-Toyota_carlogo.svg.png',
        'name': 'toyota',
        'year': 2016,
        'volume': 1000,
        'processed': true
    },
    {
        'id': 32,
        'logo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Toyota_carlogo.svg/500px-Toyota_carlogo.svg.png',
        'name': 'toyota',
        'year': 2017,
        'volume': 1000,
        'processed': true
    },
    {
        'id': 33,
        'logo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Toyota_carlogo.svg/500px-Toyota_carlogo.svg.png',
        'name': 'toyota',
        'year': 2018,
        'volume': 1000,
        'processed': true
    },
    {
        'id': 41,
        'logo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Honda-logo.svg/460px-Honda-logo.svg.png',
        'name': 'honda',
        'year': 2015,
        'volume': 1000,
        'processed': true
    }
]

const imageRenderer = (instance, td, row, col, prop, value, cellProperties) => {
    if (td.children.length) return td

    const img = document.createElement('img')
    img.src = value
    img.width = '145'

    td.appendChild(img)

    return td
}

const columns = [
    {data: 'id', type: 'numeric', width: 150, readOnly: true},
    {data: 'logo', width: 150, renderer: imageRenderer},
    {data: 'name', type: 'text', width: 150, readOnly: true},
    {data: 'year', type: 'numeric', width: 150, readOnly: true},
    {data: 'volume', type: 'numeric', width: 150, readOnly: true},
    {data: data => data.processed ? 'Yes' : 'No', type: 'text', width: 150, readOnly: true}
]

const colHeaders = ['ID', 'LOGO', 'NAME', 'YEAR', 'VOLUME', 'PROCESSED?']

storiesOf('CustomRenderer', module)
    .add('plain', () => {
        return (
            <HotTableContainer
                mode="debug" logger={action('debug')}
                data={data} columns={columns} colHeaders={colHeaders}
                width="800" height="250"
                columnSorting={true}
                manualColumnMove={true}
                manualColumnResize={true}/>
        )
    })
