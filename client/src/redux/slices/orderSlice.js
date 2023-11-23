import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    orderItems: [],
    orderItemsSelected: [],
    totalQuantity: 0, // theo orderItems,
    userId: ''
}

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addOrderProduct : (state, action) => {
        const {orderItem} = action.payload;
        const itemOrder = state?.orderItems?.find((item) => item?.product === orderItem.product);
        if(itemOrder){
            itemOrder.amount += orderItem.amount
        }else{
            state?.orderItems.push(orderItem)
        }
        state.totalQuantity = state.totalQuantity + orderItem.amount;
    },
    changeAmount : (state , action) => {
      const {idItem , amountChange} = action.payload;
      const orderItem = state.orderItems.find(item => item.product === idItem);
      const orderItemSelected = state.orderItemsSelected.find(itemSe => itemSe.product === idItem);
      // change amount of sản phẩm chưa selected và đã selected
      if(orderItem) {
          orderItem.amount = amountChange;
          if(orderItemSelected){
            orderItemSelected.amount = amountChange
          }
          state.totalQuantity = state.orderItems.reduce((total, item) => {
              return total + item.amount;
          }, 0);
      }
    },
    removeOrderProduct : (state,action) => {
      const {idProduct} = action.payload;
      const fiterOrderItems = state?.orderItems?.filter((item) => item?.product !== idProduct);
      state.orderItems = fiterOrderItems;
      state.totalQuantity = fiterOrderItems.reduce((total , item ) => {
        return total + item.amount
      },0);
    },
    removeAllOrderProduct : (state,action) => { // xóa nhiều hoặc tất cả sản phẩm đã select
      const {idsProduct} = action.payload;
      const fiterOrderItems = state?.orderItems?.filter((item) => !idsProduct.includes(item?.product));
      state.orderItems = fiterOrderItems;
      //state.orderItemsSelected = [];
      state.totalQuantity = fiterOrderItems.reduce((total , item ) => {
        return total + item.amount
      },0);
    },
    setOrderItemsSelected : (state, action) => {
      const {idsProduct} = action.payload;
      state.orderItemsSelected = state?.orderItems?.filter((item) => idsProduct.includes(item?.product));
    },
    resetOrder : () => {   
      return {
        ...initialState,
      }
      //order.orderItems.filter(item => !order.orderItemsSelected.includes(item))
    },
    cloneOrder : (state , action) => {
      return {...action.payload}
    }
  },
})

// Action creators are generated for each case reducer function
export const { 
  addOrderProduct , 
  changeAmount , 
  removeOrderProduct, 
  removeAllOrderProduct , 
  setOrderItemsSelected , 
  resetOrder, 
  cloneOrder
} = orderSlice.actions

export default orderSlice.reducer