Page({
  data: {
    family: {},
    familyReminderList:[]
  },

  onLoad(options) {
    const id = options.familyId;
    const list = wx.getStorageSync('familyList');
    const family = list.find(item => item.id == id);

    const remindersList = wx.getStorageSync('reminders') || [];
    const thisFamilyReminders = remindersList.filter(reminder => {
      if (reminder.familyId -0 == id) {
        return true;
      }
      return false;
    });

    this.setData({ family:family,familyReminderList:thisFamilyReminders });

  }
});