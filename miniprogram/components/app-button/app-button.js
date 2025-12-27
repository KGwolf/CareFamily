Component({
  properties: {
    text: String,

    type: {
      type: String,
      value: 'primary' // primary | secondary | danger
    },

    block: {
      type: Boolean,
      value: true
    },

    disabled: {
      type: Boolean,
      value: false
    },

    loading: {
      type: Boolean,
      value: false
    }
  },

  methods: {
    onTap() {
      if (this.data.disabled || this.data.loading) return
      // this.triggerEvent('tap') // 加了这个会执行2次点击事件。
    }
  }
})
