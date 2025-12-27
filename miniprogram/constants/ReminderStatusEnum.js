// 在一个单独的文件中定义，例如 constants/ReminderStatusEnum.js
const ReminderStatus = Object.freeze({
  WaitDeal: 0,
  Completed: 1,
  CANCELLED: -1,
});

module.exports = {
  ReminderStatus,
};