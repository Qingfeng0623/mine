// pages/show/show.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    choose_mine:'#FFFFFF',        /*扫雷 按钮边框颜色 */
    choose_flower: '#FFFFFF',      /*花园 按钮边框颜色 */
    choose_blue: '#FFFFFF',         /*蓝色 按钮边框颜色 */
    choose_green: '#FFFFFF',         /*绿色 按钮边框颜色 */

    mine_bg_color:'#FFFFFF',       /*扫雷 按钮背景颜色*/
    mine_color:'#000000',            /*扫雷 按钮字体颜色*/
    flower_bg_color: '#FFFFFF',    /*花园 按钮背景颜色*/
    flower_color: '#000000',          /*花园 按钮字体颜色*/
    blue_bg_color: '#FFFFFF',      /*蓝色 按钮背景颜色*/
    blue_color: '#000000',            /*蓝色 按钮字体颜色*/
    green_bg_color: '#FFFFFF',     /*绿色 按钮背景颜色*/
    green_color: '#000000',           /*绿色 按钮字体颜色*/
  },

  style_choose:'扫雷',
  board_choose:'蓝色',

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      choose_mine: '#0066FF',
      mine_bg_color: '#0066FF',
      mine_color: '#FFFFFF',

      choose_blue: '#0066FF',
      blue_bg_color: '#0066FF',
      blue_color: '#FFFFFF',
    })
  },

  style_mine:function(e){       /*游戏样式选择扫雷 */
    this.setData({
      choose_mine:'#0066FF',
      mine_bg_color:'#0066FF',
      mine_color:'#FFFFFF',

      choose_flower: '#FFFFFF',
      flower_bg_color: '#FFFFFF',
      flower_color: '#000000',
    });
    this.style_choose = '扫雷';
  },

  style_flower: function (e) {     /*游戏样式选择花园 */
    this.setData({
      choose_flower: '#0066FF',
      flower_bg_color: '#0066FF',
      flower_color: '#FFFFFF',

      choose_mine: '#FFFFFF',
      mine_bg_color: '#FFFFFF',       
      mine_color: '#000000',
    })
    this.style_choose = '花园';
  },

  board_blue: function (e) {       /*棋盘样式选择蓝色 */
      this.setData({
        choose_blue: '#0066FF',
        blue_bg_color: '#0066FF',
        blue_color: '#FFFFFF',

        choose_green: '#FFFFFF',
        green_bg_color: '#FFFFFF',
        green_color: '#000000',
      })
      this.board_choose = '蓝色';
  },

  board_green: function (e) {      /*棋盘样式选择绿色 */
      this.setData({
        choose_green: '#0066FF',
        green_bg_color: '#0066FF',
        green_color: '#FFFFFF',

        choose_blue: '#FFFFFF',
        blue_bg_color: '#FFFFFF',
        blue_color: '#000000',
      })
      this.board_choose = '绿色';
  },

  confirm:function(e){
    console.log(this.style_choose);
    console.log(this.board_choose);
  },

  back_page:function(e){
    wx.navigateBack({
      delta:1,
    })
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