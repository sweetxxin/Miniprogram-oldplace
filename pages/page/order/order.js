// pages/index/order.js
Page({
  data: {
    time:0,
    currentTime:0,
    totalPrice:0,
    orders:{},
    username:"",
    user:{},
    addAddrDisplay:"block",
    addrDisplay:"none",
    addrInfo:{},
    tableware:["无需",1,2,3,4,5,6,7,8,9,10,"10份以上"],
    num:"未选择 >",
    attachment:"口味、偏好"
  },
  addAddr:function(){
    wx.navigateTo({
      url: "/pages/page/addAddress/addAddress"
    });
  },
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  bindPickerChange: function (e) {
    if (e.detail.value != 11 && e.detail.value!=0){
      this.setData({
    num: this.data.tableware[e.detail.value] + "份餐具"
      })
      }else{
      this.setData({
      num: this.data.tableware[e.detail.value] + "餐具"
      })
   }
  },
  orderAttachment:function()
  {
    wx.navigateTo({
      url: '/pages/page/attachment/attachment',
    })
  },
  pay:function(){
    wx.request({
      url: 'http://localhost/oldplace/oldplace.php',
      data: {
        "keyword": "order",
        username: options.user,
        orders:JSON.stringify(this.data.orders)
      },
      method:'POST',
      success: function (e) {
        console.log(e.data);
      }
    });
  },
  onLoad: function (options) {
    if (wx.getStorageSync('addrInfo').name){
        this.setData({
          addrInfo: wx.getStorageSync('addrInfo'),
          addrDisplay:"block",
          addAddrDisplay:"none"
        });
    }else{
      wx.request({
        url: 'http://localhost/oldplace/oldplace.php',
        data: {
          "keyword": "user",
          username: wx.getStorageSync('user'),
        },
       success: function (e) {
          var address = e.data;
          if (address != "inexistent")
          {
            console.log(111);
          }
        }
    });
    }
       
    var date = new Date;
    var arriveTime = new Date(date.getTime()+60*60*1000);
    var m = (arriveTime.getMinutes() + 1 <= 10 ? '0' + arriveTime.getMinutes() : arriveTime.getMinutes());
    var h = (arriveTime.getHours() + 1 <= 10 ? '0' + arriveTime.getHours() : arriveTime.getHours());
    this.setData({
      currentTime: h + ":" + m,
      time: "尽快送达(" +h + ":" + m+")",
      orders: wx.getStorageSync('orders'),
      totalPrice: wx.getStorageSync('totalPrice'),
      username: wx.getStorageSync('user')
    })
  },
})