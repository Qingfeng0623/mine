// pages/record/record.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // lowConsuming:9999,
    // lowTime_1:'',
    // lowTime_2:'',
    // midConsuming:9999,
    // midTime_1: '',
    // midTime_2: '',
    // highConsuming:9999,
    // highTime_1: '',
    // highTime_2: ''

    grade:['初级','中级','高级'],
    index:0,
    best_time:'',   //用时
    best_date:'',   //日期
    played:0,      //已玩游戏
    winned:0,      //已胜游戏
    winned_rate:0, //获胜率
    winned_continue:0,   //最多连胜
    loss_continue:0,     //最多连败
    current_continue:0,  //当前连局

  },
//初级
  low_best_time: '',   //用时
  low_best_date: '',   //日期
  low_played: 0,      //已玩游戏
  low_winned: 0,      //已胜游戏
  low_winned_rate: 0, //获胜率
  low_winned_continue: 0,   //最多连胜
  low_loss_continue: 0,     //最多连败
  low_current_continue: 0,  //当前连局
//中级
  mid_best_time: '',   //用时
  mid_best_date: '',   //日期
  mid_played: 0,      //已玩游戏
  mid_winned: 0,      //已胜游戏
  mid_winned_rate: 0, //获胜率
  mid_winned_continue: 0,   //最多连胜
  mid_loss_continue: 0,     //最多连败
  mid_current_continue: 0,  //当前连局
//高级
  high_best_time: '',   //用时
  high_best_date: '',   //日期
  high_played: 0,      //已玩游戏
  high_winned: 0,      //已胜游戏
  high_winned_rate: 0, //获胜率
  high_winned_continue: 0,   //最多连胜
  high_loss_continue: 0,     //最多连败
  high_current_continue: 0,  //当前连局

  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
    switch(this.data.index)
    {
      case 0:
      {

        break;
      }
      case 1:
      {

        break;
      }
      case 2:
      {
        
        break;
      }
    }
  },


  reset: function (e) {
    this.setData({
      best_time: '',   
      best_date: '',   
      played: 0,      
      winned: 0,      
      winned_rate: 0, 
      winned_continue: 0,   
      loss_continue: 0,     
      current_continue: 0,
    })
  },

  close: function (e) {
    wx.navigateBack({
      delta:1,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})