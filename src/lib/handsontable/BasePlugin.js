// @flow

import Handsontable from 'handsontable'

export class BasePlugin extends Handsontable.plugins.BasePlugin {

    debug(...messages: any) {
        const {mode, logger} = this.hot.getSettings()
        if (mode !== 'debug') {
            return
        }
        if (!logger) {
            return
        }
        logger(this.pluginName, ...messages)
    }
}
