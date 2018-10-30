import {configure} from '@storybook/react';
import 'handsontable/dist/handsontable.full.css';

function loadStories() {
    require('../stories/Basic');
    require('../stories/Callback');
    require('../stories/RowFilter');
    require('../stories/SelectionMode');
    require('../stories/Viewport');
    require('../stories/CustomRenderer');
}

configure(loadStories, module);
