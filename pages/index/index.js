Page({
  data: {
    statusBarHeight: 0
  },
  onLoad() {
    const { statusBarHeight } = wx.getWindowInfo()
    this.setData({ statusBarHeight })
  }
})
