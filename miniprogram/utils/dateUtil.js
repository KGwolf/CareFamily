// utils/dateUtil.js

// 改回这种裸模块导入的方式
const dayjs = require('dayjs'); 

function formatTime(date) {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
}
/**
 * 使用 dayjs 获取当前日期的字符串，格式为 'YYYY-MM-DD'
 * @returns {string} 格式化后的日期字符串
 */
function getTodayDateString() {
  return dayjs().format('YYYY-MM-DD');
}

/**
 * (扩展) 使用 dayjs 获取昨天的日期字符串
 * @returns {string} 格式化后的日期字符串
 */
function getYesterdayDateString() {
  // .subtract(1, 'day') 表示减去1天
  return dayjs().subtract(1, 'day').format('YYYY-MM-DD');
}

/**
 * (扩展) 使用 dayjs 获取指定日期的前/后N天
 * @param {string} dateStr - 基准日期, 例如 '2024-05-20'
 * @param {number} days - 天数, 正数为未来, 负数为过去
 * @returns {string} 计算后的日期字符串
 */
function getDateStringByOffset(dateStr, days) {
  return dayjs(dateStr).add(days, 'day').format('YYYY-MM-DD');
}
/**
 * (扩展) 使用 dayjs 获取2个时间是否是同一天
 * @param {string} dateStr1 -  '2024-05-20'
 * @param {string} dateStr2 - '2024-05-20'
 * @returns {boolean} 是否是同一天
 */
function isSameDay(dateStr1,dateStr2){
  if (dateStr1 && dayjs(dateStr1).isSame(dateStr2, 'day')) {
    return true;
  }
  return false;
}

module.exports = {
  formatTime: formatTime,
  getTodayDateString: getTodayDateString,
  getYesterdayDateString: getYesterdayDateString,
  getDateStringByOffset: getDateStringByOffset,
  isSameDay:isSameDay,
};