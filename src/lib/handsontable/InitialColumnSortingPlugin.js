// @flow

import Handsontable from 'handsontable'

class InitialColumnSortingPlugin extends Handsontable.plugins.BasePlugin {

    constructor(hot) {
        super(hot)

        this.afterUpdateSettings = this.afterUpdateSettings.bind(this)
    }

    debug(...messages: any) {
        if (this.hot.getSettings().mode !== 'debug') {
            return
        }
        if (!this.hot.getSettings().logger) {
            return
        }
        const stringifier = (value) => typeof value === 'object' ? JSON.stringify(value) : value
        this.hot.getSettings().logger('InitialColumnSortingPlugin', ...messages.map(stringifier))
    }

    isEnabled() {
        this.debug('isEnabled')

        const hasColumnSorting = !!this.hot.getSettings().columnSorting
        const hasInitialColumnSorting = !!this.hot.getSettings().initialColumnSorting

        return hasColumnSorting && hasInitialColumnSorting
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
                sortColumnByInitialConfig(this.hot)
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

        if (newSettings.data) {
            sortColumnByInitialConfig(this.hot)
        }
    }
}

const sortColumnByInitialConfig = (hotInstance: Handsontable) => {
    const {column, sortOrder} = selectSortConfig(hotInstance)
    sortColumn(hotInstance, column, sortOrder)
}

const selectSortConfig = (hotInstance: Handsontable) => {
    const persistentSortConfig = loadFromLocalStorage(hotInstance)
    if (persistentSortConfig) {
        return persistentSortConfig
    }
    const initialSortConfig = getFromSettings(hotInstance)
    if (initialSortConfig) {
        return initialSortConfig
    }
}

const loadFromLocalStorage = (hotInstance: Handsontable) => {
    const plugin = hotInstance.getPlugin('PersistentState')
    if (!plugin.isEnabled()) {
        return
    }
    const saveTo = {}
    plugin.loadValue('columnSorting', saveTo)
    if (saveTo.value && saveTo.value.initialConfig && saveTo.value.initialConfig.length) {
        return saveTo.value.initialConfig[0]
    } else if (saveTo.value && saveTo.value.initialConfig && !saveTo.value.initialConfig.length) {
        return {}
    }
}

const getFromSettings = (hotInstance: Handsontable) => {
    const columnSorting = hotInstance.getSettings().initialColumnSorting
    if (columnSorting && columnSorting.initialConfig) {
        return columnSorting.initialConfig
    }
}

const sortColumn = (hotInstance: Handsontable, column?: number, sortOrder?: 'asc' | 'desc' | '') => {
    // column is physical column index
    if (!(column != null) || !sortOrder) {
        return
    }
    const visual = hotInstance.toVisualColumn(column)
    const plugin = hotInstance.getPlugin('columnSorting')
    plugin.sort({column: visual, sortOrder})
}

const pluginName = 'InitialColumnSortingPlugin'

export const getInitialColumnSortingPlugin = (hotInstance: Handsontable) => {
    return hotInstance.getPlugin(pluginName)
}

export const registerInitialColumnSortingPlugin = () => {
    Handsontable.plugins.registerPlugin(pluginName, InitialColumnSortingPlugin)
}
