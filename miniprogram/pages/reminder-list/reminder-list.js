Page({
  data: {
    reminders: [],
    familyId: ''
  },

  onLoad(options) {
    this.setData({ familyId: options.familyId });
    this.loadReminders();
  },

  loadReminders() {
    const reminders = wx.getStorageSync('reminders') || [];
    this.setData({ reminders });
  }
});