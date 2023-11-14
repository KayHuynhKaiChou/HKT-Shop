import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    vouchersSelected: [],
}

export const voucherSlice = createSlice({
  name: 'voucher',
  initialState,
  reducers: {
    addVoucherSelected : (state, action) => {
      const voucherSelected = action.payload;
      state.vouchersSelected.push(voucherSelected);
    },
    removeVoucherSelected : (state, action) => {
      const voucherSelected = action.payload;
      state.vouchersSelected = state.vouchersSelected.filter(vou => vou._id !== voucherSelected._id);
    },
    resetVoucher : () => {   
      return {
        ...initialState,
      }
    }
  },
})

// Action creators are generated for each case reducer function
export const { 
  addVoucherSelected,
  removeVoucherSelected,
  resetVoucher
} = voucherSlice.actions

export default voucherSlice.reducer