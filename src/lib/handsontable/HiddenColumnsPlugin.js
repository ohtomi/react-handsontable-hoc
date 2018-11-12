// @flow

import Handsontable from 'handsontable'

// see. https://github.com/handsontable/handsontable/blob/6.1.1/src/plugins/manualColumnResize/manualColumnResize.js#L459
const MinimumColumnWidthByManual = 20

const HiddenColumnWidth = 1e-20

class HiddenColumnsPlugin extends Handsontable.plugins.BasePlugin {

    isEnabled() {
        return !!this.hot.getSettings().manualColumnResize
    }

    enablePlugin() {
        this.columnWidths = []

        super.enablePlugin()
    }

    disablePlugin() {
        super.disablePlugin()
    }

    updatePlugin() {
        super.updatePlugin()
    }

    destroy() {
        super.destroy()
    }

    hideColumns(hiddenColumns: Array<number>) {
        this.columnWidths = preserveColumnWidth(this.hot)
        const manualColumnResize = resizeColumnWidth(this.hot, this.columnWidths, hiddenColumns)
        this.hot.updateSettings({manualColumnResize})
        const plugin = this.hot.getPlugin('ManualColumnResize')
        plugin.saveManualColumnWidths()
    }
}

const preserveColumnWidth = (hotInstance: Handsontable) => {
    const columns = hotInstance.getSettings().columns
    const widths = columns.map(c => null)
    const manualColumnResize = hotInstance.getSettings().manualColumnResize
    if (Array.isArray(manualColumnResize)) {
        manualColumnResize.forEach((w, i) => {
            if (w && w >= MinimumColumnWidthByManual) {
                widths[i] = w
            }
        })
    }
    return widths
}

const resizeColumnWidth = (hotInstance: Handsontable, currentWidths: Array<?number>, hiddenColumns: Array<number>) => {
    // hiddenColumns is logical index
    return currentWidths.map((w, i) => {
        return hiddenColumns.some(c => c === i) ? HiddenColumnWidth : w
    })
}

const pluginName = 'HiddenColumnsPlugin'

export const getHiddenColumnsPlugin = (hotInstance: Handsontable) => {
    return hotInstance.getPlugin(pluginName)
}

export const registerHiddenColumnsPlugin = () => {
    Handsontable.plugins.registerPlugin(pluginName, HiddenColumnsPlugin)
}
