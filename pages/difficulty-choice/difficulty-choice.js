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
  tip:false,  //防止用户点击确认后不知道系统修改了数据，值为true时，表示当前修改了数据
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  confirm:function(e){    //按钮确认，先判断输入的值的合法性，再跳转到游戏页面
    // console.log(this.height);
    // console.log(this.width);
    // console.log(this.mines);
    var curBlock = this.height * this.width;  //当前方块数
    var curMineUpper = parseInt((curBlock - 81) / (720 - 81) * (668 - 67) + 67); //当前上限雷数
    if(this.tip)
    {
      this.tip = !this.tip;
      console.log(this.tip);
    }
    else if (curMineUpper < this.mines) //雷数超过上限
    {
      this.setData({
        mines_defined: curMineUpper,
      });
      this.mines = curMineUpper;
      wx.showModal({
        title: '数值超出范围',
        content: '地雷的数目必须在10和' + curMineUpper + '之间',
        showCancel:false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } 
        }
      })
      return;
    }
    else{
      wx.navigateTo({
        url: '../gaming/gaming?rowCount=' + this.height + '&colCount=' + this.width + '&minesCount=' + this.mines,
      })
    }
    
  },

  back_page:function(e){  //按钮取消，回退到上一个页面
    wx.navigateBack({
      delta:1,
    })
  },

  radioChange: function (e) {
    if(e.detail.value == 'other')   //选中‘自定义’
    {
      this.setData({
        input_color:'#000000',
      })
    }
    else{
      this.setData({
        input_color: '#D0D0D0', //自定义部分颜色设置成灰色
        // height_defined: 9,
        // width_defined: 9,
        // mines_defined: 10,
      });
    }
    switch (e.detail.value)
    {
      case 'low':{
        this.height = 9;
        this.width = 9;
        this.mines = 10;
        break;
      }
      case 'mid':{
        this.height = 16;
        this.width = 16;
        this.mines = 40;
        break;
      }
      case 'high':{
        this.height = 30;
        this.width = 16;
        this.mines = 99;
        break;
      }
    }
  },

  height_check:function(e){  //高度检查
    console.log('高度检查');
    this.height = e.detail.value;
    if(e.detail.value < 9)
    {
      // console.log('error');
      this.tip = true;
      wx.showModal({
        title: '数值超出范围',
        content: '地雷的数目必须在9和24之间',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
            this.tip = false;
          }
        }
      })
      
      this.setData({
        height_focus:true,
        height_defined:9
      });
      this.height = this.data.height_defined;
      return;
    }
    if (e.detail.value > 24)
    {
      this.tip = true;
      wx.showModal({
        title: '数值超出范围',
        content: '地雷的数目必须在9和24之间',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
            this.tip = false;
          }
        }
      })
      this.setData({
        height_focus: true,
        height_defined: 24
      });
      this.height = this.data.height_defined;
      return;
    }
    
  },

  width_check: function(e){   //宽度检查
    console.log('宽度检查');
    this.width = e.detail.value;
    if (e.detail.value < 9) {
      // console.log('error');
      this.tip = true;
      wx.showModal({
        title: '数值超出范围',
        content: '地雷的数目必须在9和30之间',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
            this.tip = false;
          }
        }
      })
      this.setData({
        width_focus: true,
        width_defined:9
      });
      this.width = this.data.width_defined;
      return;
    }
    if (e.detail.value > 30)
    {
      this.tip = true;
      wx.showModal({
        title: '数值超出范围',
        content: '地雷的数目必须在9和30之间',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
            this.tip = false;
          }
        }
      })
      this.setData({
        width_focus: true,
        width_defined: 30
      });
      this.width = this.data.width_defined;
      return;
    }
  },

  mines_check: function(e){   //雷数检查
    console.log('雷数检查');
    this.mines = e.detail.value;
    if (e.detail.value < 10) {
      this.tip = true;
      wx.showModal({
        title: '数值超出范围',
        content: '地雷的数目必须在10和668之间',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
            this.tip = false;
          }
        }
      })
      this.setData({
        mines_focus: true,
        mines_defined:10
      });
      this.mines = this.data.mines_defined;
      return;
    }
    if (e.detail.value > 668) {
      this.tip = true;
      wx.showModal({
        title: '数值超出范围',
        content: '地雷的数目必须在10和668之间',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
            this.tip = false;
          }
        }
      })
      this.setData({
        mines_focus: true,
        mines_defined: 668
      });
      this.mines = this.data.mines_defined;
      return;
    }
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