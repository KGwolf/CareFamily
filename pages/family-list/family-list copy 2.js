Page({
  data: {
    familyList: [],
    slideOffset: [], // 存储每个卡片的滑动偏移量（rpx单位，负数=左滑）
    actionBarWidth: 390 // 操作栏宽度（rpx），与wxss中action-bar宽度一致
  },

  onLoad() {
    // 从缓存获取家人列表
    const cacheFamilyList = wx.getStorageSync('familyList') || [];
    // 初始化滑动偏移量：每个卡片默认偏移0（不滑动）
    const slideOffset = cacheFamilyList.map(() => 0);
    this.setData({ 
      familyList: cacheFamilyList,
      slideOffset
    });
  },

  // ========== 滑动核心逻辑（优化顺滑度） ==========
  // 触摸起始信息
  touchInfo: {
    startX: 0, // 起始X坐标（rpx）
    startY: 0, // 起始Y坐标（rpx）
    currentIndex: -1, // 当前滑动的卡片索引
    isMoving: false // 是否正在滑动
  },

  // 触摸开始
  handleTouchStart(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    const { clientX, clientY } = e.touches[0];
    // 转换为rpx（适配不同设备）
    const systemInfo = wx.getSystemInfoSync();
    const px2rpx = 750 / systemInfo.windowWidth;
    const startX = clientX * px2rpx;
    const startY = clientY * px2rpx;
    
    // 1. 记录起始坐标和当前卡片索引
    this.touchInfo = {
      startX,
      startY,
      currentIndex: index,
      isMoving: false
    };

    // 2. 其他卡片复位（只允许同时滑动一个卡片）
    const slideOffset = [...this.data.slideOffset];
    slideOffset.forEach((_, i) => {
      if (i !== index) slideOffset[i] = 0;
    });
    this.setData({ slideOffset });
  },

  // 触摸移动（优化：增加阻尼效果，更顺滑）
  handleTouchMove(e) {
    const { currentIndex, startX, startY } = this.touchInfo;
    if (currentIndex === -1) return; // 未选中卡片，不处理

    const { clientX, clientY } = e.touches[0];
    const systemInfo = wx.getSystemInfoSync();
    const px2rpx = 750 / systemInfo.windowWidth;
    const moveX = clientX * px2rpx;
    const moveY = clientY * px2rpx;

    // 计算滑动距离
    const diffX = startX - moveX; // 左滑=正数，右滑=负数
    const diffY = Math.abs(startY - moveY); // 垂直滑动距离

    // 过滤垂直滑动（避免上下滚动时触发横向滑动，阈值提高到30rpx更精准）
    if (diffY > 30) {
      this.touchInfo.isMoving = false;
      return;
    }

    this.touchInfo.isMoving = true;
    // 计算偏移量：增加阻尼效果（滑动距离越大，偏移增速越慢，更顺滑）
    let offset = -diffX;
    // 边界限制：右滑不偏移（offset≥0），左滑不超过操作栏宽度（offset≤-actionBarWidth）
    if (offset > 0) {
      offset = 0;
    } else if (offset < -this.data.actionBarWidth) {
      // 超出部分增加阻尼，避免滑动过猛
      offset = -this.data.actionBarWidth - (diffX - this.data.actionBarWidth) * 0.2;
    }

    // 更新当前卡片的偏移量
    const slideOffset = [...this.data.slideOffset];
    slideOffset[currentIndex] = offset;
    this.setData({ slideOffset });
  },

  // 触摸结束（优化：回弹逻辑更顺滑）
  handleTouchEnd(e) {
    const { currentIndex, isMoving } = this.touchInfo;
    if (currentIndex === -1 || !isMoving) return;

    const slideOffset = [...this.data.slideOffset];
    const currentOffset = slideOffset[currentIndex];
    const actionBarWidth = this.data.actionBarWidth;

    // 平滑回弹/展开：使用setData延迟，模拟顺滑过渡
    wx.nextTick(() => {
      // 滑动距离超过操作栏宽度的1/3，自动展开；否则自动复位（阈值降低，更易展开）
      if (Math.abs(currentOffset) > actionBarWidth / 3) {
        slideOffset[currentIndex] = -actionBarWidth; // 完全展开操作栏
      } else {
        slideOffset[currentIndex] = 0; // 复位（隐藏操作栏）
      }
      this.setData({ slideOffset });
    });

    // 重置触摸信息
    this.touchInfo = { startX: 0, startY: 0, currentIndex: -1, isMoving: false };
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