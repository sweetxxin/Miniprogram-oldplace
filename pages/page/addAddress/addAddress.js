var QQMapWX = require('./../../lib/qqmap/qqmap-wx-jssdk.js');
var qqmapsdk = new QQMapWX({
  key: 'TGSBZ-EOSRJ-A6LFF-K3DVE-YAAEQ-YCFJD'
});
Page({
  data: {
    pick:{},
    addrInfo:{},
    reccomend:{},
    display:"none"
  },
  saveName:function(event)
  {
    let key = "addrInfo.name";
    this.setData({
      [key]:event.detail.value
    })
  },
  picked:function(event){
    let on = event.target.dataset.key;
    let index = event.target.dataset.index;
    let key = "pick."+index;
    if(index=="gender"){
      this.setData({
        ["addrInfo.gender"]: event.target.dataset.name
      })
    }else{
      this.setData({
        ["addrInfo.label"]: event.target.dataset.place
      })
    }
    this.setData({
      [key]: {[on]:"on"},    
    });
  },
  saveTelephone:function(event)
  {
    this.setData({
      ['addrInfo.telephone']:event.detail.value
    })
  },
  saveDetail:function(event)
  {
    this.setData({
      ['addrInfo.detail']: event.detail.value
    })
  },
  input:function(event)
  {
    var content = event.detail.value;
    var that = this;
    qqmapsdk.search({
      keyword: content,
      success: function (res) {
        that.setData({
          reccomend: res.data
        });
      },
  })
  },
  useAddr:function(event)
  {
    this.setData({
      ['addrInfo.address']: event.currentTarget.dataset.addr,
      display:"none"
    });
  },
  search:function()
  {
    this.setData({
      display: "block"
    });
    var content = this.data.address;
    var demo = new QQMapWX({
      key: 'TGSBZ-EOSRJ-A6LFF-K3DVE-YAAEQ-YCFJD'
    });
    var that = this;
      demo.search({
        keyword: "学校",
        success: function (res) {
          that.setData({
            reccomend: res.data
          });
        },
      })
  },
  sure:function()
  {
    wx.setStorageSync('addrInfo',this.data.addrInfo),
    wx.navigateTo({
      url: "/pages/page/order/order"
    });
  },
  onLoad: function (options) {
    var gender = wx.getStorageSync("addrInfo")["gender"] == "先生"?"man":"lady";
    var place;
    switch (wx.getStorageSync("addrInfo")["label"]){
      case "学校":place="school";break;
      case "公司":place="company";break;
      case "家":  place="home";break;
    }

  this.setData({
    yourName:wx.getStorageSync("addrInfo")["name"],
    telephone: wx.getStorageSync("addrInfo")["telephone"],
    ["pick.gender"]:{[gender]:"on"},
    ["pick.label"]:{[place]:"on"}
  })

    var that = this
    wx.getLocation({
      type: 'wgs84',
      altitude:"true",
      success: function (res) {
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (addressRes) {
            var address = addressRes.result.formatted_addresses.recommend;
            that.setData({
              ['addrInfo.address']: address
             })
          }
        })
      }
    })
  },
})