// @flow

import Handsontable from 'handsontable'

class InitialColumnSortingPlugin extends Handsontable.plugins.BasePlugin {

    constructor(hot) {
        super(hot)

        this.afterUpdateSettings = this.afterUpdateSettings.bind(this)
    }

    isEnabled() {
        const hasColumnSorting = !!this.hot.getSettings().columnSorting
        const hasInitialColumnSorting = !!this.hot.getSettings().initialColumnSorting

        return hasColumnSorting && hasInitialColumnSorting
    }

    enablePlugin() {
        this.initializedThisPlugin = false
        this.hot.addHook('afterUpdateSettings', this.afterUpdateSettings)

        super.enablePlugin()
    }

    disablePlugin() {
        super.disablePlugin()
    }

    updatePlugin() {
        if (!this.initializedThisPlugin) {
            this.initializedThisPlugin = true
            sortColumnByInitialConfig(this.hot)
        }

        super.updatePlugin()
    }

    destroy() {
        this.hot.removeHook('afterUpdateSettings', this.afterUpdateSettings)

        super.destroy()
    }

    afterUpdateSettings(newSettings: any) {
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
    // column is logical index
    if (!(column != null) || !sortOrder) {
        return
    }
    const plugin = hotInstance.getPlugin('columnSorting')
    plugin.sort({column, sortOrder})
}

const pluginName = 'InitialColumnSortingPlugin'

export const getInitialColumnSortingPlugin = (hotInstance: Handsontable) => {
    return hotInstance.getPlugin(pluginName)
}

export const registerInitialColumnSortingPlugin = () => {
    Handsontable.plugins.registerPlugin(pluginName, InitialColumnSortingPlugin)
}
