Page({
  data: {
    family: {},
    // 模拟提醒项数据
    remindList: [
      { id: 1, title: "早上8点测血压", time: "08:00", status: 0 },
      { id: 2, title: "中午12点服药", time: "12:00", status: 1 },
      { id: 3, title: "晚上7点散步30分钟", time: "19:00", status: 0 }
    ]
  },

  onLoad(options) {
    const id = options.familyId;
    const list = wx.getStorageSync('familyList');
    const family = list.find(item => item.id == id);
    this.setData({ family });
  }
});