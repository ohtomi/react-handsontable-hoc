import React from 'react'
import {storiesOf} from '@storybook/react'

import {BasicStory} from './BasicStory'
import {RowSelectionStory} from './RowSelectionStory'
import {InitialColumnSortingStory} from './InitialColumnSortingStory'
import {HiddenColumnsStory} from './HiddenColumnsStory'
import {RowFilterStory} from './RowFilterStory'
import {PersistentStateStory} from './PersistentStateStory'


storiesOf('Usage', module)
    .add('basic', () => <BasicStory/>)
    .add('row selection', RowSelectionStory)
    .add('initial column sorting', InitialColumnSortingStory)
    .add('manual columns hide', HiddenColumnsStory)
    .add('row filter', RowFilterStory)
    .add('persistent state', PersistentStateStory)
