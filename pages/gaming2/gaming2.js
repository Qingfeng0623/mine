// pages/gaming/gaming.js
const util = require('../../utils/util.js')
var app = getApp();
const backgroundAudioManager = wx.getBackgroundAudioManager();
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
    row_count:0,
    col_count:0,
    // background_color: 'rgb(121, 177, 236)',   //初始化为蓝色
    board_style:'',
    game_style:'',
    game_style2:'',

    zm_index: 40,      //正面z-index
    cq_index: 30,      //插旗z-index
    l_index: 10,       //雷z-index
    sz_index: 20,       //数字z-index
    
  },
  mineMap: {},
  mineMapMapping: {},
  rowCount: 0,
  colCount: 0,
  minesCount: 0,
  minesLeft: 0,
  timeGo: 0,
  timeInterval: null,
  flagOn: false,
  endOfTheGame: false,
  safeMinesGo: 0,

  
  /**
   * 生命周期函数--监听页面加载
   */
  temp_minesCount:0,    //保存雷数
  flags :0,      //插旗数量
  difficulty : '初级',    //当前选择的难度类型
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    console.log(options.scene)
    if (options.scene == 1044) {
      console.log(options.shareTicket)
    }
    this.rowCount = Number(options.rowCount);
    this.colCount = Number(options.colCount);
    this.minesCount = this.minesLeft = this.temp_minesCount = Number(options.minesCount);
    this.difficulty = options.difficulty;

    this.setData({
      time_consuming: 0,
      row_count:this.rowCount,
      col_count:this.colCount,
      mines_left:this.minesCount,
    });
    this.drawMineField();//加载画面时绘制游戏区
    this.createMinesMap();//随机生成雷，并计算周围雷数
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

    this.setData({
      mine_map: this.mineMap
    })
    backgroundAudioManager.src = '../../wav/firstPaint.wav';
    
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
    var tmpCount = this.minesCount;

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
        for (var r = row - 1; r < row + 2; r++) {
          for (var c = col - 1; c < col + 2; c++) {
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
    // this.setData({
    //   mine_map:tmpMineMap
    // })
  },


  timeGoClock: function () {//计时
    var self = this;
    this.timeInterval = setInterval(function () {
      self.timeGo++;
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
    console.log(e)
    if (JSON.stringify(this.mineMapMapping) == "{}") return;//游戏还未开始就点击方格
    if (this.endOfTheGame) return;
    var x = parseInt(e.currentTarget.dataset.x);//获取点击的横坐标（使用“将字符串转换为整型”）
    var y = parseInt(e.currentTarget.dataset.y);
    var value = parseInt(e.currentTarget.dataset.value);

    //flag this field as mine.
    if (this.flagOn) {//如果是插旗状态

      this.flag(x, y, value);
      return;
    }

    // if field has been opened, return.
    if (value >= 0) return;

    var valueMapping = this.mineMapMapping[x][y];//获取方格代表的值
    // console.log(valueMapping)
    if (valueMapping < 9 && valueMapping > 0) {
      this.mineMap[x][y] = valueMapping;
      this.setData({ 
        mine_map: this.mineMap,
         
      });
      this.safeMinesGo++;   //安全挖开的方格数
      this.isFinish();
    }

    // When digg the mine.
    if (valueMapping == 9) {
      this.failed(x,y);
    }

    // Open the fields with 0 mines arround.
    if (valueMapping == 0) {

      this.openZeroArround(x, y);
      this.setData({ 
        mine_map: this.mineMap 
      });
    }
  },

  isFinish:function(){
    // console.log(typeof (this.safeMinesGo), this.safeMinesGo)
    // console.log(typeof (this.flags), this.flags)
    // console.log(typeof (this.minesLeft), this.minesLeft)
    if (this.safeMinesGo + this.flags + this.minesLeft == (this.rowCount * this.colCount))
      this.success();
    return;
  },

  success: function () {
    console.log('success')
    this.setData({
      expression_src: '../../images/win.png',
    }),
    this.timeGoStop();
    this.endOfTheGame = true;
    switch (this.difficulty)
    {
      case '初级':{
        console.log('初级');
        try{
          var temp_play = app.globalData.low.play.length;
          var play = (temp_play === 0 ? 1 : (app.globalData.low.play + 1));
          app.globalData.low.play = play;
          wx.setStorageSync('low_play', play);

          var temp_win = app.globalData.low.win.length;
          var win = (temp_win === 0 ? 1 : (app.globalData.low.win + 1));
          app.globalData.low.win = win;
          wx.setStorageSync('low_win', win);
          var temp_rate = parseInt(win / play * 100);
          app.globalData.low.rate = temp_rate;
          wx.setStorageSync('low_rate', temp_rate);


          if (app.globalData.low.use_time.length == 0 || this.data.time_consuming < app.globalData.low.use_time)
            {
              wx.showModal({
                title: 'You Are Great!',
                content: 'You break the record,your score is ' + this.data.time_consuming,
                showCancel: false,
              })
              app.globalData.low.use_time = this.data.time_consuming;
              wx.setStorageSync('low_use_time', this.data.time_consuming);
              var temp_date = util.formatTime(new Date());
              app.globalData.low.date = temp_date;
              wx.setStorageSync('low_date', temp_date);
            }
          else { //继续加油
            wx.showModal({
              title: 'Keep Trying',
              content: 'You will break the record',
              showCancel: false,
            })
          }               
              var temp_curr = app.globalData.low.curr.length;
              var con_curr = (temp_curr === 0 ? 1 : (app.globalData.low.curr < 0 ? 1 : (app.globalData.low.curr + 1)));
              app.globalData.low.curr = con_curr;
              wx.setStorageSync('low_curr', con_curr);

              var con = (app.globalData.low.con_win.length === 0 ? 0 : app.globalData.low.con_win);//最多连胜，判断当前连局是否已大于最多连胜
              var con_win = (con_curr >  con ? con_curr : con); 
              app.globalData.low.con_win = con_win;
              wx.setStorageSync('low_con_win', con_win);
            
        }catch(e){
          console.log(e);
        }
        finally{
          break;
        }
      }
      case '中级':{
        console.log('中级');
        try {
          var temp_play = app.globalData.mid.play.length;
          var play = (temp_play === 0 ? 1 : (app.globalData.mid.play + 1));
          app.globalData.mid.play = play;
          wx.setStorageSync('mid_play', play);

          if (app.globalData.mid.use_time.length == 0 || this.data.time_consuming < app.globalData.mid.use_time) {
            wx.showModal({
              title: 'You Are Great!',
              content: 'You break the record,your score is ' + this.data.time_consuming,
              showCancel: false,
            })
            app.globalData.mid.use_time = this.data.time_consuming
            wx.setStorageSync('mid_use_time', this.data.time_consuming); 
            var temp_date = util.formatTime(new Date());
            app.globalData.mid.date = temp_date;
            wx.setStorageSync('mid_date', temp_date);
          }
          else { //继续加油
            wx.showModal({
              title: 'Keep Trying',
              content: 'You will break the record',
              showCancel: false,
            })
          }
            var temp_win = app.globalData.mid.win.length;
            var win = (temp_win === 0 ? 1 : (app.globalData.mid.win + 1));
            app.globalData.mid.win = win;
            wx.setStorageSync('mid_win', win);
            var temp_rate = parseInt(win / play * 100);
            app.globalData.mid.rate = temp_rate;
            wx.setStorageSync('mid_rate', temp_rate);

            var temp_curr = app.globalData.mid.curr.length;
            var con_curr = (temp_curr === 0 ? 1 : (app.globalData.mid.curr < 0 ? 1 : (app.globalData.mid.curr+1)));
            app.globalData.mid.curr = con_curr;
            wx.setStorageSync('mid_curr', con_curr);

            var con = (app.globalData.mid.con_win.length === 0 ? 0 : app.globalData.mid.con_win);//最多连胜，判断当前连局是否已大于最多连胜
            var con_win = (con_curr > con ? con_curr : con);
            app.globalData.mid.con_win = con_win;
            wx.setStorageSync('mid_con_win', con_win);
          
        } catch (e) {
          console.log(e);
        } finally {
          break;
        }
      }
      case '高级':{
        console.log('高级');
        try {
          var temp_play = app.globalData.high.play.length;
          var play = (temp_play === 0 ? 1 : (app.globalData.high.play + 1));
          app.globalData.high.play = play;
          wx.setStorageSync('high_play', play);

          if (app.globalData.high.use_time.length == 0 || this.data.time_consuming < app.globalData.high.use_time) {
            wx.showModal({
              title: 'You Are Great!',
              content: 'You break the record,your score is ' + this.data.time_consuming,
              showCancel: false,
            })
            app.globalData.high.use_time = this.data.time_consuming;
            wx.setStorageSync('high_use_time', this.data.time_consuming); 
            var temp_date = util.formatTime(new Date());
            app.globalData.high.date = temp_date;
            wx.setStorageSync('high_date', temp_date);
          }
          else{ //继续加油
            wx.showModal({
              title: 'Keep Trying',
              content: 'You will break the record',
              showCancel: false,
            })
          }
            var temp_win = app.globalData.high.win.length;
            var win = (temp_win === 0 ? 1 : (app.globalData.high.win + 1));
            app.globalData.high.win = win;
            wx.setStorageSync('high_win', win);
            var temp_rate = parseInt(win / play * 100);
            app.globalData.high.rate = temp_rate;
            wx.setStorageSync('high_rate', temp_rate);

            var temp_curr = app.globalData.high.curr.length;
            var con_curr = (temp_curr === 0 ? 1 : (app.globalData.high.curr < 0 ? 1 : (app.globalData.high.curr + 1)));
            app.globalData.high.curr = con_curr;
            wx.setStorageSync('high_curr', con_curr);

            var con = (app.globalData.high.con_win.length === 0 ? 0 : app.globalData.high.con_win);//最多连胜，判断当前连局是否已大于最多连胜
            var con_win = (con_curr > con ? con_curr : con);
            app.globalData.high.con_win = con_win;
            wx.setStorageSync('high_con_win', con_win);
          
        } catch (e) {
          console.log(e);
        } finally {
          break;
        }
      }
    }
    
  },

  failed: function (x,y) {
    this.setData({
      expression_src: '../../images/loss.png',
    }),
    this.showAll(x,y);
    this.timeGoStop();
    this.endOfTheGame = true;
    switch (this.difficulty)
    {
      case '初级':{
        console.log('初级');
        try {
            wx.showModal({
              title: 'Cheer Up!',
              content: 'I believe you are the best!',
              showCancel: false,
            })

            var temp_play = app.globalData.low.play.length;
            var play = (temp_play === 0 ? 1 : (app.globalData.low.play + 1));
            app.globalData.low.play = play;
            wx.setStorageSync('low_play', play);

            var temp_rate = parseInt(app.globalData.low.win / play * 100);
            app.globalData.low.rate = temp_rate;
            wx.setStorageSync('low_rate', 0);

            var temp_curr = app.globalData.low.curr.length;
            var con_curr = (temp_curr === 0 ? (-1) : (app.globalData.low.curr > 0 ? (-1) : (app.globalData.low.curr-1)));
            app.globalData.low.curr = con_curr;
            wx.setStorageSync('low_curr', con_curr);

            var con = (app.globalData.low.con_loss.length === 0 ? 0 : app.globalData.low.con_loss);//最多连败，判断当前连局是否已大于最多连败
            var con_loss = (con_curr < con ? con_curr : con);
            app.globalData.low.con_loss = con_loss;
            wx.setStorageSync('low_con_loss', con_loss);
          
        } catch (e) {
          console.log(e);
        }
        finally {
          break;
        }
      }
      case '中级':{
        console.log('中级');
        try {
          wx.showModal({
            title: 'Cheer Up!',
            content: 'I believe you are the best!',
            showCancel: false,
          })

          var temp_play = app.globalData.mid.play.length;
          var play = (temp_play === 0 ? 1 : (app.globalData.mid.play + 1));
          app.globalData.mid.play = play;
          wx.setStorageSync('mid_play', play);

          var temp_rate = parseInt(app.globalData.mid.win / play * 100);
          app.globalData.mid.rate = temp_rate;
          wx.setStorageSync('mid_rate', temp_rate);

          var temp_curr = app.globalData.mid.curr.length;
          var con_curr = (temp_curr === 0 ? (-1) : (app.globalData.mid.curr > 0 ? (-1) : (app.globalData.mid.curr - 1)));
          app.globalData.mid.curr = con_curr;
          wx.setStorageSync('mid_curr', con_curr);

          var con = (app.globalData.mid.con_loss.length === 0 ? 0 : app.globalData.mid.con_loss);//最多连败，判断当前连局是否已大于最多连败
          var con_loss = (con_curr < con ? con_curr : con);
          app.globalData.mid.con_loss = con_loss;
          wx.setStorageSync('mid_con_loss', con_loss);

        } catch (e) {
          console.log(e);
        }
        finally {
          break;
        }
      }
      case '高级':{
        console.log('高级');
        try {
          wx.showModal({
            title: 'Cheer Up!',
            content: 'I believe you are the best!',
            showCancel: false,
          })

          var temp_play = app.globalData.high.play.length;
          var play = (temp_play === 0 ? 1 : (app.globalData.high.play + 1));
          app.globalData.high.play = play;
          wx.setStorageSync('high_play', play);

          var temp_rate = parseInt(app.globalData.high.win / play * 100);
          app.globalData.high.rate = temp_rate;
          wx.setStorageSync('high_rate', temp_rate);

          var temp_curr = app.globalData.high.curr.length;
          var con_curr = (temp_curr === 0 ? (-1) : (app.globalData.high.curr > 0 ? (-1) : (app.globalData.high.curr - 1)));
          app.globalData.high.curr = con_curr;
          wx.setStorageSync('high_curr', con_curr);

          var con = (app.globalData.high.con_loss.length === 0 ? 0 : app.globalData.high.con_loss);//最多连败，判断当前连局是否已大于最多连败
          var con_loss = (con_curr < con ? con_curr : con);
          app.globalData.high.con_loss = con_loss;
          wx.setStorageSync('high_con_loss', con_loss);

        } catch (e) {
          console.log(e);
        }
        finally {
          break;
        }
      }
      
    }
  },

  // Open the fields arround 0 field recursively.
  openZeroArround: function (row, col) { //翻开0方格周围的方格
    if(this.mineMap[row][col] < 0){
      this.mineMap[row][col] = this.mineMapMapping[row][col]; //翻开当前点击的O方格
      this.safeMinesGo++;
    }
    
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
    // console.log("Safe mine go: " + this.safeMinesGo);
    // console.log("flags:" + this.flags);
    // console.log("MinesLeft:" + this.minesLeft);

    this.isFinish();

  },

  flagSwitch: function (e) { //切换扫雷模式：扫雷、插旗

    if (e.detail.value) {

      this.flagOn = true;
    } else {

      this.flagOn = false;
    }
  },

  flag: function (x, y, value) { //插旗
    if (value > 0 && value < 10) return; //还未翻开时，value都为-1

    // if flaged already, set the original state.
    if (value == 10) {  //如果标记的方格是棋子

      this.pullUpFlag(x, y);//拔旗
      return;
    }
    if (this.minesLeft <= 0) return;//已经插满足够的旗子
    this.minesLeft--;
    this.flags++;
    // this.safeMinesGo++;
    this.mineMap[x][y] = 10;

    this.setData({ 
      mine_map: this.mineMap, 
      mines_left: this.minesLeft 
    });
    // console.log("Safe mine go: " + this.safeMinesGo);
    // console.log("flags:" + this.flags);
    // console.log("MinesLeft:" + this.minesLeft);
    this.isFinish();
  },

  pullUpFlag: function (x, y) {//拔旗

    if (this.minesLeft < this.minesCount) {
      this.minesLeft++;
      this.flags--;
    }
    this.mineMap[x][y] = -1; //设置成未翻开
    this.setData({ 
      mine_map: this.mineMap, 
      mines_left: this.minesLeft 
    });
    // console.log("Safe mine go: " + this.safeMinesGo);
    // console.log("flags:" + this.flags);
    // console.log("MinesLeft:" + this.minesLeft);
  },

  rangeRandom: function (x, y) {//随机生成x<=   <=y的整数
    var z = y - x + 1;
    return Math.floor(Math.random() * z + x);
  },

  showAll: function (x,y) { //翻开所有方格
    this.mineMap = this.mineMapMapping;
    this.mineMap[x][y] = 11;
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
    // console.log('newGame');
    this.setData({
      game_show: 'none',
      game_color: 'black',
    });
    var that = this;
    wx.showActionSheet({
      itemList: ['退出并开始新游戏', '重新开始这个游戏'],
      success: function (res) {
        if (!that.endOfTheGame)
        {
          wx.showModal({
            title: '提示',
            content: '游戏正在进行,本局将作为失败记入统计信息中',
            success: function (r) {
              if (r.cancel)
                return;
              that.failed();
              that.minesCount = that.minesLeft = that.temp_minesCount;
              that.timeGo = that.safeMinesGo = that.flags = 0;
              that.setData({
                expression_src: '../../images/smile.png',
                time_consuming: 0,
                mines_left: that.minesCount,
              })
              that.drawMineField();//加载画面时绘制游戏区
              if (res.tapIndex == 0) //退出并开始新游戏,游戏的规模相同，但数据不同。没有销毁当前页面，只是重新绘制
              {
                that.createMinesMap();//随机生成雷，并计算周围雷数
              }
              that.timeGoReset();//停止并清除计时
              that.timeGoClock();//计时
              that.endOfTheGame = false;//游戏结束标志
            }
          })
        }
        else{
          that.minesCount = that.minesLeft = that.temp_minesCount;
          that.timeGo = that.safeMinesGo = that.flags = 0;
          that.setData({
            expression_src: '../../images/smile.png',
            time_consuming: 0,
            mines_left: that.minesCount,
          })
          that.drawMineField();//加载画面时绘制游戏区
          if (res.tapIndex == 0) //退出并开始新游戏,游戏的规模相同，但数据不同。没有销毁当前页面，只是重新绘制
          {
            that.createMinesMap();//随机生成雷，并计算周围雷数
          }
          that.timeGoReset();//停止并清除计时
          that.timeGoClock();//计时
          that.endOfTheGame = false;//游戏结束标志     
        }    
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },

  record: function (e) {      //统计信息
    // console.log('record');
    this.setData({
      game_show: 'none',
      game_color: 'black',
    });
    wx.navigateTo({
      url: '../record/record',
    })
  },

  option: function (e) {    //选项
    // console.log('option');
    this.setData({
      game_show: 'none',
      game_color: 'black',
    });
    wx.navigateTo({
      url: '../difficulty-choice/difficulty-choice',
    })
    
  },

  alterShow: function (e) {
    // console.log('alterShow');
    this.setData({
      game_show: 'none',
      game_color: 'black',
    });
    wx.navigateTo({
      url: '../show/show',
    })
  },

  viewHelp: function (e) {
    // console.log('viewHelp');
    this.setData({
      help_show: 'none',
      help_color: 'black',
    })
    wx.navigateTo({
      url: '../help/help',
    })
  },

  aboutMine: function (e) {
    // console.log('aboutMine');
    this.setData({
      help_show: 'none',
      help_color: 'black',
    })
    wx.showModal({
      title: '关于',
      content: 'The developer is ye qingfeng.',
      showCancel:false,
      success: function (res) {
        if (res.confirm) {
          // console.log('用户点击确定')
        } 
      }
    })
  },

  destroy:function(){     //玩家在游戏过程中开始一局不同规模的游戏时，销毁当前的游戏页面
    wx.navigateBack({
      delta:-1
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      bg_color: (app.globalData.board_style == '蓝色' ? 'rgb(121, 177, 236)' : 'rgb(91, 175, 98)'),
      game_style: (app.globalData.game_style == '扫雷' ? '../../images/mine_icon.png' : '../../images/flower.png'),
      game_style2: (app.globalData.game_style == '扫雷' ? '../../images/mine_icon_mark.png' : '../../images/flower_mark.png'),
    }),
    wx.showShareMenu({
      withShareTicket: true
    })
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
  onShareAppMessage: function (res) {
    
    if(res.from == 'menu')
    {
      console.log(res)
    }
    return{
      title:'PK',
      path: '/pages/gaming2/gaming2?rowCount=' + this.rowCount + '&colCount=' + this.colCount + '&minesCount=' + this.temp_minesCount + '&difficulty=' + this.difficulty + '&time_consuming=' + this.data.time_consuming,
      success:function(e){
        console.log('OK'),
          wx.showShareMenu({
            withShareTicket: true
          })
      },
      fail:function(e){
        console.log('fail')
      }
    }
  }
  
})