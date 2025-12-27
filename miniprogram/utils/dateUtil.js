// utils/dateUtil.js

// 改回这种裸模块导入的方式
const dayjs = require('dayjs'); 

function formatTime(date) {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
}

module.exports = {
  formatTime: formatTime
};