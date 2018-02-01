import {configure} from '@storybook/react';

function loadStories() {
    require('../stories/Basic');
    require('../stories/Callback');
    require('../stories/RowFilter');
    require('../stories/SelectionMode');
    require('../stories/Viewport');
    require('../stories/CustomRenderer');
}

configure(loadStories, module);
