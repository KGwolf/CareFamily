Page({
  data: {
    completionRate: 0,
    streakDays: 0,
    totalReminders: 0,
    familyId: ''
  },

  onLoad(options) {
    this.setData({ familyId: options.familyId });
    this.calculateStats();
  },

  calculateStats() {
    const reminders = wx.getStorageSync('reminders') || [];
    const today = new Date().toISOString().split('T')[0];
    const completedToday = reminders.filter(r => r.familyId == this.data.familyId && r.date == today && r.status === 'completed').length;
    const totalToday = reminders.filter(r => r.familyId == this.data.familyId && r.date == today).length;

    const completionRate = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;
    const streakDays = 3; // 模拟连续天数
    const totalReminders = reminders.filter(r => r.familyId == this.data.familyId).length;

    this.setData({
      completionRate,
      streakDays,
      totalReminders
    });
  }
});