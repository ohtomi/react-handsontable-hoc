import {configure} from '@storybook/react'

function loadStories() {
    require('../src/stories/Basic')
    require('../src/stories/HiddenColumns')
    require('../src/stories/RowFilter')
    require('../src/stories/SelectionMode')
    require('../src/stories/CustomRenderer')
    require('../src/stories/PersistentState')
    require('../src/stories/Viewport')
}

configure(loadStories, module)
