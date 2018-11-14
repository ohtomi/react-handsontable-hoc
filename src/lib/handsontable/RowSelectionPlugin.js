// @flow

import Handsontable from 'handsontable'

class RowSelectionPlugin extends Handsontable.plugins.BasePlugin {

    constructor(hot) {
        super(hot)

        this.beforeOnCellMouseDown = this.beforeOnCellMouseDown.bind(this)
        this.afterSelection = this.afterSelection.bind(this)
    }

    isEnabled() {
        return this.hot.getSettings().selectionMode === 'row'
    }

    enablePlugin() {
        this.selectingCells = false
        this.hot.addHook('beforeOnCellMouseDown', this.beforeOnCellMouseDown)
        this.hot.addHook('afterSelection', this.afterSelection)

        Handsontable.hooks.register('afterRowSelection')

        super.enablePlugin()
    }

    disablePlugin() {
        super.disablePlugin()
    }

    updatePlugin() {
        super.updatePlugin()
    }

    destroy() {
        this.hot.removeHook('beforeOnCellMouseDown', this.beforeOnCellMouseDown)
        this.hot.removeHook('afterSelection', this.afterSelection)

        super.destroy()
    }

    beforeOnCellMouseDown(ev: MouseEvent, coords: { row: number }, td: HTMLElement) {
        // In case the row/column header was clicked, the index is negative.
        this.selectingCells = coords.row >= 0
    }

    afterSelection(r1: number, c1: number, r2: number, c2: number, preventScrolling: { value: boolean }) {
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
