// pages/add-family/add-family.js
Page({
  data: {
    name: '',        // 家人姓名
    age: '',         // 家人年龄
    gender: ''       // 家人性别（male/ female）
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  // 返回上一页
  goBack() {
    wx.navigateBack({
      delta: 1
    });
  },

  // 监听姓名输入
  onNameInput(e) {
    this.setData({
      name: e.detail.value.trim()
    });
  },

  // 监听年龄输入
  onAgeInput(e) {
    this.setData({
      age: e.detail.value.trim()
    });
  },

  // 选择性别
  selectGender(e) {
    const genderType = e.currentTarget.dataset.type;
    this.setData({
      gender: genderType
    });
  },

  // 保存家人信息
  saveFamilyInfo() {
    const { name, age, gender } = this.data;

    // 表单校验
    if (!name) {
      wx.showToast({
        title: '请输入家人姓名',
        icon: 'none'
      });
      return;
    }

    if (!age) {
      wx.showToast({
        title: '请输入家人年龄',
        icon: 'none'
      });
      return;
    }

    // 校验年龄有效性
    const ageNum = Number(age);
    if (isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
      wx.showToast({
        title: '请输入0-120之间的有效年龄',
        icon: 'none'
      });
      return;
    }

    if (!gender) {
      wx.showToast({
        title: '请选择家人性别',
        icon: 'none'
      });
      return;
    }

    // 构造家人信息对象
    const familyInfo = {
      id: Date.now(), // 时间戳作为唯一标识
      name: name,
      age: ageNum,
      gender: gender === 'male' ? '男' : '女', // 转换为中文显示
      genderKey: gender // 保留标识用于后续判断
    };

    // 方案：存入本地缓存（持久化，返回列表页自动刷新）
    const familyList = wx.getStorageSync('familyList') || [];
    familyList.push(familyInfo);
    wx.setStorageSync('familyList', familyList);

    // 提示并返回
    wx.showToast({
      title: '添加成功',
      icon: 'success',
      duration: 1500
    });

    setTimeout(() => {
      this.goBack();
    }, 1500);
  }
});