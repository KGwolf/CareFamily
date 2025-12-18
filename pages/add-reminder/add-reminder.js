Page({
  data: {
    content: '',
    selectedTime: '08:00',
    familyId: ''
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