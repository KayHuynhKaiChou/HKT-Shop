import HomePage from "../pages/HomePage/HomePage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import OrderPage from "../pages/OrderPage/OrderPage";
import ProductsPage from "../pages/ProductsPage/ProductsPage";
import TypeProductPage from "../pages/TypeProductPage/TypeProductPage";
import PaymentPage from "../pages/PaymentPage/PaymentPage";
import ProductDetailsPage from "../pages/ProductDetailsPage/ProductDetailsPage";
import AdminPage from "../pages/AdminPage/AdminPage";
import OrderSuccessPage from "../pages/OrderSuccessPage/OrderSuccessPage";
import CustomerPage from "../pages/CustomerPage/CustomerPage";
import VoucherPage from "../pages/VoucherPage/VoucherPage";

export const routes = [
    {
        path: '/',
        page: HomePage,
        isShowHeader : true
    },
    {
        path: '/cart',
        page: OrderPage,
        isShowHeader : true
    },
    {
        path: '/cart/payment',
        page: PaymentPage,
        isShowHeader : false
    },
    {
        path: '/cart/payment/success',
        page: OrderSuccessPage,
        isShowHeader : false
    },
    {
        path: '/products',
        page: ProductsPage,
        isShowHeader : true
    },
    {
        path: '/product/:type',
        page: TypeProductPage,
        isShowHeader : true
    },
    {
        path: '/product-details/:type/:id',
        page: ProductDetailsPage,
        isShowHeader : false
    },
    {
        path: '/customer/:menu',
        page: CustomerPage,
        isShowHeader : true,
    },
    {
        path: '/voucher',
        page: VoucherPage,
        isShowHeader : true,
    },
    {
        path: '/system/admin',
        page: AdminPage,
        isShowHeader: false,
        // isPrivated: true
    },
    {
        path: '*',
        page: NotFoundPage,
        isShowHeader : false
    },
]