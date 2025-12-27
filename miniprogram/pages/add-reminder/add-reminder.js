const { ReminderStatus } = require('../../constants/ReminderStatusEnum.js');
const timeUtil = require('../../utils/dateUtil.js');
Page({
  data: {
    ReminderStatus:ReminderStatus,
    // 从家人列表传递的参数
    familyId: '',
    familyName: '',
    familyGender: '男', // 可根据实际需求传递或默认
    // 提醒相关数据
    selectedTime: '', // 选中的提醒时间
    selectedFrequency: 'daily', // 默认频率：每天
    customDate: '', // 自定义日期
    reminderContent: '', // 提醒内容
    // 频率选项
    frequencyOptions: [
      { label: '每天', value: 'daily' },
      { label: '每周', value: 'weekly' },
      { label: '指定日期', value: 'custom' }
    ]
  },

  /**
   * 页面加载：接收家人列表传递的参数
   */
  onLoad(options) {
    // 接收参数（若有中文需解码）
    const familyId = options.familyId;
    const familyName = decodeURIComponent(options.familyName);
    
    this.setData({
      familyId,
      familyName
      // 若家人性别也传递了，可在此接收：familyGender: options.familyGender
    });
  },

  /**
   * 选择提醒时间
   */
  onTimeChange(e) {
    this.setData({
      selectedTime: e.detail.value
    });
  },

  /**
   * 选择提醒频率
   */
  onFrequencySelect(e) {
    const value = e.currentTarget.dataset.value;
    this.setData({
      selectedFrequency: value,
      // 切换频率时重置自定义日期
      customDate: value !== 'custom' ? '' : this.data.customDate
    });
  },

  /**
   * 选择自定义日期
   */
  onCustomDateChange(e) {
    this.setData({
      customDate: e.detail.value
    });
  },

  /**
   * 输入提醒内容
   */
  onContentInput(e) {
    this.setData({
      reminderContent: e.detail.value
    });
  },

  /**
   * 保存提醒
   */
  handleSaveReminder() {
    const { familyId, familyName, selectedTime, selectedFrequency, customDate, reminderContent } = this.data;
    
    // 组装提醒数据（实际项目中需调用接口保存）
    const reminderData = {
      familyId,
      familyName,
      remindTime: selectedTime,
      frequency: selectedFrequency,
      customDate: selectedFrequency === 'custom' ? customDate : '',
      content: reminderContent,
      status: ReminderStatus.WaitDeal,
      createDate: timeUtil.formatTime()
    };

    console.log('保存的提醒数据：', reminderData);
    
    // 保存成功提示
    wx.showToast({
      title: '提醒添加成功',
      icon: 'success',
      duration: 1500
    });

    // 返回上一页并通知刷新
    const pages = getCurrentPages();
    if (pages.length >= 2) {
      const prevPage = pages[pages.length - 2];
      // 调用上一页的刷新方法（需上一页提前封装）
      if (prevPage.loadReminderList) {
        prevPage.loadReminderList();
      }
    }

    // 延迟返回，提升体验
    setTimeout(() => {
      wx.navigateBack({
        delta: 1
      });
    }, 1500);
  },

  /**
   * 返回上一页
   */
  handleBack() {
    wx.navigateBack({
      delta: 1
    });
  }
})