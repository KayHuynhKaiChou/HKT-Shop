import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  search : '',
  typesProduct : []
}

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    searchProduct: (state,action) => {
      state.search = action.payload
    },
    updateTypesList: (state,action) => {
      state.typesProduct = [...action.payload]
    }
  },
})

// Action creators are generated for each case reducer function
export const { searchProduct , updateTypesList } = productSlice.actions

export default productSlice.reducer