import {Route , Routes, useLocation, useNavigate } from 'react-router-dom'
import { routes } from './routes'
import DefaultComponent from './components/DefaultComponent/DefaultComponent'
import { Fragment, useEffect, useState} from 'react'
import jwt_decode from 'jwt-decode'
import * as userService from './services/UserService'
import * as orderUnpaidService from './services/OrderUnpaidService'
import { useDispatch, useSelector } from 'react-redux'
import { resetUser, updateUser } from './redux/slices/userSlice'
import { cloneOrder, resetOrder } from './redux/slices/orderSlice'
import PrivateRouter from './routes/privateRouter'
import axios from 'axios'
import { toast } from 'react-toastify'
import { toastMSGObject } from './utils/utils'
import { useMutation } from '@tanstack/react-query'
import dayjs from 'dayjs'

export default function App() {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const order = useSelector((state) => state.order);
    const [isLoading , setIsLoading] = useState(true);

    // handle load order unpaid trong DB vào orderSlice
    const mapOrderItems = (orderItemsAPI) => {
      return [...orderItemsAPI].map(item => {
        const { isSelected , ...rest} = item
        return rest
      })
    }

    const mapOrderItemsSelected = (orderItemsSelectedAPI) => {
      return [...orderItemsSelectedAPI].filter(item => item.isSelected).map(item => {
        const { isSelected , ...rest} = item
        return rest
      })
    }

    const mapOrderUnpaid = (OUapi) => {
      return {
        ...OUapi,
        orderItems : mapOrderItems(OUapi.orderItems),
        orderItemsSelected : mapOrderItemsSelected(OUapi.orderItems)
      }
    }

    useEffect(() => {
      if(user?.name){
        orderUnpaidService.getOrderUnpaidByUser(user.accessToken)
          .then(res => {
            if(res.data){
              dispatch(cloneOrder(mapOrderUnpaid(res.data)))
            }else{
              orderUnpaidService.addOrderUnpaid(
                { 
                  userId : user.id , 
                  orderItems : order.orderItems.map(item => ({
                    product : item.product,
                    amount : item.amount,
                    isSelected : false
                  })),
                  totalQuantity : order.totalQuantity
                }
              )
                .then(res => {
                  dispatch(cloneOrder(mapOrderUnpaid(res.data)))
                })
            }
          })
          .catch((error) => {
            const {data , message} = error.response.data;
            toast.error(message , toastMSGObject({}));
            dispatch(cloneOrder(mapOrderUnpaid(data)))
          })
      }
    },[user.name])

    // handle Update order unpaid at DB
    const mutationUpdateOU = useMutation(
      (data) => orderUnpaidService.updateOrderUnpaid(data),{
        onError : (error) => {
          const {data , message} = error.response.data;
          toast.error(message , toastMSGObject({}));
          dispatch(cloneOrder(mapOrderUnpaid(data)))
        }
      }
    )
  
    useEffect(() => {
      if(user.name){
        const handle = setTimeout(() => {
          const orderFilter = order.orderItems.map((item) => {
            if(order.orderItemsSelected.some(itemSelected => itemSelected.product === item.product)){
              return {...item , isSelected : true}
            }
            return {...item , isSelected : false}
          })
          mutationUpdateOU.mutate(
            { 
              userId : user.id , 
              orderItems : orderFilter.map(item => ({
                product : item.product,
                amount : item.amount,
                isSelected : item.isSelected
              })),
              totalQuantity : order.totalQuantity
            }
          )
        }, [1500])
        return () => {
          clearTimeout(handle)
        }
      }
    },[order.orderItems , order.orderItemsSelected])
  

    useEffect(() => {
      const { storageData, decoded } = handleDecoded();
      if (decoded?.payload?._id) {
        handleGetDetailsUser(storageData)
      }else{
        
      }
    },[])

    const handleDecoded = () => {
      let storageData = localStorage.getItem('accessToken')
      let decoded = {}
      if(storageData){
        decoded = jwt_decode(storageData);
      }
      return { decoded, storageData }
    }

    const handleGetDetailsUser = async (token) => {
      const res = await userService.getDetailsUser(token);
      dispatch(updateUser({...res?.data, accessToken: token}))
    }

    // check access token is expried or not ?
    axios.interceptors.request.use(async function (config) {
      // Do something before request is sent , it is the same middleware in BE     
      if(config.headers?.authorization){
        //const currentTime = new Date()
        const { decoded } = handleDecoded()
        // if (decoded?.exp < currentTime.getTime() / 1000) {
        if(dayjs.unix(decoded.exp).diff(dayjs()) < 1){              
          userService.refreshToken()
            .then(response => {
              localStorage.setItem('accessToken',response.accessToken);
              dispatch(updateUser({...user , accessToken : response.accessToken}));
              config.headers['authorization'] = `Bearer ${response.accessToken}`
            })
            .catch(async (error) => { 
              toast.error("Bạn đã hết phiên đăng nhập", toastMSGObject({}));
              navigate('/');
              localStorage.removeItem('accessToken');
              dispatch(resetUser());
              dispatch(resetOrder());
            })
        }else{
          config.headers['authorization'] = `Bearer ${localStorage.getItem('accessToken')}`
        }
      }
      return config;
    }, function (error) {
      // Do something with request error
      return Promise.reject(error);
    });

    return (
      // <TransitionGroup>
      //   <CSSTransition
      //     timeout={0}
      //     key={location.pathname}
      //     classNames="page"
      //     unmountOnExit         
      //   >
          <Routes location={location}>
            {routes.map((route,index) => {
              const Page = route.page
              const Layout = route.isShowHeader ? DefaultComponent : Fragment
              return (
                <Route key={index} path={route.path} element={
                    <Layout>
                      {
                        route.path === '/cart/payment' ||
                        route.path === '/cart/payment/success' ||
                        route.path === '/customer/:menu' ||
                        route.path === '/system/admin' ? (
                          <PrivateRouter>
                            <Page/>
                          </PrivateRouter>
                        ) : (
                          <Page/>
                        )
                      }
                    </Layout>
                  } 
                />
              )
            })}
          </Routes>
      //   </CSSTransition>
      // </TransitionGroup>
    )
}
