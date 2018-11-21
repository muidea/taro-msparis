import Request from '../../utils/request';

const getAddressList = data => Request({
  url: '/user/address',
  method: 'GET',
  data,
});

export default getAddressList;
