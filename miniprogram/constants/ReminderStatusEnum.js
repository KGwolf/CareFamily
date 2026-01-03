// 在一个单独的文件中定义，例如 constants/ReminderStatusEnum.js
const ReminderStatus = Object.freeze({
  WaitDeal: 0,//等待处理
  Completed: 1,//处理完成
  CANCELLED: -1,
});

module.exports = {
  ReminderStatus,
};