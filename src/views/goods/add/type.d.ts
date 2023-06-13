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
   * 是否上传图片
   */
  isAddImage: boolean
  /**
   * 名称
   */
  title: string
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
