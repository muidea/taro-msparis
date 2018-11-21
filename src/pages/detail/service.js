import Request from '../../utils/request';

// 获取商品详情
const getProductInfo = params => Request({
  url: '/product',
  method: 'GET',
  data: params,
});

export default getProductInfo;