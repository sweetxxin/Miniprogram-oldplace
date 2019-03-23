//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    left:"100%",
    goodsOn:"on",
    totalPrice:0,
    orders:{},
    trolley_bgc:"#363636",
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    assessDisplay:"none",
    totalFoods:0,
    show:"none",
    orderInfoShow: "-35%",
    orderInfoDis:"none",
    index:0,
    labels:[],
    foods:[],
    seller:{},
    assessment:{},
    satisfied:0,
    disatisfied:0,
    activity:{},
    scrollTop: 0,
    acttivityCode:{
      "满减":"fullSub",
      "折扣":"discount",
      "首单":"firstOrder",
      "公告":"pub_inform"
      },
      showFood:{},
      distance:0
  },
  //事件处理函数
  showFood:function(event)
  {
    let name = event.currentTarget.dataset.foodname;
    let key = "showFood."+name+".zIndex";
      this.setData({
        [key]: "block",
        coverDisplay: "block"
      })
  },
  hideFood:function()
  {
    this.setData({
      coverDisplay: "none",
      showFood:{}
    })
  },
  goodsTap:function(event){
       this.setData({
          left:"100%",
          goodsOn:"on",
          assessOn:"off",
          sellerOn: 'off',
          display: "none",
          state:"none",
       })
  },
  assessTap:function(){
    this.setData({
      left: "0%",
      goodsOn:"off",
      assessOn:"on",
      sellerOn: 'off',
      display: "none",
      assessDisplay: "block",
    });
    var that = this;
    wx.request({
      url: 'http://www.jessicxin.top/oldplace/oldplace.php',
      method: "get",
      data: {
        keyword: "assessment"
      },
      success: function (res) {
        that.setData({
          assessment: res.data,
        });
        that.setData({
          satisfied: Object.keys(that.data.assessment["satisfied"]).length,
          disatisfied: Object.keys(that.data.assessment["disatisfied"]).length,
        });
      }
    })
  },
  sellerTap: function () {
    this.setData({
      left: "0%",
      goodsOn: "off",
      assessOn: "off",
      sellerOn:'on',
      display:"block",
    })
  },
  toView:function(e){
    var viewID = e.target.dataset.id;
    this.setData({
      toView: viewID
    });
  },
  toComment:function(e){
    var commentID = e.target.dataset.id;
    this.setData({
      toComment: commentID
    });
  },
  scroll:function(e)
  {
    var top = e.detail.scrollTop;
    if (120-top>0){
      this.setData({
        commentTop: 125-top+"px"
      })
    }else{
      this.setData({
        commentTop: 0 + "px"
      })
    }
  },
  addOrder: function (event){
    var foodname = event.target.dataset.foodname;
    var price = event.target.dataset.price;
    let orders = this.data.orders;
    let key = "orders." + foodname;
    let img = event.target.dataset.img;
    this.setData({
      totalFoods: this.data.totalFoods+1,
      show: "block"
    });
    if(!(foodname in orders)){
      orders[foodname] = { "name": foodname,"count": 1, "price": price, "state":"block","img":img};
      this.setData({
        [key]: { "name": foodname, "count": 1, "price": price, "state": "block", "img": img},
      });
    }else{
      this.setData({
        [key]: { "name": foodname, "count": orders[foodname].count + 1, "price": price, "state": "block", "img": img},
      });
    }
    this.setData({
      totalPrice: this.data.totalPrice + parseFloat(orders[foodname].price)
    });
    if (this.data.totalPrice > 0) {
      this.setData({
        trolley_bgc: "#1E90FF",
        icon_bgc:"white",
      })
    }else{
      this.setData({
        trolley_bgc: "#363636",
        show:"none"
      })
    }
  },
  delOrder:function(event){
    var foodname = event.target.dataset.foodname;
    let orders = this.data.orders;
    let key = "orders." + foodname + ".count";
    
    this.setData({
      [key]: orders[foodname].count - 1,
      totalFoods: this.data.totalFoods - 1
    });
    this.setData({
      totalPrice: this.data.totalPrice - parseFloat(orders[foodname].price)
    });
    let count = orders[foodname]["count"];
    if(count<1){
      delete (this.data.orders[foodname]);
      this.setData({
        show:"none",
        orders:this.data.orders
      });
      if(this.data.totalFoods<1){
        this.setData({
          orderInfoShow: "-35%",
          index: 0,
        })
        setTimeout(this.hidden, 1000);
      }
    }
    if(this.data.totalPrice>0)
    {
      this.setData({
        trolley_bgc:"#1E90FF",
        show:"block",
      })
    } else {
      this.setData({
        trolley_bgc: "#363636",
        show:"none",
        icon_bgc: "#282828"
      })
    }
  },
  trolleyTap:function(){
    if (this.data.trolley_bgc =="#1E90FF"&&this.data.index==0){ 
      this.setData({
        orderInfoDis: "block",
      });
      this.setData({
        orderInfoShow: "9%",
        index: 1,
      })
    }else{
        this.setData({
          orderInfoShow: "-35%",
          index: 0,
      });
      setTimeout(this.hidden,1000);
    }
  },
  hidden:function(){
    this.setData({
      orderInfoDis: "none",
    })
  },
  clear:function(){
    this.setData({
      orders:{},
      totalPrice:0,
      totalFoods:0,
      show: "none",
      trolley_bgc: "#363636",
      icon_bgc: "#282828",
      orderInfoShow: "-35%",
      index: 0
    });
    setTimeout(this.hidden, 1000);
  },
  pay:function(){
    wx.setStorageSync('orders', this.data.orders);
    wx.setStorageSync('totalPrice', this.data.totalPrice);
    wx.setStorageSync('user', this.data.userInfo.nickName);
    wx.navigateTo({
      url: "/pages/page/order/order"
    });
  },
  onLoad: function () {
    wx.removeStorageSync('orders');
    wx.removeStorageSync('totalPrice');
    wx.removeStorageSync('attachment');
    var that = this;
wx.getLocation({
  success: function(res) {   
    new app.globalData.QQMapWX({
      key: 'TGSBZ-EOSRJ-A6LFF-K3DVE-YAAEQ-YCFJD'
    }).calculateDistance({
      to: [{
        latitude: res.latitude,
        longitude: res.longitude
      }, {
          latitude: 23.0501300000,
          longitude: 113.3898600000
      }],
      success: function (res) {
       that.setData({
         distance:res.result.elements[1].distance
       });
       console.log(that.data.distance)
      },
  })
  }
})
  wx.request({
    url: 'http://www.jessicxin.top/oldplace/oldplace.php',
    method:"get",
    data:{
      keyword:"label"
    },
    success: function (res) {
      that.setData({
        labels: res.data
      });
      }
  });
  wx.request({
    url: 'http://www.jessicxin.top/oldplace/oldplace.php',
    method: "get",
    data: {
      keyword: "food"
    },
    success: function (res) {
      that.setData({
        foods:res.data
      });
    }
  });
  wx.request({
    url: 'http://www.jessicxin.top/oldplace/oldplace.php',
    method: "get",
    data: {
      keyword: "seller"
    },
    success: function (res) {
      that.setData({
        seller: res.data
      });
    }
  });
 
  wx.request({
    url: 'http://www.jessicxin.top/oldplace/oldplace.php',
    method: "get",
    data: {
      keyword: "activity"
    },
    success: function (res) {
      that.setData({
        activity: res.data
      });
    }
  });
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });
 },
})