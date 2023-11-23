import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import productReducer from './slices/productSlice'
import userReducer from './slices/userSlice'
import orderReducer from './slices/orderSlice'
import voucherReducer from './slices/voucherSlice'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

// vì khi reload thì các slides (product , user ,...) của redux sẽ mất nên cần use redux-persist để lưu các slides vào storage

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist: ['order','user'] // cho phép redux này KO được lưu trong storage , thiệt ra user cx ko cần lưu vì kể cả reload lại thì app.jsx chạy first cx sẽ lấy đc user
}

const rootReducer = combineReducers({
    order: orderReducer,
    product: productReducer,
    user: userReducer,
    voucher: voucherReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)


export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export let persistor = persistStore(store)