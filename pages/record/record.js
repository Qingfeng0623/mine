// pages/record/record.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lowConsuming:9999,
    lowTime_1:'',
    lowTime_2:'',
    midConsuming:9999,
    midTime_1: '',
    midTime_2: '',
    highConsuming:9999,
    highTime_1: '',
    highTime_2: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  reset:function(e)
  {
    this.setData({
      lowConsuming: 9999,
      lowTime_1: '',
      lowTime_2: '',
      midConsuming: 9999,
      midTime_1: '',
      midTime_2: '',
      highConsuming: 9999,
      highTime_1: '',
      highTime_2: ''
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