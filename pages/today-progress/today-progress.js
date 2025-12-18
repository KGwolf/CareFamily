Page({
  data: {
    reminders: [],
    familyId: '',
    todayDate: ''
  },

  onLoad(options) {
    this.setData({ familyId: options.familyId });
    const today = new Date().toISOString().split('T')[0];
    this.setData({ todayDate: today });
    this.loadReminders();
  },

  loadReminders() {
    const reminders = wx.getStorageSync('reminders') || [];
    this.setData({ reminders });
  }
});