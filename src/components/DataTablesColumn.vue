<template>
  <el-table-column
    v-if="visible"
    :prop="prop"
    :label="label"
    :width="width"
    :min-width="minWidth"
    :fixed="fixed"
    :sortable="sortable"
    :sort-method="sortMethod"
    :sort-by="sortBy"
    :sort-orders="sortOrders"
    :resizable="resizable"
    :formatter="formatter"
    :align='align'
    :header-align="headerAlign"
    :render-header="renderHeader"
    :class-name="getClassName"
    :label-class-name="headerHighlight"
    :filters="[]"
  >
    <template slot-scope="scope">
      <slot :row="scope.row" :$index="scope.$index" >
        <span>{{ formatMethod(scope.row[prop]) }}</span>
      </slot>
    </template>
  </el-table-column>
</template>

<script>
import { isEmpty } from 'lodash'

export default {
  name: 'dataTablesColumn',
  props: {
    prop: {
      type: String
    },
    label: {
      type: String
    },
    width: {
      type: Number
    },
    minWidth: {
      type: Number
    },
    fixed: {
      type: [String, Boolean]
    },
    renderType: {
      type: String,
      validator: value => ['date', 'datetime', 'input', 'select'].includes(value)
    },
    placeholder: {
      type: String
    },
    renderWidth: {
      type: String,
      default: () => '230px'
    },
    value: {
      type: [String, Array],
      default: () => ''
    },
    data: {
      type: Array
    },
    dateFormat: {
      type: String,
      default: () => 'yyyy-MM-dd'
    },
    dateTimeFormat: {
      type: String,
      default: () => 'yyyy-MM-dd HH:mm:ss'
    },
    defaultTime: {
      type: Array,
      default: () => ['00:00:00', '23:59:59']
    },
    clearable: {
      type: Boolean,
      default: () => true
    },
    sortable: {
      type: [Boolean, String],
      default: () => false
    },
    sortMethod: {
      type: Function
    },
    sortBy: {
      type: Function
    },
    sortOrders: {
      type: Array,
      default: () => ['ascending', 'descending', null]
    },
    resizable: {
      type: Boolean,
      default: () => false
    },
    visible: {
      type: Boolean,
      default: () => true
    },
    filterIcon: {
      type: String,
      default: () => 'el-icon-search'
    },
    callback: {
      type: Function
    },
    formatter: {
      type: Function,
      default: (row, column, cellValue) => cellValue
    },
    align: {
      type: String
    },
    headerAlign: {
      type: String
    },
    className: {
      type: String
    }
  },
  computed: {
    getClassName() {
      return 'data-tables-column' + (isEmpty(this.className) ? '' : ' ' + this.className)
    },
    headerHighlight() {
      return isEmpty(this.value) ? '' : 'highlight'
    }
  },
  data() {
    return {
      formatD: this.filterIcon
    }
  },

  methods: {
    formatMethod(value) {
      return this.formatter('', '', value)
    },
    renderHeader(createElement, { column, $index }) {
      switch (this.renderType) {
        case 'date':
          return this.renderDate(createElement, { column, $index })

        case 'datetime':
          return this.renderDateTime(createElement, { column, $index })

        case 'input':
          return this.renderInput(createElement, { column, $index })

        case 'select':
          return this.renderSelect(createElement, { column, $index })

        default:
          return column.label
      }
    },
    renderInput(createElement, { column, $index }) {
      return createElement(
        'div',
        {
          class: 'el-table__column-filter-popover',
          style: {
            color: column.color
          }
        },
        [
          createElement(
            'el-popover',
            {
              props: {
                placement: 'bottom',
                width: '200',
                trigger: 'click'
              }
            },
            [
              createElement('el-input', {
                props: {
                  placeholder: this.placeholder,
                  value: this.value,
                  clearable: this.clearable
                },
                nativeOn: {
                  keyup: event => {
                    if (event.keyCode === 13) {
                      this.$emit('input', event.target.value)
                      this.callback && this.callback(this.prop, event.target.value)
                    }
                  }
                },
                on: {
                  input: value => {
                    if (value !== undefined) {
                      this.$emit('input', value)
                    }
                  },
                  blur: event => {
                    let value = event.target.value !== undefined ? event.target.value : this.value
                    this.$emit('input', value)
                    this.callback && this.callback(this.prop, value)
                  }
                }
              }),
              createElement(
                'span',
                {
                  slot: 'reference'
                },
                [
                  column.label,
                  createElement('i', {
                    class: this.filterIcon,
                    style: {
                      marginLeft: '4px'
                    }
                  })
                ]
              )
            ]
          )
        ]
      )
    },
    renderSelect(createElement, { column, $index }) {
      return createElement(
        'div',
        {
          class: 'el-table__column-filter-popover',
          style: {
            color: column.color
          }
        },
        [
          createElement(
            'el-popover',
            {
              props: {
                placement: 'bottom',
                width: '200',
                trigger: 'click'
              }
            },
            [
              createElement(
                'el-select',
                {
                  props: {
                    placeholder: this.placeholder,
                    value: this.value,
                    clearable: this.clearable
                  },
                  on: {
                    input: value => {
                      this.$emit('input', value)
                      this.callback && this.callback(this.prop, value)
                    }
                  }
                },
                [
                  this.data.map(item => {
                    return createElement('el-option', {
                      props: {
                        value: item.value,
                        label: item.label
                      }
                    })
                  })
                ]
              ),
              createElement(
                'span',
                {
                  slot: 'reference'
                },
                [
                  column.label,
                  createElement('i', {
                    class: this.filterIcon,
                    style: {
                      marginLeft: '4px'
                    }
                  })
                ]
              )
            ]
          )
        ]
      )
    },
    renderDate(createElement, { column, $index }) {
      return createElement(
        'div',
        {
          class: 'el-table__column-filter-popover'
        },
        [
          createElement(
            'el-popover',
            {
              props: {
                placement: 'bottom',
                width: this.renderWidth,
                trigger: 'click'
              }
            },
            [
              createElement('el-date-picker', {
                props: {
                  placeholder: this.placeholder,
                  value: this.value,
                  type: 'daterange',
                  rangeSeparator: '—', // 至
                  startPlaceholder: 'Start date', // 开始日期
                  endPlaceholder: 'End date', //  结束日期
                  format: this.dateFormat,
                  valueFormat: this.dateFormat,
                  clearable: this.clearable
                },
                style: {
                  width: this.renderWidth
                },
                on: {
                  input: value => {
                    if (value) {
                      this.$emit('input', value)
                      this.callback && this.callback(this.prop, value)
                    }
                  },
                  change: value => {
                    if (value === null) {
                      this.$emit('input', [])
                      this.callback && this.callback(this.prop, value)
                    }
                  }
                }
              }),
              createElement(
                'span',
                {
                  slot: 'reference'
                },
                [
                  column.label,
                  createElement('i', {
                    class: this.filterIcon,
                    style: {
                      marginLeft: '4px'
                    }
                  })
                ]
              )
            ]
          )
        ]
      )
    },
    renderDateTime(createElement, { column, $index }) {
      return createElement(
        'div',
        {
          class: 'el-table__column-filter-popover'
        },
        [
          createElement(
            'el-popover',
            {
              props: {
                placement: 'bottom',
                width: this.renderWidth,
                trigger: 'click'
              }
            },
            [
              createElement('el-date-picker', {
                props: {
                  placeholder: this.placeholder,
                  value: this.value,
                  type: 'datetimerange',
                  rangeSeparator: 'To', // 至
                  startPlaceholder: 'Start date', // 开始日期
                  endPlaceholder: 'End date', //  结束日期
                  format: this.dateTimeFormat,
                  valueFormat: this.dateTimeFormat,
                  defaultTime: this.defaultTime,
                  clearable: this.clearable
                },
                style: {
                  width: this.renderWidth
                },
                on: {
                  input: value => {
                    if (value) {
                      this.$emit('input', value)
                      this.callback && this.callback(this.prop, value)
                    }
                  },
                  change: value => {
                    if (value === null) {
                      this.$emit('input', [])
                      this.callback && this.callback(this.prop, value)
                    }
                  }
                }
              }),
              createElement(
                'span',
                {
                  slot: 'reference'
                },
                [
                  column.label,
                  createElement('i', {
                    class: this.filterIcon,
                    style: {
                      marginLeft: '4px'
                    }
                  })
                ]
              )
            ]
          )
        ]
      )
    }
  }
}
</script>
