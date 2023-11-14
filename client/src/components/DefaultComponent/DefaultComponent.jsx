
import { ToastContainer } from 'react-toastify'
import HeaderComponent from '../HeaderComponent/HeaderComponent'
import 'react-toastify/dist/ReactToastify.css';

export default function DefaultComponent({children}) {
  return (
    <>
        <ToastContainer/>
        <HeaderComponent />
        {children}
    </>
  )
}
