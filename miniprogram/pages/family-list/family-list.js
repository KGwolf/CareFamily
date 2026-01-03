Page({
  data: {
    familyList: [],
    slideOffset: [] // 存储每个卡片的滑动偏移量（负数表示左滑，显示操作栏）
  },
  // 封装刷新方法，供当前页主动调用
  loadFamilyList() {
    // 从缓存获取家人列表
    const cacheFamilyList = wx.getStorageSync('familyList') || [];
    const slideOffset = cacheFamilyList.map(() => 0);
    this.setData({ 
      familyList: cacheFamilyList,
      slideOffset
    });
  },
  // 点击卡片：跳转家人详情页（完整功能）
  handleGoFamilyDetail(e) {
    const familyItem = e.currentTarget.dataset.item;
      // 跳转到添加提醒页面，携带家人信息
    wx.navigateTo({
      url: `/pages/family-detail/family-detail?familyId=${familyItem.id}&familyName=${familyItem.name}`
    });
  },
  onLoad() {
    this.loadFamilyList();
  },
  onShow(){
    this.loadFamilyList();
  },

   // 右滑/点击空白处 关闭按钮区（Vant组件自带）
   onSwipeClose() {},

   // 编辑按钮点击
   handleEdit(e) {
     const item = e.currentTarget.dataset.item;
     wx.showToast({ title: `编辑${item.name}` });
   },
 
   // 添加提醒按钮点击
   handleRemind(e) {
     const familyItem = e.currentTarget.dataset.item;
      // 跳转到添加提醒页面，携带家人信息
    wx.navigateTo({
      url: `/pages/add-reminder/add-reminder?familyId=${familyItem.id}&familyName=${familyItem.name}`
    });
   },
 
  // ========== 家人操作功能 ==========
  // 1. 编辑家人资料
  handleEdit(e) {
    const familyItem = e.currentTarget.dataset.item;
    // 跳转到编辑页面，携带家人ID
    wx.navigateTo({
      url: `/pages/edit-family/edit-family?id=${familyItem.id}`
    });

    // 跳转前复位所有卡片偏移
    const slideOffset = this.data.slideOffset.map(() => 0);
    this.setData({ slideOffset });
  },

  // 2. 为家人添加提醒事项
  handleAddTip(e) {
    const familyItem = e.currentTarget.dataset.item;
    // 跳转到添加提醒页面，携带家人信息
    wx.navigateTo({
      url: `/pages/add-reminder/add-reminder?familyId=${familyItem.id}&familyName=${familyItem.name}`
    });

    // 跳转前复位所有卡片偏移
    const slideOffset = this.data.slideOffset.map(() => 0);
    this.setData({ slideOffset });
  },

  // 3. 删除家人（带二次确认）
  handleDelete(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    const familyItem = e.currentTarget.dataset.item;
    const familyList = [...this.data.familyList];

    // 二次确认弹窗
    wx.showModal({
      title: '确认删除',
      content: `是否确定删除「${familyItem.name}」的信息？删除后不可恢复`,
      cancelText: '取消',
      confirmText: '删除',
      confirmColor: '#e63946',
      success: (res) => {
        if (res.confirm) {
          // 1. 删除数组中的对应项
          familyList.splice(index, 1);
          // 2. 删除对应滑动偏移量
          const slideOffset = [...this.data.slideOffset];
          slideOffset.splice(index, 1);
          // 3. 更新页面数据和缓存
          this.setData({ familyList, slideOffset });
          wx.setStorageSync('familyList', familyList);
//删除对应的提醒列表
          const remindersList = wx.getStorageSync('reminders') || [];
          const afterDeleteReminders = remindersList.filter(reminder => {
            if (reminder.familyId - 0 !== familyItem.id) {
              return true;
            }
            return false;
          });
          wx.setStorageSync('reminders', afterDeleteReminders);
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

  // ========== 基础功能 ==========
  // 添加新家人
  handleAddFamily() {
    wx.navigateTo({ url: "/pages/add-family/add-family" });

    // 跳转前复位所有卡片偏移
    const slideOffset = this.data.slideOffset.map(() => 0);
    this.setData({ slideOffset });
  }
});