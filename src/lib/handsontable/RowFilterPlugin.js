// @flow

import Handsontable from 'handsontable'
import {BasePlugin} from './BasePlugin'

import './RowFilterPlugin.css'

class RowFilterPlugin extends BasePlugin {

    constructor(hot) {
        super(hot)

        this.afterUpdateSettings = this.afterUpdateSettings.bind(this)
        this.onClickColHeaderButton = this.onClickColHeaderButton.bind(this)
    }

    isEnabled() {
        this.debug('isEnabled')

        return !!this.hot.getSettings().rowFilter
    }

    enablePlugin() {
        this.debug('enablePlugin', this.enabled)

        if (this.enabled) {
            return
        }

        this.hot.addHook('afterUpdateSettings', this.afterUpdateSettings)

        Handsontable.hooks.register('afterRowFiltering')
        Handsontable.hooks.register('onClickColHeaderButton')

        const that = this
        this.hot._registerTimeout(
            setTimeout(() => {
                that.filterRow()
                that.replaceColHeaders()
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
        Handsontable.dom.removeEvent(this.hot.rootElement, 'mousedown', this.onClickColHeaderButton)

        super.destroy()
    }

    afterUpdateSettings(newSettings: any) {
        this.debug('afterUpdateSettings', newSettings)

        if (newSettings.hasOwnProperty('data2')) {
            this.filterRow()
        }
        if (newSettings.hasOwnProperty('rowFilter')) {
            this.filterRow()
            this.replaceColHeaders()
        }
    }

    filterRow() {
        this.debug('filterRow')

        const {data2, columns, rowFilter} = this.hot.getSettings()
        const data = rowFilter.evaluate(data2, columns)
        this.hot.updateSettings({data})
        this.hot.runHooks('afterRowFiltering', data.length)
    }

    onClickColHeaderButton(ev: MouseEvent) {
        this.debug('onClickColHeaderButton', ev)

        if (ev.target.nodeName === 'BUTTON') {
            ev.stopPropagation()

            const column = +ev.target.dataset.column
            this.hot.runHooks('onClickColHeaderButton', column)
        }
    }

    replaceColHeaders() {
        this.debug('replaceColHeaders')

        const {colHeaders2, colHeaderButtonClassName} = this.hot.getSettings()
        const renderer = (column) => {
            const label = colHeaders2[column]
            const hidden = false
            const active = false
            const classNames = `react-handsontable-hoc_column-header-button ${colHeaderButtonClassName} ${hidden ? 'hidden' : ''} ${active ? 'active' : ''}`
            const button = `<button class="${classNames}" data-column="${column}">\u25BC</button>`
            return label + button
        }
        this.hot.updateSettings({colHeaders: renderer})

        Handsontable.dom.addEvent(this.hot.rootElement, 'mousedown', this.onClickColHeaderButton)
    }
}

const pluginName = 'RowFilterPlugin'

export const getRowFilterPlugin = (hotInstance: Handsontable) => {
    return hotInstance.getPlugin(pluginName)
}

export const registerRowFilterPlugin = () => {
    Handsontable.plugins.registerPlugin(pluginName, RowFilterPlugin)
}
