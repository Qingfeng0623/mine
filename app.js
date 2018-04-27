//app.js
App({
  onLaunch: function () {
    try{
      this.globalData.low.use_time = wx.getStorageSync('low_use_time') ;
      // console.log(this.globalData.low.use_time);
      // console.log(typeof(this.globalData.low.use_time));
      this.globalData.low.date = wx.getStorageSync('low_date') ;
      this.globalData.low.play = wx.getStorageSync('low_play') ;
      this.globalData.low.win = wx.getStorageSync('low_win');
      this.globalData.low.rate = wx.getStorageSync('low_rate');
      this.globalData.low.con_win = wx.getStorageSync('low_con_win') ;
      this.globalData.low.con_loss = wx.getStorageSync('low_con_loss') ;
      this.globalData.low.curr = wx.getStorageSync('low_curr');
      console.log('low' ,this.globalData.low);
    }catch(e){
      console.log(e)
    }
    
    try {
      this.globalData.mid.use_time = wx.getStorageSync('mid_use_time');
      this.globalData.mid.date = wx.getStorageSync('mid_date') ;
      this.globalData.mid.play = wx.getStorageSync('mid_play');
      this.globalData.mid.win = wx.getStorageSync('mid_win');
      this.globalData.mid.rate = wx.getStorageSync('mid_rate') ;
      this.globalData.mid.con_win = wx.getStorageSync('mid_con_win');
      this.globalData.mid.con_loss = wx.getStorageSync('mid_con_loss') ;
      this.globalData.mid.curr = wx.getStorageSync('mid_curr');
      console.log('mid',this.globalData.mid)
    } catch (e) {
      console.log(e)
    }

    try {
      this.globalData.high.use_time = wx.getStorageSync('high_use_time');
      this.globalData.high.date = wx.getStorageSync('high_date');
      this.globalData.high.play = wx.getStorageSync('high_play') ;
      this.globalData.high.win = wx.getStorageSync('high_win') ;
      this.globalData.high.rate = wx.getStorageSync('high_rate') ;
      this.globalData.high.con_win = wx.getStorageSync('high_con_win') ;
      this.globalData.high.con_loss = wx.getStorageSync('high_con_loss') ;
      this.globalData.high.curr = wx.getStorageSync('high_curr') ;
      console.log('high',this.globalData.high)
    } catch (e) {
      console.log(e)
    }

    try{
      this.globalData.game_style = wx.getStorageSync('game_style') || '扫雷';
      this.globalData.board_style = wx.getStorageSync('board_style') || '蓝色';
    }catch(e){
      console.log(e)
    }
    
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    game_style:'扫雷',
    board_style:'蓝色',
    low: new Object(),
    mid: new Object(),
    high: new Object(),
    // low : {},
    // mid : {},
    // high : {},
  }
})