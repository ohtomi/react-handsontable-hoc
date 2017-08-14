import {configure} from '@storybook/react';

function loadStories() {
    require('../stories/Basic');
    require('../stories/Callback');
    require('../stories/WithRowHeader');
}

configure(loadStories, module);
