// @flow

import Handsontable from 'handsontable'
import {BasePlugin} from './BasePlugin'

class RowSelectionPlugin extends BasePlugin {

    constructor(hot) {
        super(hot)

        this.beforeOnCellMouseDown = this.beforeOnCellMouseDown.bind(this)
        this.afterSelection = this.afterSelection.bind(this)
    }

    isEnabled() {
        this.debug('isEnabled')

        return this.hot.getSettings().selectionMode === 'row'
    }

    enablePlugin() {
        this.debug('enablePlugin', this.enabled)

        if (this.enabled) {
            return
        }

        this.selectingCells = false
        this.hot.addHook('beforeOnCellMouseDown', this.beforeOnCellMouseDown)
        this.hot.addHook('afterSelection', this.afterSelection)

        Handsontable.hooks.register('afterRowSelection')

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

        this.hot.removeHook('beforeOnCellMouseDown', this.beforeOnCellMouseDown)
        this.hot.removeHook('afterSelection', this.afterSelection)

        super.destroy()
    }

    beforeOnCellMouseDown(ev: MouseEvent, coords: { row: number }, td: HTMLElement) {
        // In case the row/column header was clicked, the index is negative.
        this.debug('beforeOnCellMouseDown', ev, coords, td)

        this.selectingCells = coords.row >= 0
    }

    afterSelection(r1: number, c1: number, r2: number, c2: number, preventScrolling: { value: boolean }) {
        this.debug('afterSelection', r1, c1, r2, c2, preventScrolling)

        if (!this.selectingCells) {
            return
        }
        const fromCol = 0
        const toCol = this.hot.countCols() - 1
        const selected = this.hot.getSelectedRangeLast()
        if (r1 === selected.from.row && c1 === fromCol && r2 === selected.to.row && c2 === toCol) {
            this.hot.runHooks('afterRowSelection', resolveSelectionRows(this.hot, r1, r2))
            return
        }
        this.hot.selectRows(r1, r2)
    }
}

const resolveSelectionRows = (hotInstance: Handsontable, r1: number, r2: number) => {
    return Array.from({length: Math.max(r1, r2) - Math.min(r1, r2) + 1})
        .reduce((output, value, index) => output.concat(hotInstance.toPhysicalRow(index + Math.min(r1, r2))), [])
}

const pluginName = 'RowSelectionPlugin'

export const getRowSelectionPlugin = (hotInstance: Handsontable) => {
    return hotInstance.getPlugin(pluginName)
}

export const registerRowSelectionPlugin = () => {
    Handsontable.plugins.registerPlugin(pluginName, RowSelectionPlugin)
}
