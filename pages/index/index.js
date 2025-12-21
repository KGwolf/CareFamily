Page({
  data: {
    familyMembers: [
      {
        id: 1,
        name: '妈妈',
        age: 72,
        avatar: '/images/mom-avatar.png',
        reminders: [
          { id: 1, time: '08:00', desc: '吃降压药', completed: false },
          { id: 2, time: '21:00', desc: '测血压', completed: false }
        ]
      },
      {
        id: 2,
        name: '爸爸',
        age: 74,
        avatar: '/images/dad-avatar.png',
        reminders: [
          { id: 3, time: '14:00', desc: '复查提醒', completed: true }
        ]
      }
    ]
  },

  toggleCompleted(e) {
    const { index, member } = e.currentTarget.dataset;
    const newFamily = this.data.familyMembers;
    newFamily[member].reminders[index].completed = !newFamily[member].reminders[index].completed;
    this.setData({ familyMembers: newFamily });
  }
});