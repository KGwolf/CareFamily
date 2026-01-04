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
      //还要找提醒时间大于等于今天的
      if (reminder.familyId -0 == id) {
        return true;
      }
      return false;
    });

    this.setData({ family:family,familyReminderList:thisFamilyReminders });

  },
  onAddReminder(){
    // 跳转到添加提醒页面，携带家人信息
    wx.navigateTo({
      url: `/pages/add-reminder/add-reminder?familyId=${this.data.family.id}&familyName=${this.data.family.name}`
    });
  },
});