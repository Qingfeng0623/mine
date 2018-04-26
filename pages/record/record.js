// pages/record/record.js
var app = getApp();
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
// //初级
//   low_best_time:0,   //用时
//   low_best_date: 0,   //日期
//   low_played: 0,      //已玩游戏
//   low_winned: 0,      //已胜游戏
//   low_winned_rate: 0, //获胜率
//   low_winned_continue: 0,   //最多连胜
//   low_loss_continue: 0,     //最多连败
//   low_current_continue: 0,  //当前连局
// //中级
//   mid_best_time: 0,   //用时
//   mid_best_date: 0,   //日期
//   mid_played: 0,      //已玩游戏
//   mid_winned: 0,      //已胜游戏
//   mid_winned_rate: 0, //获胜率
//   mid_winned_continue: 0,   //最多连胜
//   mid_loss_continue: 0,     //最多连败
//   mid_current_continue: 0,  //当前连局
// //高级
//   high_best_time: app.globalData.high.use_time,   //用时
//   high_best_date: app.globalData.high.date,   //日期
//   high_played: app.globalData.high.play,      //已玩游戏
//   high_winned: app.globalData.high.win,      //已胜游戏
//   high_winned_rate: app.globalData.high.rate, //获胜率
//   high_winned_continue: app.globalData.high.con_win,   //最多连胜
//   high_loss_continue: app.globalData.high.con_loss,     //最多连败
//   high_current_continue: app.globalData.high.curr,  //当前连局

  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      index: e.detail.value
    });
    console.log(this.data.index);
    console.log(typeof (e.detail.value))  //类型是string
    switch (e.detail.value)
    {
      case '0':
      {
        console.log('初级')
        this.setData({
          best_time: app.globalData.low.use_time,   //用时
          best_date: app.globalData.low.date,   //日期
          played: app.globalData.low.play,      //已玩游戏
          winned: app.globalData.low.win,      //已胜游戏
          winned_rate: app.globalData.low.rate, //获胜率
          winned_continue: app.globalData.low.con_win,   //最多连胜
          loss_continue: app.globalData.low.con_loss,     //最多连败
          current_continue: app.globalData.low.curr,  //当前连局
        })
        break;
      }
      case '1':
      {
          console.log('中级')
        this.setData({
          best_time: app.globalData.mid.use_time,   //用时
          best_date: app.globalData.mid.date,   //日期
          played: app.globalData.mid.play,      //已玩游戏
          winned: app.globalData.mid.win,      //已胜游戏
          winned_rate: app.globalData.mid.rate, //获胜率
          winned_continue: app.globalData.mid.con_win,   //最多连胜
          loss_continue: app.globalData.mid.con_loss,     //最多连败
          current_continue: app.globalData.mid.curr,  //当前连局
        })
        break;
      }
      case '2':
      {
          console.log('高级')
        this.setData({
          best_time: app.globalData.high.use_time,   //用时
          best_date: app.globalData.high.date,   //日期
          played: app.globalData.high.play,      //已玩游戏
          winned: app.globalData.high.win,      //已胜游戏
          winned_rate: app.globalData.high.rate, //获胜率
          winned_continue: app.globalData.high.con_win,   //最多连胜
          loss_continue: app.globalData.high.con_loss,     //最多连败
          current_continue: app.globalData.high.curr,  //当前连局
        })
        break;
      }
    }
  },


  reset: function (e) {
    wx.showModal({
      title: '提示',
      content: '确定重置纪录吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          for (var prop in app.globalData.low)
            app.globalData.low[prop] = [];
          for (var prop in app.globalData.mid)
            app.globalData.mid[prop] = [];
          for (var prop in app.globalData.high)
            app.globalData.high[prop] = [];
          wx.clearStorage();
          wx.redirectTo({
            url: 'record',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    // this.setData({
    //   best_time: 0,   
    //   best_date: 0,   
    //   played: 0,      
    //   winned: 0,      
    //   winned_rate: 0, 
    //   winned_continue: 0,   
    //   loss_continue: 0,     
    //   current_continue: 0,
    // })
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
    // this.setData({
    //   best_time: app.globalData.low.use_time,   //用时
    //   best_date: app.globalData.low.date,   //日期
    //   played: app.globalData.low.play,      //已玩游戏
    //   winned: app.globalData.low.win,      //已胜游戏
    //   winned_rate: app.globalData.low.rate, //获胜率
    //   winned_continue: app.globalData.low.con_win,   //最多连胜
    //   loss_continue: app.globalData.low.con_loss,     //最多连败
    //   current_continue: app.globalData.low.curr,  //当前连局
    // })
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
    //初级
    this.setData({
      best_time: app.globalData.low.use_time,   //用时
      best_date: app.globalData.low.date,   //日期
      played: app.globalData.low.play,      //已玩游戏
      winned: app.globalData.low.win,      //已胜游戏
      winned_rate: app.globalData.low.rate, //获胜率
      winned_continue: app.globalData.low.con_win,   //最多连胜
      loss_continue: app.globalData.low.con_loss,     //最多连败
      current_continue: app.globalData.low.curr,  //当前连局
    })
    
//   this.low_best_time = app.globalData.low.use_time,   //用时
//   this.low_best_date = app.globalData.low.date,   //日期
//   this.low_played = app.globalData.low.play,      //已玩游戏
//   this.low_winned = app.globalData.low.win,      //已胜游戏
//   this.low_winned_rate = app.globalData.low.rate, //获胜率
//   this.low_winned_continue = app.globalData.low.con_win,   //最多连胜
//   this.low_loss_continue = app.globalData.low.con_loss,     //最多连败
//   this.low_current_continue = app.globalData.low.curr,  //当前连局
// //中级
//   this.mid_best_time = app.globalData.mid.use_time,   //用时
//   this.mid_best_date = app.globalData.mid.date,   //日期
//   this.mid_played = app.globalData.mid.play,      //已玩游戏
//   this.mid_winned = app.globalData.mid.win,      //已胜游戏
//   this.mid_winned_rate = app.globalData.mid.rate, //获胜率
//   this.mid_winned_continue = app.globalData.mid.con_win,   //最多连胜
//   this.mid_loss_continue = app.globalData.mid.con_loss,     //最多连败
//   this.mid_current_continue = app.globalData.mid.curr,  //当前连局
// //高级
//   this.high_best_time = app.globalData.high.use_time,   //用时
//   this.high_best_date = app.globalData.high.date,   //日期
//   this.high_played = app.globalData.high.play,      //已玩游戏
//   this.high_winned = app.globalData.high.win,      //已胜游戏
//   this.high_winned_rate = app.globalData.high.rate, //获胜率
//   this.high_winned_continue = app.globalData.high.con_win,   //最多连胜
//   this.high_loss_continue = app.globalData.high.con_loss,     //最多连败
//   this.high_current_continue = app.globalData.high.curr;  //当前连局
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