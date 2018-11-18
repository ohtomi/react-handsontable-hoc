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
    const {data, data2} = hotInstance.getSettings()

    const resolve = (physical) => {
        const source = hotInstance.getSourceDataAtRow(physical)
        if (Array.isArray(source)) {
            // source is array
            if (data.length > data2.length) {
                // source has physical row index at last
                return source[source.length - 1]
            } else {
                return physical
            }
        } else {
            // source is object
            if (source.hasOwnProperty('__index__')) {
                // source has physical row index as __index__
                return source['__index__']
            } else {
                return physical
            }
        }
    }

    return Array.from({length: Math.max(r1, r2) - Math.min(r1, r2) + 1})
        .reduce((output, value, index) => {
            const visual = index + Math.min(r1, r2)
            const physical = hotInstance.toPhysicalRow(visual)
            return output.concat(resolve(physical))
        }, [])
}

const pluginName = 'RowSelectionPlugin'

export const getRowSelectionPlugin = (hotInstance: Handsontable) => {
    return hotInstance.getPlugin(pluginName)
}

export const registerRowSelectionPlugin = () => {
    Handsontable.plugins.registerPlugin(pluginName, RowSelectionPlugin)
}
