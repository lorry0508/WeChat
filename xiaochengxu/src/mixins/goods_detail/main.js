import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    // 商品的Id值
    goods_id: '',
    // 商品的详情
    goodsInfo: {},
    // 收货地址
    addressInfo: null
  }

  onLoad(options) {
    console.log(options)
    this.goods_id = options.goods_id
    this.getGoodsInfo()
  }

  methods = {
    // 点击预览图片
    preview(current) {
      wepy.previewImage({
        // 所有图片的路径
        urls: this.goodsInfo.pics.map(x => x.pics_big),
        // 当前默认看到的图片
        current: current
      })
    },
    // 获取用户的收货地址
    async chooseAddress() {
      const res = await wepy.chooseAddress().catch(err => err)

      if (res.errMsg !== 'chooseAddress:ok') {
        return wepy.baseToast('获取收货地址失败！')
      }

      this.addressInfo = res
      wepy.setStorageSync('address', res)
      this.$apply()
    },
    // 点击按钮，把商品添加到购物车列表中
    addToCart() {
      // 获取到当前商品的所有信息
      // console.log(this.goodsInfo)
      // console.log(this.$parent.globalData)
      // console.log(this.$parent)
      this.$parent.addGoodsToCart(this.goodsInfo)
      // 提示用户加入购物车成功
      wepy.showToast({
        title: '已加入购物车',
        icon: 'success'
      })
    }
  }

  computed = {
    addressStr() {
      if (this.addressInfo === null) {
        return '请选择收货地址'
      }
      const addr = this.addressInfo
      const str =
        addr.provinceName + addr.cityName + addr.countyName + addr.detailInfo
      return str
    }
  }

  // 获取商品详情数据
  async getGoodsInfo() {
    const {
      data: res
    } = await wepy.get('/goods/detail', {
      goods_id: this.goods_id
    })

    if (res.meta.status !== 200) {
      return wepy.baseToast()
    }

    this.goodsInfo = res.message
    this.$apply()
  }
}
