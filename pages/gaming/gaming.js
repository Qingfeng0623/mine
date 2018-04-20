// pages/gaming/gaming.js
// 菜单高亮

Page({

  /**
   * 页面的初始数据
   */
  data: {
    game_show:'none',     //游戏子菜单
    game_color:'black',
    help_show:'none',     //帮助子菜单
    help_color:'black',
    expression_src:'../../images/smile.png',    //表情
    mines_left:0,          //剩余雷数
    time_consuming:0,     //耗时

    mine_map:{},
    row_count:9,
    col_count:9,
  },

  mineMap: {},
  mineMapMapping: {},
  rowCount: 9,
  colCount: 9,
  minesCount: 10,
  minMinesCount: 10,
  maxMinesCount: 20,
  minesLeft: 0,
  timeGo: 0,
  timeInterval: null,
  flagOn: false,
  endOfTheGame: false,
  safeMinesGo: 0,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      mines_left: 0,
      time_consuming: 0
    });
    this.drawMineField();//加载画面时绘制游戏区
    this.createMinesMap();//随机生成雷，并计算周围雷数
    this.setMinesLeft();//设置剩余雷数
    this.timeGoReset();//停止并清除计时
    this.timeGoClock();//计时
    this.endOfTheGame = false;//游戏结束标志
    this.safeMinesGo = 0;
    
  },

  drawMineField: function () {//开始（或重新开始）时绘制游戏区

    var tmpMineMap = {};
    for (var row = 0; row < this.rowCount; row++) {

      tmpMineMap[row] = [];
      for (var col = 0; col < this.colCount; col++) {

        tmpMineMap[row][col] = -1;
      }
    }
    this.mineMap = tmpMineMap;
    console.log(this.mineMap);

    this.setData({
      mine_map: this.mineMap
    })

  },

  createMinesMap: function () {//随机生成雷，并计算周围雷数

    var tmpMineMap = {};
    // initalize mine map with 0.
    for (var row = 0; row < this.rowCount; row++) {

      tmpMineMap[row] = [];
      for (var col = 0; col < this.colCount; col++) {

        tmpMineMap[row][col] = 0;
      }
    }
    //console.log(tmpMineMap);

    // laying mines with 9
    this.minesCount = this.rangeRandom(this.minMinesCount, this.maxMinesCount);//从最小雷数到最大雷数随机生成雷数

    var tmpCount = this.minesCount;
    //console.log("Mine count: ", tmpCount);
    while (tmpCount > 0) {  //随机生成位置作为雷

      var row = this.rangeRandom(0, this.rowCount - 1);
      var col = this.rangeRandom(0, this.colCount - 1);

      if (tmpMineMap[row][col] != 9) {

        tmpMineMap[row][col] = 9;
        tmpCount--;
      }
    }

    // calculate numbers around mines.
    for (var row = 0; row < this.rowCount; row++) { //计算周围的雷数
      for (var col = 0; col < this.colCount; col++) {
        var startRow = row - 1;
        var startCol = col - 1;
        //console.log("check====== r" +startRow +"c"+startCol );
        for (var r = row - 1; r < row + 2; r++) {
          for (var c = col - 1; c < col + 2; c++) {
            //console.log("go: r"+r+":c"+c);
            if (c >= 0 && c < this.colCount
              && r >= 0 && r < this.rowCount
              && !(r === row && c === col)
              && tmpMineMap[r][c] == 9
              && tmpMineMap[row][col] != 9) {
              tmpMineMap[row][col]++;
            }
          }
        }
      }
    }
    this.mineMapMapping = tmpMineMap;
  },

  setMinesLeft: function () {//设置剩余雷数
    this.minesLeft = this.minesCount;
    this.setData({ 
      mines_left: this.minesLeft 
    });
  },

  timeGoClock: function () {//计时
    var self = this;
    this.timeInterval = setInterval(function () {
      // console.log(self.data.timesGo);
      self.timeGo = self.timeGo + 1;
      self.setData({ 
        time_consuming: self.timeGo ,
      });

    }, 1000);
  },

  timeGoStop: function () {//停止计时

    clearInterval(this.timeInterval);
  },

  timeGoReset: function () {//停止并清除计时
    clearInterval(this.timeInterval);
    this.timeGo = 0;
    this.setData({ 
      time_consuming: this.timeGo 
    });
  },



  demining: function (e) { //点击方格

    if (JSON.stringify(this.mineMapMapping) == "{}") return;//游戏还未开始就点击方格

    var x = parseInt(e.target.dataset.x);//获取点击的横坐标（使用“将字符串转换为整型”）
    var y = parseInt(e.target.dataset.y);
    var value = parseInt(e.target.dataset.value);
    console.log(e);
    //console.log("value:" + value +" x:"+x +" y:"+y);

    //flag this field as mine.
    if (this.flagOn) {//如果是插旗状态

      this.flag(x, y, value);
      return;
    }

    // if field has been opened, return.
    if (value > 0) return;

    var valueMapping = this.mineMapMapping[x][y];//获取方格代表的值
    //console.log(this.mineMapMapping);
    //console.log(valueMapping);

    if (valueMapping < 9) {
      this.mineMap[x][y] = valueMapping;
      this.setData({ 
        mine_map: this.mineMap 
      });
      this.safeMinesGo++;   //安全挖开的方格数
      console.log("Safe mine go: " + this.safeMinesGo);
      if ((this.safeMinesGo + this.minesCount) == (this.rowCount * this.colCount)) {
        this.success();
      }
    }

    // When digg the mine.
    if (valueMapping == 9) {
      this.failed();
    }

    // Open the fields with 0 mines arround.
    if (valueMapping == 0) {

      this.openZeroArround(x, y);
      this.setData({ 
        mine_map: this.mineMap 
      });
    }
  },

  success: function () {

    // wx.showToast({
    //   title: 'Good Job !',
    //   image: '../images/icon/emoticon_happy.png',
    //   duration: 3000
    // }),
    this.setData({
      expression_src: '../../images/win.png',
    }),
    this.timeGoStop();
    this.endOfTheGame = true;
  },

  failed: function () {
    // wx.showToast({
    //   title: 'Bomb !!!',
    //   image: '../images/icon/emoticon_sad.png',
    //   mask: true,
    //   duration: 3000
    // })
    this.setData({
      expression_src: '../../images/loss.png',
    }),
    this.showAll();
    this.timeGoStop();
    this.endOfTheGame = true;
  },

  // Open the fields arround 0 field recursively.
  openZeroArround: function (row, col) { //翻开0方格周围的方格
    //console.log("click" + row + " " + col)
    for (var r = (row - 1); r < (row + 2); r++) {
      for (var c = (col - 1); c < (col + 2); c++) {
        //console.log("go: r"+r+":c"+c);
        if (r >= 0 && r < this.rowCount
          && c >= 0 && c < this.colCount
          && !(r === row && c === col)
          && this.mineMap[r][c] < 0) {

          this.mineMap[r][c] = this.mineMapMapping[r][c];
          this.safeMinesGo++;

          if (this.mineMapMapping[r][c] == 0) {
            this.openZeroArround(r, c);
          }

        }
      }
    }
    console.log("Safe mine go: " + this.safeMinesGo);
    if ((this.safeMinesGo + this.minesCount) == (this.rowCount * this.colCount)) {
      this.success();
    }

  },

  flagSwitch: function (e) { //切换扫雷模式：扫雷、插旗

    if (e.detail.value) {

      this.flagOn = true;
    } else {

      this.flagOn = false;
    }
  },

  flag: function (x, y, value) { //插旗
    console.log(value);
    if (value > 0 && value < 10) return; //还未翻开时，value都为-1


    // if flaged already, set the original state.
    if (value == 10) {  //如果标记的方格是棋子

      this.pullUpFlag(x, y);//拔旗
      return;
    }

    if (this.minesLeft <= 0) return;//已经插满足够的旗子

    this.minesLeft = this.minesLeft - 1;
    this.mineMap[x][y] = 10;

    this.setData({ 
      mine_map: this.mineMap, 
      mines_left: this.minesLeft 
    });
  },

  pullUpFlag: function (x, y) {//拔旗

    if (this.minesLeft < this.minesCount) {
      this.minesLeft = this.minesLeft + 1;
    }
    this.mineMap[x][y] = -1; //设置成未翻开
    this.setData({ 
      mine_map: this.mineMap, 
      mines_left: this.minesLeft 
    });
  },

  rangeRandom: function (x, y) {//随机生成x<=   <=y的整数
    var z = y - x + 1;
    return Math.floor(Math.random() * z + x);
  },

  showAll: function () { //翻开所有方格
    this.mineMap = this.mineMapMapping;
    this.setData({ 
      mine_map: this.mineMap 
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  show_game:function(e){
    var that = this;
    that.setData({
      game_show: (that.data.game_show == 'true' ? 'none' : 'true'),
      game_color:(that.data.game_color == 'black' ? 'green' : 'black'),
    })
    if(that.data.help_show)
    {
      that.setData({
        help_show:'none',
        help_color:'black',
      })
    }
  },

  show_help:function(e){
    var that = this;
    that.setData({
      help_show: (that.data.help_show == 'true' ? 'none' : 'true'),
      help_color: (that.data.help_color == 'black' ? 'green' : 'black'),
    })
    if (that.data.game_show)
    {
      that.setData({
        game_show:'none',
        game_color:'black',
      })
    }
  },

  hide_menu:function(e){
    if (this.data.game_show == 'true')
    {
      this.setData({
        game_show: 'none',
      })
    }
    if (this.data.help_show == 'true')
    {
      this.setData({
        help_show:'none',
      })
    }
  },

  newGame:function(e){
    console.log('newGame');
    
  },

  record: function (e) {
    console.log('record');

  },

  option: function (e) {
    console.log('option');

  },

  alterShow: function (e) {
    console.log('alterShow');

  },

  viewHelp: function (e) {
    console.log('viewHelp');

  },

  aboutMine: function (e) {
    console.log('aboutMine');

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