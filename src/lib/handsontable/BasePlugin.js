// @flow

import Handsontable from 'handsontable'

export class BasePlugin extends Handsontable.plugins.BasePlugin {

    debug(...messages: any) {
        if (this.hot.getSettings().mode !== 'debug') {
            return
        }
        if (!this.hot.getSettings().logger) {
            return
        }
        const stringifier = (value) => typeof value === 'object' ? JSON.stringify(value) : value
        this.hot.getSettings().logger(this.pluginName, ...messages.map(stringifier))
    }
}
