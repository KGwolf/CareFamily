Page({
  data: {
    isSwiping: false,
    family: {},
    familyReminderList:[]
  },
  loadReminderList(){
    const id = this.data.family.id;
    const remindersList = wx.getStorageSync('reminders') || [];
    const thisFamilyReminders = remindersList.filter(reminder => {
      //还要找提醒时间大于等于今天的
      if (reminder.familyId -0 == id) {
        return true;
      }
      return false;
    });

    this.setData({ familyReminderList:thisFamilyReminders });
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
  handleDeleteReminder(e){
    const reminderItem = e.currentTarget.dataset.item;

    // 二次确认弹窗
    wx.showModal({
      title: '确认删除',
      content: `是否确定删除？删除后不可恢复`,
      cancelText: '取消',
      confirmText: '删除',
      confirmColor: '#e63946',
      success: (res) => {
        if (res.confirm) {
         
          const remindersList = wx.getStorageSync('reminders') || [];
          const afterDeleteReminders = remindersList.filter(reminder => {
            if (reminder.id - 0 !== reminderItem.id) {
              return true;
            }
            return false;
          });
          wx.setStorageSync('reminders', afterDeleteReminders);
          this.loadReminderList();
          // 4. 提示删除成功
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 1500
          });
        }
      }
    });
  },
  swipeTouchStart(e) {
    const touch = e.touches[0];
    this.startX = touch.clientX;
    this.startY = touch.clientY;
    this.isSwiping = false;
  },

  swipeTouchMove(e) {
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - this.startX);
    const deltaY = Math.abs(touch.clientY - this.startY);

    if (deltaX > deltaY && deltaX > 5) {
      // 横向滑动优先
      this.isSwiping = true;
      e.stopPropagation(); // 阻止 scroll-view 滚动
    } else {
      this.isSwiping = false;
    }
  },

  // 可选：在 swipe-cell open/close 时做处理
  onSwipeOpen(e) {
    console.log('打开', e.currentTarget.dataset.index);
  },
  onSwipeClose(e) {
    console.log('关闭', e.currentTarget.dataset.index);
  },
});