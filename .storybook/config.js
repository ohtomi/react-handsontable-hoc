import {configure} from '@storybook/react';

function loadStories() {
    require('../stories/Basic');
    require('../stories/WithRowHeader');
    require('../stories/Callback');
    require('../stories/RowFilter');
}

configure(loadStories, module);
