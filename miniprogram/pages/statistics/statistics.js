Page({
  data: {
    currentId: 1,
    familyList: [
      {
        id: 1,
        name: '爸爸',
        age: 75,
        avatar: '/assets/avatar_male.png',
        status: 'good',
        todayDone: 2,
        todayTotal: 3,
        medRate: 91,
        bpRate: 85,
        careDays: 18
      },
      {
        id: 2,
        name: '妈妈',
        age: 72,
        avatar: '/assets/avatar_female.png'
      },
      {
        id: 3,
        name: '岳父',
        age: 70,
        avatar: '/assets/avatar_male.png'
      }
    ]
  },

  onSelectFamily(e) {
    const id = e.currentTarget.dataset.id
    this.setData({ currentId: id })
  },

  get currentFamily() {
    return this.data.familyList.find(i => i.id === this.data.currentId)
  },

  goDetail() {
    wx.navigateTo({
      url: '/pages/statistics/index'
    })
  }
})
