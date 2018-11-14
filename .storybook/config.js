import {configure} from '@storybook/react'

function loadStories() {
    require('../src/stories/usage')
    require('../src/stories/tips')
}

configure(loadStories, module)
