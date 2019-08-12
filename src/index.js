import DataTables from './components/DataTables'
import DataTablesServer from './components/DataTablesServer'
import DataTablesColumn from './components/DataTablesColumn'

DataTables.install = function(Vue) {
  Vue.component(DataTables.name, DataTables)
}

DataTablesServer.install = function(Vue) {
  Vue.component(DataTablesServer.name, DataTablesServer)
}

DataTablesColumn.install = function(Vue) {
  Vue.component(DataTablesColumn.name, DataTablesColumn)
}

let install = function(Vue) {
  DataTables.install(Vue)
  DataTablesServer.install(Vue)
  DataTablesColumn.install(Vue)
}

export {
  install,
  DataTables,
  DataTablesServer,
  DataTablesColumn
}

export default {
  install
}
