// pages/family-list/family-list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    familyList: [],
    btnDisabled: false // 按钮禁用状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      familyList: wx.getStorageSync('familyList') || []
    });
  },
  handleMyBtnClick() {
    wx.navigateTo({
      url: '/pages/add-family/add-family' // 替换为你的添加家人页面路径
    });
  },
  // 可选：页面显示时刷新数据（防止返回时数据未更新）
  onShow() {
    const cacheFamilyList = wx.getStorageSync('familyList') || [];
    this.setData({
      familyList: cacheFamilyList
    });
  }
})