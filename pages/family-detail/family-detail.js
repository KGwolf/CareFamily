Page({
  data: {
    family: {}
  },

  onLoad(options) {
    const id = options.id;
    const list = wx.getStorageSync('familyList');
    const family = list.find(item => item.id == id);
    this.setData({ family });
  }
});