import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  id: '',
  name: '',
  email: '',
  isVerifiedEmail: false,
  avatar: '',
  gender: '',
  birthdate: '',
  accessToken: '',
  isAdmin: false,
  listVouchers: [], // ~ voucher lấy được , 1 array chứa các id vou
  listVouRegister: [] // voucher cho khách hàng mới , 1 array chứa cả vou
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action) => {
      const { name = '', email = '', isVerifiedEmail = false , accessToken = '', gender = '' , birthdate = '',
            avatar = '', _id = '', isAdmin, listVouchers , listVouRegister} = action.payload
      state.id = _id ? _id : state.id
      state.name = name ? name : state.name;
      state.email = email ? email : state.email;
      state.isVerifiedEmail = isVerifiedEmail ? isVerifiedEmail : state.isVerifiedEmail;
      state.avatar = avatar ? avatar : state.avatar;
      state.gender = gender ? gender : state.gender;
      state.birthdate = birthdate ? birthdate : state.birthdate;
      state.accessToken = accessToken ? accessToken : state.accessToken;
      state.isAdmin = isAdmin ? isAdmin : state.isAdmin;
      state.listVouchers = listVouchers ? listVouchers : state.listVouchers;
      state.listVouRegister = listVouRegister ? listVouRegister : state.listVouRegister;
    },
    resetUser: (state) => {
      state.name = '';
      state.email = '';
      state.address = '';
      state.phone = '';
      state.avatar = '';
      state.id = '';
      state.accessToken = '';
      state.isAdmin = false;
      state.city = '';
      state.listVouchers = [];
      state.listVouRegister = [];
    }
  },
})

// Action creators are generated for each case reducer function
export const { updateUser , resetUser } = userSlice.actions

export default userSlice.reducer