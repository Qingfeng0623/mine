// pages/difficulty-choice/difficulty-choice.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { name: 'low', value: '初级', mines:10,area:'9 x 9',checked: 'true'},
      { name: 'mid', value: '中级',mines:40 ,area:'16 x 16'},
      { name: 'high', value: '高级' ,mines:99,area:'16 x 30'},      
    ],
    input_color: '#D0D0D0',
    height_defined:9,
    width_defined:9,
    mines_defined:10,
    height_focus:false, //高度焦点
    width_focus:false,  //宽度焦点
    mines_focus:false   //雷数焦点
  },
  height:9, //最后页面传递的参数
  width:9,
  mines:10,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  confirm:function(e){    //按钮确认，先判断输入的值的合法性，再跳转到游戏页面
    console.log(this.height);
    console.log(this.width);
    console.log(this.mines);
    if(this.mines > (this.height * this.width)) //雷数超过方格数
    {
      this.setData({
        mines_defined:this.height * this.width - 15,
      });
      this.mines = this.height * this.width - 15;
      wx.showToast({
        title: '地雷的数目必须在10和'+ this.mines + '之间',
        icon:'none',
        duration:2000
      })
    }
  },

  back_page:function(e){  //按钮取消，回退到上一个页面
    wx.navigateBack({
      delta:1,
    })
  },

  radioChange: function (e) {
    // console.log('radio发生change事件，携带value值为：', e);
    
    if(e.detail.value == 'other')   //选中‘自定义’
    {
      // console.log('other');
      this.setData({
        input_color:'#000000'
      })
    }
    else{
      this.setData({
        input_color: '#D0D0D0', //自定义部分颜色设置成灰色
        height_defined: 9,
        width_defined: 9,
        mines_defined: 10,
      });
    }
    if(e.detail.value == 'mid')
    {
      this.height = 16;
      this.width = 16;
      this.mines = 40;
      
    }
    if(e.detail.value == 'high')
    {
      this.height = 30;
      this.width = 16;
      this.mines = 99;
    }
  },

  height_check:function(e){  //高度检查
    console.log('高度检查');
    if(e.detail.value < 9 || e.detail.value > 24)
    {
      // console.log('error');
      wx.showToast({                  //手机测试有点bug
        title: '输入的内容不在范围内',
        icon:'none',
        duration:1500
      });
      this.setData({
        height_focus:true,
        height_defined:9
      });
      return;
    }
    this.height = e.detail.value;
  },

  width_check: function(e){   //宽度检查
    console.log('宽度检查');
    if (e.detail.value < 9 || e.detail.value > 30) {
      // console.log('error');
      wx.showToast({
        title: '输入的内容不在范围内',
        icon: 'none',
        duration: 1500
      });
      this.setData({
        width_focus: true,
        width_defined:9
      });
      return;
    }
    this.width = e.detail.value;
  },

  mines_check: function(e){   //雷数检查
    console.log('雷数检查');
    if (e.detail.value < 10 || e.detail.value > 668) {
      // console.log('error');
      wx.showToast({
        title: '输入的内容不在范围内',
        icon: 'none',
        duration: 1500
      });
      this.setData({
        mines_focus: true,
        mines_defined:10
      });
      return;
    }
    this.mines = e.detail.value;
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