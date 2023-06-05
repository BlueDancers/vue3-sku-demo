/**
 * sku表格字段
 */
export type skuType = {
  attributeValue: string
  id?: string
  marketPrice: string
  price: string
  specificationBarCode: string
  stock: string
  thumbnailUrl: string
}

/**
 * 销售属性类型
 */
export type skuAttrItemType = {
  /**
   * 编辑场景存在的id
   */
  id?: string
  /**
   * 是否上传图片
   */
  isAddImage: boolean
  /**
   * 名称
   */
  title: string
  /**
   * 属性类型 2 销售属性
   */
  type?: 2
  /**
   * 具体数据
   */
  values: {
    /**
     * 属性图片
     * */
    thumbnailUrl?: string
    /**
     * 属性名称
     */
    attributeValue: string
  }[]
}
