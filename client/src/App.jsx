import {Route , Routes, useLocation, useNavigate } from 'react-router-dom'
import { routes } from './routes'
import DefaultComponent from './components/DefaultComponent/DefaultComponent'
import { Fragment, useEffect} from 'react'
import jwt_decode from 'jwt-decode'
import * as userService from './services/UserService'
import * as orderUnpaidService from './services/OrderUnpaidService'
import { useDispatch, useSelector } from 'react-redux'
import { resetUser, updateUser } from './redux/slices/userSlice'
import { cloneOrder, resetOrder } from './redux/slices/orderSlice'
import { useMutationHooks } from './hooks/useMutationHook'
import { TransitionGroup, CSSTransition } from "react-transition-group";
import PrivateRouter from './routes/privateRouter'
import axios from 'axios'
import { toast } from 'react-toastify'
import { toastMSGObject } from './utils/utils'

export default function App() {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    //const [isLoading, setIsLoading] = useState(false)
    const user = useSelector((state) => state.user)
    const order = useSelector((state) => state.order);
    console.log(order)
    console.log(user)

    // handle load order unpaid trong DB vào orderSlice
    const mapOrderItems = (orderItemsAPI) => {
      console.log(orderItemsAPI)
      return [...orderItemsAPI].map(item => {
        const { isSelected , ...rest} = item
        return rest
      })
    }

    const mapOrderItemsSelected = (orderItemsSelectedAPI) => {
      console.log(orderItemsSelectedAPI)
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
      if(user.id){
        orderUnpaidService.getOrderUnpaidByUser(user?.id)
          .then(res => {
            if(res.data){
              dispatch(cloneOrder(mapOrderUnpaid(res.data)))
            }else{
              orderUnpaidService.addOrderUnpaid({...order , userId : user.id})
                .then(res => {
                  dispatch(cloneOrder(mapOrderUnpaid(res.data)))
                })
            }
          })
      }
    },[user])

    // handle Update order unpaid at DB
    const mutationUpdateOU = useMutationHooks(
      (data) => orderUnpaidService.updateOrderUnpaid(user.id , data)
    )
  
    useEffect(() => {
      if(user.name){
        const handle = setTimeout(() => {
          const orderFilter = order.orderItems.map((item) => {
            if(order.orderItemsSelected.includes(item)){
              return {...item , isSelected : true}
            }
            return {...item , isSelected : false}
          })
          mutationUpdateOU.mutate({...order , orderItems: orderFilter})
        }, [1500])
        return () => {
          clearTimeout(handle)
        }
      }
    },[order.orderItems , order.orderItemsSelected])
  

    useEffect(() => {
      const { storageData, decoded } = handleDecoded();
      console.log(decoded)
      if (decoded?.payload?._id) {
        handleGetDetailsUser(storageData)
      }else{
        console.log(decoded?.payload?.payload?._id)
      }
    },[])

    const handleDecoded = () => {
      let storageData = user?.accessToken || localStorage.getItem('accessToken');
      let decoded = {}
      if(storageData){
        console.log(storageData)
        decoded = jwt_decode(storageData);
      }
      return { decoded, storageData }
    }

    const handleGetDetailsUser = async (token) => {
      const res = await userService.getDetailsUser(token);
      console.log(res);
      dispatch(updateUser({...res?.data, accessToken: token}))
    }

    // check access token is expried or not ?
    axios.interceptors.request.use(async function (config) {
      // Do something before request is sent , it is the same middleware in BE     
      if(config.headers?.authorization){
        const currentTime = new Date()
        const { decoded } = handleDecoded()
        if (decoded?.exp < currentTime.getTime() / 1000) {
          console.log(decoded?.exp)
          const response = await userService.refreshToken();
          if(response.status === 'ERR'){
            toast.error(response.message, toastMSGObject());
            navigate('/');
            localStorage.clear('accessToken');
            dispatch(resetUser());
            dispatch(resetOrder());
          }else{
            console.log('accessToken mới : ',response.accessToken)
            localStorage.setItem('accessToken',response.accessToken)
          }
          config.headers['authorization'] = `Bearer ${response.accessToken}`
        }
      }
      return config;
    }, function (error) {
      // Do something with request error
      return Promise.reject(error);
    });

    // const getRouteChildren = (path) => {
    //   if(path.includes('/customer/view-detail')){
    //     return <Route path=':id' element={<DetailsOrderPage/>} />
    //   }
    //   return null
    // }

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
