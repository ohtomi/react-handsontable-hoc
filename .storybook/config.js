import {configure} from '@storybook/react'

function loadStories() {
    require('../src/stories/Basic')
    require('../src/stories/Callback')
    require('../src/stories/HiddenColumns')
    require('../src/stories/RowFilter')
    require('../src/stories/SelectionMode')
    require('../src/stories/Viewport')
    require('../src/stories/PersistentState')
    require('../src/stories/CustomRenderer')
}

configure(loadStories, module)
