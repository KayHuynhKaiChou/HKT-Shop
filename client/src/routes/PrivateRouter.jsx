import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { toastMSGObject } from '../utils/utils';
import { Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export default function PrivateRouter({children}) {
    const user = useSelector((state) => state.user);
    const location = useLocation();

    // vì ở home page phải load product và type product nên render lại nhiều lần
    // do đó toast sẽ hiển thị lại nhiều lần và useEffect dưới đây là cách khắc phục
    useEffect(() => {
        if(user.name){
            if(location.pathname === '/system/admin' && !user.isAdmin){
                toast.error('Bạn ko có quyền hạn để truy cập vào url : /system/admin ', toastMSGObject({}));
                return;
            }
        }else{
            toast.error('Vui lòng đăng nhập để xác thực', toastMSGObject({}))
        }
    },[])

    if(user.name){
        return children
    }else{
        return <Navigate to={'/'}/>
    }
}
