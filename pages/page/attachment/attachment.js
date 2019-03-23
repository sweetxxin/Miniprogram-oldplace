// pages/page/attachment.js
Page({

  data: {
    label:{},
  },
  getAttachment:function(e)
  {
    this.setData({
      ["label.attachemnt"]:e.detail.value
    })
  },
  chooseLabel:function(event)
  {
    let on = event.target.dataset.key;
    let index = event.target.dataset.index;
    let key = "pick." + index;
    if (index == "la") {
      this.setData({
        ["label.la"]: event.target.dataset.name,
        [key]: { [on]: "on" },
      })
    }else{
      this.setData({
        ["label."+index]: event.target.dataset.name,
        [key]:"on"
      })
    }
  },
sure:function()
{
  var attachment="";
  for (var index in this.data.label) {
    attachment += this.data.label[index]+" ";
  }
  var pages = getCurrentPages();
  var prevPage = pages[pages.length - 2];
  prevPage.setData({
    attachment: attachment
  })
  wx.navigateBack({
  })
},
})