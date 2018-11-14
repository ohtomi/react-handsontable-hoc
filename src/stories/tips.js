import React from 'react'
import {storiesOf} from '@storybook/react'

import {CustomRendererStory} from './CustomRendererStory'
import {ViewportStory} from './ViewportStory'


storiesOf('Tips', module)
    .add('custom renderer', CustomRendererStory)
    .add('viewport', ViewportStory)
