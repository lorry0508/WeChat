import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    // 查询关键词
    query: '',
    // 商品分类的Id
    cid: '',
    // 页码值
    pagenum: 1,
    // 每页显示多少条数据
    pagesize: 10,
    // 商品列表数据
    goodslist: [],
    // 总数据条数
    total: 0,
    // 数据是否加载完毕的布尔值，默认为 false
    isover: false,
    // 表示当前数据是否正在请求中
    isloading: false
  }

  onLoad(options) {
    console.log(options)
    this.query = options.query || ''
    this.cid = options.cid || ''
    this.getGoodsList()
  }

  methods = {
    // 点击跳转到商品详情页面
    goGoodsDetail(goods_id) {
      wepy.navigateTo({
        url: '/pages/goods_detail/main?goods_id=' + goods_id
      })
    }
  }

  // 获取商品列表数据
  async getGoodsList(cb) {
    this.isloading = true
    const { data: res } = await wepy.get('/goods/search', {
      query: this.query,
      cid: this.cid,
      pagenum: this.pagenum,
      pagesize: this.pagesize
    })

    if (res.meta.status !== 200) {
      return wepy.baseToast()
    }

    this.goodslist = [...this.goodslist, ...res.message.goods]
    this.total = res.message.total
    this.isloading = false
    this.$apply()
    cb && cb()
  }

  // 触底操作
  onReachBottom() {
    // 判断当前是否正在请求数据中
    if (this.isloading) {
      return
    }
    // 先判断是否有下一页的数据
    // 30
    // 3 * 10
    if (this.pagenum * this.pagesize >= this.total) {
      this.isover = true
      return
    }
    console.log('触底了')
    this.pagenum++
    this.getGoodsList()
  }

  // 下拉刷新的操作
  onPullDownRefresh() {
    // 初始化必要的字段值
    this.pagenum = 1
    this.total = 0
    this.goodslist = []
    this.isover = this.isloading = false

    // 重新发起数据请求
    this.getGoodsList(() => {
      // 停止下拉刷新的行为
      wepy.stopPullDownRefresh()
    })
  }
}
