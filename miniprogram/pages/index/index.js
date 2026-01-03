const dateUtil = require('../../utils/dateUtil.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 可后续添加动态数据
    familyReminderList: [],
    todayFamilyCount:0,//今天几位家人
    familyStatsList: [], // 存储每个家人的统计
    totalSummary: {      // 存储所有家人的汇总统计
      total: 0,
      completed: 0,
      uncompleted: 0,
      completionRate: '0%'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadTodayData(); 
  },
   // 页面每次显示时触发（包括从其他页面返回）
   onShow() {
    this.loadTodayData(); // 每次显示都重新加载数据
  },
  // 封装数据加载逻辑
  loadTodayData(){
    const familyList = wx.getStorageSync('familyList') || [];
    //还要筛选，日期是今天的这些提醒事项
  const remindersList = this.getTodayReminders() || [];

  //当天已经处理了的执行事项
  const todayDoneRemindersList = this.getTodayDoneReminders();

  const familyReminderList = [];
  const familyIdsWithReminders = new Set();
  remindersList.forEach(x => {
    familyIdsWithReminders.add(x.familyId);
  });

  familyIdsWithReminders.forEach(x => {
    const familyReminderModel = {};
    const familyModel = familyList.find(y => {
      return y.id === parseInt(x, 10);
    });
    familyReminderModel.name = familyModel.name;
    familyReminderModel.age = familyModel.age;
    familyReminderModel.gender = familyModel.gender;

    const reminderList = remindersList.filter(y => {
      return y.familyId == x;
    });

    //关联查询：处理过的记录，然后赋值checked属性，后面可能还需要一个字段来表示反复操作了多少次，暂时只允许操作一次。
    const tempList =  this.associateRemindersWithDoneStatus(reminderList,todayDoneRemindersList);
    
    familyReminderModel.reminderList = tempList;
    familyReminderList.push(familyReminderModel);
  });

  this.setData({
    familyReminderList: familyReminderList,
    todayFamilyCount: familyReminderList.length,
  });

    // 状态更新后，重新计算统计
    this.calculateAllStats();

  },
  /**
     * 一次性计算分组统计和汇总统计
     */
  calculateAllStats: function () {
    const { familyReminderList } = this.data;

    // 使用 reduce 遍历 familyReminderList
    const { familyStatsList, totalSummary } = familyReminderList.reduce((acc, familyGroup) => {
      // 1. 对当前家人的 reminderList 进行计数
      const familyStats = familyGroup.reminderList.reduce((innerAcc, reminder) => {
        innerAcc.total++;
        if (reminder.checked) {
          innerAcc.completedCount++;
        } else {
          innerAcc.uncompletedCount++;
        }
        return innerAcc;
      }, { total: 0, completedCount: 0, uncompletedCount: 0 });

      // 2. 将当前家人的统计结果添加到分组统计列表中
      acc.familyStatsList.push({
        name: familyGroup.name,
        ...familyStats
      });

      // 3. 将当前家人的计数值累加到总汇总中
      acc.totalSummary.total += familyStats.total;
      acc.totalSummary.completed += familyStats.completedCount;
      acc.totalSummary.uncompleted += familyStats.uncompletedCount;

      return acc; // 返回累加器，供下一次迭代使用

    }, { 
      // reduce 的初始值：一个包含两个空结构的对象
      familyStatsList: [], 
      totalSummary: { total: 0, completed: 0, uncompleted: 0 } 
    });

    // 4. 计算总完成率
    totalSummary.completionRate = totalSummary.total > 0
      ? (totalSummary.completed / totalSummary.total * 100).toFixed(0) + '%'
      : '0%';

    // 5. 使用一次 setData 更新所有统计数据
    this.setData({
      familyStatsList: familyStatsList,
      totalSummary: totalSummary
    });

    console.log('分组统计:', familyStatsList);
    console.log('汇总统计:', totalSummary);
  },
  /**
 * 关联待办列表和已完成列表，为待办列表添加 checked 属性
 * @param {Array} reminderList - 今日待办提醒列表
 * @param {Array} todayDoneRemindersList - 今日已完成的提醒记录列表
 * @returns {Array} - 更新了 checked 属性的新列表
 */
 associateRemindersWithDoneStatus(reminderList, todayDoneRemindersList) {
  // 步骤 1: 将已完成列表的 id 提取出来，存入一个 Set 中
  const doneIdsSet = new Set(todayDoneRemindersList.map(item => item.id));

  // 步骤 2: 遍历待办列表，为每个项添加 checked 属性
  return reminderList.map(reminder => {
    // 步骤 3: 使用 Set.has() 方法判断当前 reminder 的 id 是否在已完成的 Set 中
    const isChecked = doneIdsSet.has(reminder.id);

    // 返回一个包含原始所有属性，并新增 checked 属性的新对象
    return {
      ...reminder,
      checked: isChecked
    };
  });
},

  /**
   * 切换提醒项的完成状态
   * @param {Object} e - 事件对象
   */
  toggleReminder(e) {
    // 1. 从事件对象中获取被点击项的唯一ID
    const reminderId = e.currentTarget.dataset.reminderId;
    if (!reminderId) {
      console.error('错误：没有获取到 reminderId！');
      return;
    }

    // 2. 获取当前页面的数据
    const { familyReminderList } = this.data;

    // 3. 遍历数据，找到并更新状态
    // 使用 map 方法创建一个新的数组，这是推荐的不可变更新方式
    const newFamilyReminderList = familyReminderList.map(familyGroup => {
      const updatedReminderList = familyGroup.reminderList.map(reminder => {
        // 如果找到了被点击的提醒项
        if (reminder.id === reminderId) {
          // 切换它的 checked 状态
          const newCheckedState = !reminder.checked;
          
          // 如果是从未完成变为已完成，则记录日志
          if (newCheckedState === true) {
            this.saveDoneReminder(reminder);
            // 保存成功提示
            wx.showToast({
              title: '已执行此事项',
              icon: 'success',
              duration: 1500
            });
          }else{
            // 如果是从已完成 -> 未完成
            this.removeDoneReminder(reminder);
            //取消执行该事项
            wx.showToast({
              title: '已取消执行',
              icon: 'success',
              duration: 1500
            });
          }
          // 返回一个包含更新后状态的新对象
          return {
            ...reminder,
            checked: newCheckedState
          };
        }
        // 如果不是被点击的项，直接返回原对象
        return reminder;
      });

      // 返回更新了 reminderList 的新 familyGroup 对象
      return {
        ...familyGroup,
        reminderList: updatedReminderList
      };
    });
   
    // 4. 使用 setData 更新页面视图
    this.setData({
      familyReminderList: newFamilyReminderList
    });

     this.loadTodayData();
    console.log(`ID为 ${reminderId} 的提醒状态已切换`);
  },

  /**
   * 当一个提醒被标记为完成时调用 (此函数你已拥有)
   * @param {Object} reminder 被完成的提醒对象
   */
  saveDoneReminder(reminder) {
    const today = dateUtil.getTodayDateString();
    const storageKey = `doneReminders_${today}`;
  let todaysDoneList =  wx.getStorageSync(storageKey) || [];

    // 防止重复添加
    if (todaysDoneList.some(item => item.id === reminder.id)) {
      return;
    }

    const doneRecord = {
      ...reminder,
      completedAt: new Date().getTime()
    };
    todaysDoneList.push(doneRecord);
    wx.setStorageSync(storageKey, todaysDoneList);
    console.log(`已将提醒 "${reminder.content}" 保存至今日完成列表`);
  },

  /**
   * 当一个提醒被取消完成时调用 (新增的方法)
   * @param {Object} reminder 被取消的提醒对象
   */
  removeDoneReminder(reminder) {
    const today = dateUtil.getTodayDateString();
      const storageKey = `doneReminders_${today}`;
    let todaysDoneList =  wx.getStorageSync(storageKey) || [];

    // 核心：使用 filter 方法过滤掉要删除的项
    // 它会创建一个新数组，其中只包含 id 不等于被取消项 id 的元素
    const updatedDoneList = todaysDoneList.filter(item => item.id !== reminder.id);

    // 如果列表没有变化，就不执行后续操作，提升性能
    if (updatedDoneList.length === todaysDoneList.length) {
      console.log(`提醒 "${reminder.content}" 不在今日已完成列表中，无需删除。`);
      return;
    }

    // 将更新后的列表写回缓存
    wx.setStorageSync(storageKey, updatedDoneList);
    console.log(`已从今日完成列表中移除提醒 "${reminder.content}"`);
  },
  /**
   * 获取指定日期的完成记录列表
   * @param {String} dateStr 日期字符串，如 '2024-05-20'
   */
    getDoneRemindersByDate(dateStr) {
    const storageKey = `doneReminders_${dateStr}`;
    // 同样，只读取指定日期的记录，速度很快
    return wx.getStorageSync(storageKey) || [];
  },

    /**
   * 获取当天的完成记录列表
   */
      getTodayDoneReminders() {
      const today = dateUtil.getTodayDateString();
      const storageKey = `doneReminders_${today}`;
      return wx.getStorageSync(storageKey) || [];
    },

     /**
   * 获取当天的所有执行事项（未执行、已执行）
   */
       getTodayReminders() {
      //这个集合应该不多，可以不用分片  还要筛选，日期是今天的这些提醒事项
      const today = dateUtil.getTodayDateString();
      const remindersList = wx.getStorageSync('reminders') || [];

      const todayReminders = remindersList.filter(reminder => {
        if (reminder.frequency === "daily") {
          return true;
        }
      
        return dateUtil.isSameDay(reminder.customDate,today);
       
      });
      return todayReminders;
    }
})
