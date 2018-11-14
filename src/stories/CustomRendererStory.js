import React from 'react'
import {action} from '@storybook/addon-actions'

import {Handsontable, HotTableContainer} from '../lib'


const data = [
    {'logo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Ford_Motor_Company_Logo.svg/440px-Ford_Motor_Company_Logo.svg.png'},
    {'logo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Ford_Motor_Company_Logo.svg/440px-Ford_Motor_Company_Logo.svg.png'},
    {'logo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Ford_Motor_Company_Logo.svg/440px-Ford_Motor_Company_Logo.svg.png'},
    {'logo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Ford_Motor_Company_Logo.svg/440px-Ford_Motor_Company_Logo.svg.png'},
    {'logo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Volvo_logo.svg/440px-Volvo_logo.svg.png'},
    {'logo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Volvo_logo.svg/440px-Volvo_logo.svg.png'},
    {'logo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Volvo_logo.svg/440px-Volvo_logo.svg.png'},
    {'logo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Volvo_logo.svg/440px-Volvo_logo.svg.png'},
    {'logo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Toyota_carlogo.svg/500px-Toyota_carlogo.svg.png'},
    {'logo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Toyota_carlogo.svg/500px-Toyota_carlogo.svg.png'},
    {'logo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Toyota_carlogo.svg/500px-Toyota_carlogo.svg.png'},
    {'logo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Honda-logo.svg/460px-Honda-logo.svg.png'}
]

const imageRenderer = (instance, td, row, col, prop, value, cellProperties) => {
    const img = document.createElement('img')
    img.src = value
    img.width = '150'
    img.style.margin = '10px'

    Handsontable.dom.empty(td)
    td.appendChild(img)

    return td
}

const columns = [
    {data: 'logo', width: 200, renderer: imageRenderer},
    {data: 'logo', width: 200, renderer: imageRenderer},
    {data: 'logo', width: 200, renderer: imageRenderer},
    {data: 'logo', width: 200, renderer: imageRenderer}
]

const colHeaders = true

export const CustomRendererStory = () => {
    return (
        <HotTableContainer
            mode="debug" logger={action('debug')}
            data={data} columns={columns} colHeaders={colHeaders}
            width="800" height="350"
        />
    )
}
