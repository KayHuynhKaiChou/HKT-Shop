export const orderConstant = {
    delivery: {
      fast:`
        <span>
          <span>FAST</span> Giao hàng tiết kiệm
        </span>      
      ` 
      ,
      gojek:`
        <span>
          <span>GO_JEK</span> Ứng dụng gọi xe giao hàng
        </span>      
      ` 
    },
    payment: {
      later_money: 'Thanh toán tiền mặt khi nhận hàng',
      paypal: 'Thanh toán bằng paypal'
    }
}

export const conditionVoucher = [
  {
    key : 'min',
    title : 'Áp dụng cho đơn tối thiểu'

  },
  {
    key : 'cate',
    title : 'Áp dụng cho các sản phẩm của 1 danh mục'
  },
  {
    key : 'all',
    title : 'Tất cả các sản phẩm'
  }, 
]