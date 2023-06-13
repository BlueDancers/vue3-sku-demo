<template>
  <div class="base_card">
    <a-form>
      <a-form-item label="销售属性" name="skuAttributes">
        <div class="mb-[10px] bg-[#fafafa] p-[8px] max-w-[1000px]" v-for="(item, index) in skuAttributes">
          <div class="flex items-center relative">
            <a-popconfirm title="确定删除吗?" @confirm="deleteSkuAttr(index)" placement="right">
              <a-button class="absolute top-[5px] right-[5px]" type="text">删除</a-button>
            </a-popconfirm>
            <div class="w-[60px] text-right">属性名称:</div>
            <a-input class="ml-5 w-[130px]" v-model:value="item.title" placeholder="请输入属性名称"></a-input>
          </div>
          <div class="flex items-start mt-10">
            <div class="w-[60px] text-right leading-[32px]">属性值:</div>
            <div class="ml-5 relative sku_item" v-for="(text, cindex) in item.values">
              <DeleteIcon
                class="sku_item_delete absolute top-[-4px] right-[4px] z-50"
                @click="deleteSkuAttrName(index, cindex)"
              ></DeleteIcon>
              <div class="flex flex-col items-center mr-[10px]">
                <a-input
                  placeholder="请输入属性值"
                  class="w-[130px]"
                  v-model:value="text.attributeValue"
                ></a-input>
                <div
                  v-if="item.isAddImage"
                  class="relative w-[100px] h-[100px] border-solid border-[#eee] border-[1px] mt-[10px] cursor-pointer flex justify-center items-center bg-white"
                  @click="addSkuAttrImage(index, cindex)"
                >
                  <img v-if="text.thumbnailUrl" class="w-[100%] h-[100%]" :src="text.thumbnailUrl" />
                  <svgIcon v-else class="w-[40px] h-[40px]" name="add" color="#eee"></svgIcon>
                </div>
              </div>
            </div>
            <a-button :disabled="item.values.length >= 5" type="text" @click="addSkuAttrName(index)">
              增加字段
            </a-button>
            <a-button class="ml-[10px]" v-if="isAddImg" @click="toggleSkuImg(index)">上传图片</a-button>
            <a-button class="ml-[10px]" v-if="item.isAddImage" @click="toggleSkuImg(index)">
              取消上传
            </a-button>
          </div>
        </div>
        <a-button type="primary" ghost @click="addSkuAttr">增加销售属性</a-button>
      </a-form-item>
      <a-form-item label="销售规格" name="stockKeepUnits">
        <a-form-item-rest>
          <a-table
            class="mt-[10px] max-w-[1000px] w-auto"
            bordered
            :dataSource="stockKeepUnits"
            :columns="columns"
            :pagination="false"
          >
            <template #bodyCell="{ column, record, index }">
              <div v-if="column.dataIndex === 'attributeValue'">
                <span>{{ record.attributeValue }}</span>
              </div>
              <div v-else-if="column.dataIndex === 'thumbnailUrl'">
                <img v-if="record.thumbnailUrl" class="w-[90px] h-[90px]" :src="record.thumbnailUrl" />
              </div>
              <div v-else>
                <a-input class="w-[80px]" v-model:value="record[column.dataIndex]"></a-input>
              </div>
            </template>
          </a-table>
        </a-form-item-rest>
      </a-form-item>
      <a-button type="primary" @click="save" class="ml-[70px]">保存sku</a-button>
      <a-button type="danger" ghost @click="togoGithub" class="ml-[20px]">查看源码</a-button>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, type Ref, computed } from 'vue'
import type { skuType, skuAttrItemType } from './type.d'
import type { ColumnType } from 'ant-design-vue/lib/table'
import { chooseToFile } from '@yipai-front-end/choose-to-file'
import { deepClone } from '@yipai-front-end/lib'
import DeleteIcon from './components/deleteIcon.vue'
import { message } from 'ant-design-vue'

const skuAttributes: Ref<skuAttrItemType[]> = ref([])
const stockKeepUnits: Ref<skuType[]> = ref([])
let afterSku: skuType[] = []

const skuAttrItem: skuAttrItemType = {
  title: '',
  isAddImage: false,
  values: [{ thumbnailUrl: '', attributeValue: '' }],
}

const columns: ColumnType[] = [
  {
    dataIndex: 'attributeValue',
    title: '销售规格',
  },
  {
    dataIndex: 'thumbnailUrl',
    title: '图片',
  },
  {
    dataIndex: 'price',
    title: '*售价',
  },
  {
    dataIndex: 'marketPrice',
    title: '*市场价',
  },
  {
    dataIndex: 'stock',
    title: '*库存',
  },
  {
    dataIndex: 'specificationBarCode',
    title: '商品条码',
  },
]

// 是否可以增加图片
const isAddImg = computed(() => {
  return skuAttributes.value.findIndex((e) => e.isAddImage == true) == -1 ? true : false
})

// 监听sku本身的变化,并将当前sku进行备份
watch(
  () => stockKeepUnits.value,
  (value) => {
    afterSku = deepClone(value)
  },
  { deep: true }
)

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
  skuAttribute.map((item) => {
    attrValue.push(item.values)
  })
  let skus: any[] = []
  if (attrValue.length === 0) {
    stockKeepUnits.value = []
    return
  }

  skus = attrValue.reduce((col: any[], set) => {
    let res: any[] = []
    col.forEach((c) => {
      set.forEach((s) => {
        let t = c.attributeValue + ',' + s.attributeValue
        res.push({ attributeValue: t, thumbnailUrl: c.thumbnailUrl || s.thumbnailUrl || '' })
      })
    })
    return res
  })
  // 增加,回显相关字段
  skus.map((e: skuType) => {
    // 寻找销售规格一致的副本数据
    let old = afterSku.find((item) => item.attributeValue == e.attributeValue)
    console.log('单项', e)
    e.id = old == null ? '' : old.id
    e.price = old == null ? '' : old.price
    e.marketPrice = old == null ? '' : old.marketPrice
    e.stock = old == null ? '' : old.stock
    e.specificationBarCode = old == null ? '' : old.specificationBarCode
    return e
  })
  console.log(skus, 'skus')
  stockKeepUnits.value = skus
}

/**
 * 删除销售属性
 * @param index
 */
function deleteSkuAttr(index) {
  skuAttributes.value.splice(index, 1)
}

/**
 * 删除销售属性字段
 * @param index
 * @param cindex
 */
function deleteSkuAttrName(index: number, cindex: number) {
  skuAttributes.value[index].values.splice(cindex, 1)
}

/**
 * 增加sku属性图片
 * @param index
 * @param cindex
 */
async function addSkuAttrImage(index: number, cindex: number) {
  let res = await chooseToFile()
  console.log(res)
  // 生产环境此处应该是上传到服务端,获取线上url
  // 此处写法仅限测试,上传大图片可能造成卡顿
  _blobToDataUrl(res[0], (res) => {
    skuAttributes.value[index].values[cindex].thumbnailUrl = res
  })
}

/**
 * 增加销售属性字段
 * @param index
 */
function addSkuAttrName(index: number) {
  skuAttributes.value[index].values.push({ attributeValue: '', thumbnailUrl: '' })
}

/**
 * 切换首个sku是否上传图片的状态
 */
function toggleSkuImg(index) {
  let { isAddImage } = skuAttributes.value[index]
  if (isAddImage) {
    skuAttributes.value[index].values.map((e) => {
      e.thumbnailUrl = ''
      return e
    })
  }
  skuAttributes.value[index].isAddImage = !isAddImage
}

/**
 * 增加销售属性
 */
function addSkuAttr() {
  skuAttributes.value.push(deepClone(skuAttrItem))
}

/**
 * 动态更新表格字段
 * @param index
 * @param dataIndex
 */
function changeSkuData(index: number, dataIndex: string, evt: any) {
  let value = evt.target.value
  stockKeepUnits.value[index][dataIndex] = value
}

function save() {
  message.success('请查看控制台输出')
  console.log('销售属性:', skuAttributes.value)
  console.log('sku:', stockKeepUnits.value)
}

function _blobToDataUrl(file, callback) {
  const reader = new FileReader()
  reader.onload = () => {
    const url = URL.createObjectURL(file) // 获取临时访问链接
    callback(url)
  }
  reader.readAsDataURL(file)
}

function togoGithub() {
  location.href = 'https://github.com/BlueDancers/vue3-sku-demo'
}
</script>

<style lang="less" scoped>
.sku_item {
  &:hover {
    .sku_item_delete {
      opacity: 1;
    }
  }
  .sku_item_delete {
    opacity: 0;
  }
}
</style>
