// app.js
App({
  onLaunch() {
    // 初始化数据
    // try {
    //   let familyList = wx.getStorageSync('familyList');
    //   if (!familyList || familyList.length === 0) {
    //     familyList = [
    //       { id: 1, name: '张爷爷', age: 75, avatar: '/images/default_avatar.png' },
    //       { id: 2, name: '李奶奶', age: 70, avatar: '/images/default_avatar.png' }
    //     ];
    //     wx.setStorageSync('familyList', familyList);
    //   }

    //   let familyMembers = wx.getStorageSync('familyMembers');
    //   if (!familyMembers || familyMembers.length === 0) {
    //     familyMembers = [
    //       { id: 1, name: '小明', role: '儿子', phone: '13800138000' },
    //       { id: 2, name: '小红', role: '女儿', phone: '13900139000' }
    //     ];
    //     wx.setStorageSync('familyMembers', familyMembers);
    //   }

    //   let reminders = wx.getStorageSync('reminders');
    //   if (!reminders || reminders.length === 0) {
    //     reminders = [
    //       { id: 1, familyId: 1, content: '吃药', time: '08:00', status: 'completed', date: '2024-04-05' },
    //       { id: 2, familyId: 1, content: '喝水', time: '12:00', status: 'pending', date: '2024-04-05' },
    //       { id: 3, familyId: 2, content: '散步', time: '18:00', status: 'completed', date: '2024-04-05' },
    //     ];
    //     wx.setStorageSync('reminders', reminders);
    //   }
    // } catch (e) {
    //   console.error("初始化数据失败", e);
    // }
  },
  globalData: {
    userInfo: null
  }
})