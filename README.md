# Vue3 笛卡尔积算法构建SKU最佳实践！看完不会来打我



## 前言

​	商城一直都是平台研发类的高频项目，也存在诸多含金量与难度非常大的功能点，比如**购物车模块、支付模块、装修模块、商品模块**、以及很多与业务相关的模块，主导此类复杂需求的开发与落地不仅可以**升职加薪**，也是面试中的**展示肌肉**的时刻，

​	所以今天，我和大家分享一个在正式项目中沉淀出来的**Vue3版发布商品 - 构建sku的思路以及具体实现方案**；附带源码与案例，点赞收藏不迷路，接下来进入正文~



源码：https://github.com/BlueDancers/vue3-sku-demo/blob/main/src/views/goods/add/index.vue

案例：https://bluedancers.github.io/vue3-sku-demo



## 什么是SKU

​	在开始正文之前，首先要做一次扫盲，那就是我们说的电商项目中的SKU，究竟是什么？

​	SKU的全称是**Stock Keeping Units**，我们可以理解为**商家用于管理商品库存和销售的一种方式**。

​	每个 SKU 对应着一个若干**属性**的组合，例如一个商品存在**颜色、尺寸、款式**等属性。商家可以根据商品的不同属性设置不同的 SKU，并对每个 SKU 进行价格、库存若干信息的管理。

​	举个例子，假设商家有一件衬衫商品，有**红色、蓝色**两种颜色、**S、M、L** 三种尺码可选。那么该商品便存在 **6 个 SKU** ，分别为：

- 红色 S 号
- 红色 M 号
- 红色 L 号
- 蓝色 S 号
- 蓝色 M 号
- 蓝色 L 号

在这里我们就要明确一下概念了，**颜色、尺码**都是我们的商品属性中的**销售属性**，而生成的 **红色 S 号 红色 M 号 等等** 就是我们的**SKU**。



再让我们在看看某宝的SKU选择弹窗

<img src="http://qiliu.vkcyan.top/FnoRiGevwfyWw1iDnZu5FD_mNrQi.png" style="zoom:33%;" />

​	这个商品的**销售属性**：尺码（6个） 颜色分类（6个），那么通过销售属性，最终将会生成**6*6=36个SKU**，而用户选择任意尺码 + 颜色分类的搭配都可以匹配到具体的价格与库存等信息。

​	以上提到的功能点，就设计到电商后台的商品模块的SKU构建知识点，接下来让我们看看，如何使用Vue3构建SKU。



## 具体实现

### 构建销售属性

​	通过上面的案例，我们得知了SKU并非凭空捏造出来的，而是由**销售属性**动态生成。

​	那么根据某宝的SKU信息，我们反向推导一下，他的销售属性的数据结构可能是这样

```ts
type skuAttrItemType = {
  title: string // 销售属性名称
  values: {
    attributeValue: string // 属性名称
  }[]
}
```

​	如果，不考虑SKU的图片，我们的每个销售属性的数据结构都这样，存在一个销售属性的名称，以及若干个属性值。

​	我们继续观察某宝，发现无论如何修改尺码，白色的图片都是同一张，不会随着尺码的变化而变化，因此我们可以推断出，**sku的图片是由着销售属性进行设置的**；

​	另外还要注意一个细节，一个商品无论存在多少个销售属性，最终只能为其中一个销售属性设定图片，所以我们优化一下我们的销售属性数据结构，增加销售属性图片的字段。

```ts
type skuAttrItemType = {
  title: string // 销售属性名称
  isAddImage: boolean // 是否上传图片（最多只能打开一个）
  values: {
    attributeValue: string // 属性名称
    thumbnailUrl?: string // 属性图片
  }[]
}
```

​	于是，我们便可以得出我们案例的数据结构

```ts
let skuAttrItemType = [
  {
    title: '尺码',
    isAddImage: false,
    values: [
      { attributeValue: 'S' },
      { attributeValue: 'M' },
      // ....
    ],
  },
  {
    title: '颜色分类',
    isAddImage: true,
    values: [
      { attributeValue: '白色', thumbnailUrl: '...白.png' },
      { attributeValue: '黑色', thumbnailUrl: '...黑.png' },
      // ....
    ],
  },
]
```

​	这样的数据结构便满足了我们客户端渲染商品SKU，用户可以将不同的尺码与颜色分类进行搭配，但是我们目前仅能实现SKU的选择，还无法满足用户选择任意尺码 + 颜色分类的搭配后，立刻得知价格的场景。

这也是我们下一步需要解决的问题，就是基于销售属性构建商品SKU。



### 使用笛卡尔积算法实现商品SKU的构建

基于以上销售属性，我们的目标是构建一个如下的结构

````js
let sku = [
  {
    attributeValue: 'S,白色',
    thumbnailUrl: '...白.png',
    // ... 价格 库存 等等信息
  },
  
    attributeValue: 'S,黑色',
    thumbnailUrl: '...黑.png',
    // ... 价格 库存 等等信息
  },
  {
    attributeValue: 'M,白色',
    thumbnailUrl: '...白.png',
    // ... 价格 库存 等等信息
  },
  {
    attributeValue: 'M,黑色',
    thumbnailUrl: '...黑.png',
    // ... 价格 库存 等等信息
  },
]
````

SKU的生成是存在明确的运算规则的，**销售属性的属性名称的数量的乘积等于SKU的数量**。

比如我们上线的销售属性是 两个尺码 两个颜色分类，则生成的SKU数量2 * 2 = 4个

假如我们存在三个尺码 三个颜色分类，则生成的SKU数量3 * 3 = 9个

假如我们再多一个销售属性 两个尺码 三个颜色 四个风格，则生成的SKU数量为 2 * 3 * 4 = 24个



​	我们程序如何实现以上逻辑呢？大部分小伙伴面对这样的诉求的第一反应应该都是递归，因为销售属性的数量是未知的，写死循环实现是不现实的，不过在SKU生成上，我们一般使用更加简单的**笛卡尔积算法**。

​	**笛卡尔积：笛卡尔乘积是指在数学中，两个集合X和Y的笛卡尓积，又称直积，表示为X × Y，第一个对象是X的成员而第二个对象是Y的所有可能有序对的其中一个成员 。**

<img src="http://qiliu.vkcyan.top/Fmr0wr2qWAEvldYISLN3RLzcK6zt.png" style="zoom:30%;" />

接下来，我们就来实现这一部分的逻辑

sku的生成是实时的，销售属性的变化会引发sku的变化，所以我们需要监听销售属性的变化，这里我们通过watch进行实现



> 笛卡尔积本身不复杂，熟练了解reduce即可，如果有点忘记了，请去[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)复习一下~

```ts
type skuAttrItemType = {
  title: string // 销售属性名称
  isAddImage: boolean 是否上传图片（限制最多只能打开一个）
  values: {
    attributeValue: string // 属性名称
    thumbnailUrl?: string // 属性图片
  }[]
}

// 监听销售属性的变化,并构建sku
watch(
  () => skuAttributes.value,
  (value) => {
    if (value.length) {
      generateSku(deepClone(value))
    }
  },
  { deep: true }
)

/**
 * 更新销售属性构建sku
 * @param skuAttribute
 */
function generateSku(skuAttribute: skuAttrItemType[]) {
  let attrValue: any[] = []
  skuAttribute.map((item) => attrValue.push(item.values)) // 获取所有属性名称 => [['S','M'], ['白','黑']]
  
  // 开始构建sku 
  let skus: any[] = []
  // 笛卡尔积算法（注意，我们的reduce没有指定第二个参数，则第一次循环中，col是数组第一位，set是数组第二位）
  skus = attrValue.reduce((col: any[], set) => {
    let res: any[] = []
    // 对于每个属性值集合，依次与当前已有的结果集做笛卡尔积
    col.forEach((c) => {
      set.forEach((s) => {
         // 将两个属性值合并为一个字符串，并存入结果集中
        let t = c.attributeValue + ',' + s.attributeValue
         // 寻找销售属性指定的图片
        res.push({ attributeValue: t, thumbnailUrl: c.thumbnailUrl || s.thumbnailUrl || '' })
      })
    })
     // 将笛卡尔积后的结果集返回，作为下一轮的结果集
    return res
  })
    // 将结果存储起来
  stockKeepUnits.value = skus
}
```

经过以上的代码，我们变化销售属性，就会得出以下的结果

```js
let sku = [
  {
    attributeValue: 'S,白',
    thumbnailUrl: '...白.png',
  },
  {
    attributeValue: 'S,黑',
    thumbnailUrl: '...黑.png',
  },
  {
    attributeValue: 'M,白',
    thumbnailUrl: '...白.png',
  },
  {
    attributeValue: 'M,黑',
    thumbnailUrl: '...黑.png',
  },
]
```

这便实现了我们的sku算法，无论是多么复杂的销售属性，都可以通过该函数，输出符合预期的SKU。



这时候有同学要说了，哎，我SKU的价格，库存等等属性呢？

这还不简单？赋值之前再循环一遍，增加字段即可。

```js
skus.map((e: skuType) => {
  e.price = '' // 价格
  e.marketPrice = '' // 市场价
  e.stock = '' // 库存
  e.specificationBarCode = '' // 销售规格
  return e
})
// 将结果存储起来
stockKeepUnits.value = skus
```

最终我们得到了这样的结果

```js
let sku = [
  {
    attributeValue: 'S,白',
    thumbnailUrl: '...白.png',
    price: '',
    marketPrice: '',
    stock: '',
    specificationBarCode: '',
  },
  {
    attributeValue: 'S,黑',
    thumbnailUrl: '...黑.png',
    price: '',
    marketPrice: '',
    stock: '',
    specificationBarCode: '',
  },
  {
    attributeValue: 'M,白',
    thumbnailUrl: '...白.png',
    price: '',
    marketPrice: '',
    stock: '',
    specificationBarCode: '',
  },
  {
    attributeValue: 'M,黑',
    thumbnailUrl: '...黑.png',
    price: '',
    marketPrice: '',
    stock: '',
    specificationBarCode: '',
  },
]
```

数据准备妥当后，接下来我们就可以渲染表格了，这都是前端基操，我就不做过多赘述，有兴趣的朋友，可以看看[源码](https://github.com/BlueDancers/vue3-sku-demo)以及我精心为大家准备的案例。



### 实现SKU数据缓存

如果大家仔细想以上代码，会发现一个问题

​	假设，运营人员在发布商品的时候漏填了一个销售属性，尺码L，但是这时候运营已经填写好了SKU表格中的信息，如果这时候运营想增加字段，根据我们上面的代码，会触发skuAttributes.value的watch，进而运行generateSku，**开始重新构建SKU，导致运营人员之前的数据全部被重置了**。

<img src="http://qiliu.vkcyan.top/FtwTwzykFR8qzHJwZFVsHIA2XYug.png" style="zoom:50%;" />

​	而以上提到的场景是项目实际运营期间非常常见的场景，那么有没有办法，可以实现SKU的变动，不影响已经填写好的SKU呢。

​	实现起来其实也很简单，那就是，我们保存每一次生成的SKU的副本，然后在下一次SKU重新构建的时候，对比副本，再回填信息。

思路如下：

1. 实时保存SKU的副本
2. SKU重新构建的时候对比副本
3. 销售规格一致的SKU回填副本数据

```js
let afterSku: skuType[] = []

// 监听sku本身的变化,并将当前sku进行备份
watch(
  () => stockKeepUnits.value,
  (value) => {
    afterSku = deepClone(value)
  },
  { deep: true }
)

/**
 * 更新销售属性构建sku
 * @param skuAttribute
 */
function generateSku(skuAttribute: skuAttrItemType[]) {
  // .....
 	// 增加,回显相关字段
  skus.map((e: skuType) => {
    // 寻找销售规格一致的副本数据
    let old = afterSku.find((item) => item.attributeValue == e.attributeValue)
    e.id = old == null ? '' : old.id
    e.price = old == null ? '' : old.price
    e.marketPrice = old == null ? '' : old.marketPrice
    e.stock = old == null ? '' : old.stock
    e.specificationBarCode = old == null ? '' : old.specificationBarCode
    return e
  })
  stockKeepUnits.value = skus
}
```

当然也可以是其他回填规则，比如按照下标的方式回填，这就看具体业务的要求了，基于副本我们便完成了SKU的变动后数据的缓存功能。



## 最后

我们vue3版本的商城项目的SKU核心实现到此就全部结束了，如果你想了解全部代码，请点击[这里](https://github.com/BlueDancers/vue3-sku-demo)，如果你想测试案例，请点击这里

作为一名Vue3开发者，你可能对这个专栏感兴趣

[Pinia 源码分析专栏](https://juejin.cn/column/7124246398278565895)

[Vue3 硬核源码解析系列]( https://juejin.cn/column/7199826518570172472)

[写给前端nginx教程](https://juejin.cn/post/7052952117425733663)
