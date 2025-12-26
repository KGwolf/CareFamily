Page({
  data: {
    content: '',
    selectedTime: '08:00',
    familyId: '',
    familyName:''
  },
/**
   * 生命周期函数--监听页面加载
   * options 会自动携带URL中传递的参数
   */
onLoad(options) {
  // 从options中取出参数，赋值到data中
  this.setData({
    familyId: options.familyId,   // 对应URL中的?familyId=xxx
    familyName: options.familyName // 对应URL中的&familyName=xxx
  });
},
  onContentChange(e) {
    this.setData({ content: e.detail.value });
  },

  onTimeChange(e) {
    this.setData({ selectedTime: e.detail.value });
  },

  saveReminder() {
    if (!this.data.content) return wx.showToast({ title: '请输入提醒内容', icon: 'none' });

    const reminders = wx.getStorageSync('reminders') || [];
    const newReminder = {
      id: reminders.length + 1,
      familyId: this.data.familyId,
      content: this.data.content,
      time: this.data.selectedTime,
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };

    reminders.push(newReminder);
    wx.setStorageSync('reminders', reminders);

    wx.showToast({ title: '添加成功' });
    wx.navigateBack();
  },

  onLoad(options) {
    this.setData({ familyId: options.familyId });
  }
});