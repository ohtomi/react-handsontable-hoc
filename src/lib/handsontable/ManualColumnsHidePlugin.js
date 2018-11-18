// @flow

import Handsontable from 'handsontable'
import {BasePlugin} from './BasePlugin'

// see. https://github.com/handsontable/handsontable/blob/6.1.1/src/plugins/manualColumnResize/manualColumnResize.js#L459
const MinimumColumnWidthByManual = 20

const HiddenColumnWidth = 1e-20

class ManualColumnsHidePlugin extends BasePlugin {

    constructor(hot) {
        super(hot)

        this.afterUpdateSettings = this.afterUpdateSettings.bind(this)
    }

    isEnabled() {
        this.debug('isEnabled')

        const hasManualColumnsHide = !!this.hot.getSettings().manualColumnsHide
        const hasManualColumnResize = !!this.hot.getSettings().manualColumnResize

        return hasManualColumnsHide && hasManualColumnResize
    }

    enablePlugin() {
        this.debug('enablePlugin', this.enabled)

        if (this.enabled) {
            return
        }

        this.hot.addHook('afterUpdateSettings', this.afterUpdateSettings)

        const that = this
        this.hot._registerTimeout(
            setTimeout(() => {
                if (Array.isArray(that.hot.getSettings().manualColumnsHide)) {
                    that.hideColumns(that.hot.getSettings().manualColumnsHide)
                }
            }, 0))

        super.enablePlugin()
    }

    disablePlugin() {
        this.debug('disablePlugin')
        super.disablePlugin()
    }

    updatePlugin() {
        this.debug('updatePlugin')
        super.updatePlugin()
    }

    destroy() {
        this.debug('destroy')

        this.hot.removeHook('afterUpdateSettings', this.afterUpdateSettings)

        super.destroy()
    }

    afterUpdateSettings(newSettings: any) {
        this.debug('afterUpdateSettings', newSettings)

        if (newSettings.manualColumnsHide) {
            if (Array.isArray(newSettings.manualColumnsHide)) {
                this.hideColumns(newSettings.manualColumnsHide)
            }
        }
    }

    hideColumns(hiddenColumns: Array<number>) {
        this.debug('hideColumns', hiddenColumns)

        const columnWidths = preserveColumnWidth(this.hot)
        const manualColumnResize = resizeColumnWidth(this.hot, columnWidths, hiddenColumns)
        this.hot.updateSettings({manualColumnResize})
        const plugin = this.hot.getPlugin('ManualColumnResize')
        plugin.saveManualColumnWidths()
    }
}

const preserveColumnWidth = (hotInstance: Handsontable) => {
    const numOfColumns = hotInstance.countCols()
    const widths = Array.from({length: numOfColumns}).map(c => null)
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

export const isHiddenColumn = (width: ?number, column: number) => {
    return width && width < MinimumColumnWidthByManual && i === column
}

const pluginName = 'ManualColumnsHidePlugin'

export const getManualColumnsHidePlugin = (hotInstance: Handsontable) => {
    return hotInstance.getPlugin(pluginName)
}

export const registerManualColumnsHidePlugin = () => {
    Handsontable.plugins.registerPlugin(pluginName, ManualColumnsHidePlugin)
}
