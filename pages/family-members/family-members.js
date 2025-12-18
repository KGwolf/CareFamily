Page({
  data: {
    familyMembers: []
  },

  onLoad() {
    this.setData({
      familyMembers: wx.getStorageSync('familyMembers')
    });
  }
});