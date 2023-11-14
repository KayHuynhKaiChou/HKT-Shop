import { downloadExcel } from "react-export-table-to-excel";
import {toast} from "react-toastify"

export const isJsonString = (data) => {
    try {
        JSON.parse(data)
    } catch (error) {
        return false
    }
    return true
}

export async function getListProvincesCity(){
  const res = await fetch(`https://vapi.vnappmob.com/api/province/`,{
      method : "GET",
      headers : {
          'Content-Type' : 'Application/json'
      }
  })

  const { results } = await res.json();
  return results
}

export async function getListDistricts(provinceId){
  const res = await fetch(`https://vapi.vnappmob.com/api/province/district/${provinceId}`,{
      method : "GET",
      headers : {
          'Content-Type' : 'Application/json'
      }
  })

  const { results } = await res.json();
  return results
}

export async function getListWards(districtId){
  const res = await fetch(`https://vapi.vnappmob.com/api/province/ward/${districtId}`,{
      method : "GET",
      headers : {
          'Content-Type' : 'Application/json'
      }
  })

  const { results } = await res.json();
  return results
}

export const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

export function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}

export const convertPrice = (price) => {
    try {
        const result  = price?.toLocaleString().replaceAll(',', '.')
        return `${result} ₫`
    } catch (error) {
        return null
    }
}

export const convertDateAndTime = (isoDateString, num = 0) => {
    const date = new Date(isoDateString);

    const year = date.getFullYear(); // Lấy năm
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Lấy tháng (lưu ý rằng tháng bắt đầu từ 0)
    const day = (date.getDate()+num).toString().padStart(2, '0'); // Lấy ngày 
    const hours = date.getHours(); // Lấy giờ
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Lấy phút
    //const seconds = date.getSeconds(); // Lấy giây
    //const milliseconds = date.getMilliseconds(); // Lấy mili giây

    return {
        date : `${day}-${month}-${year}`,
        time: `${hours}:${minutes}`
    }
}

export const listProvinces = async () => {
    const res = await fetch('https://raw.githubusercontent.com/madnh/hanhchinhvn/master/dist/tinh_tp.json')
    return await res.json();
}

export const initFacebookSDK = () => {
    if (window.FB) {
      window.FB.XFBML.parse();
    }
    let locale = "vi_VN";
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: 3765261720358706,// You App ID
        cookie: true, // enable cookies to allow the server to access
        // the session
        xfbml: true, // parse social plugins on this page
        version: "v2.1" // use version 2.1
      });
    };
    // Load the SDK asynchronously
    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = `//connect.facebook.net/${locale}/sdk.js`;
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
}


export const exportExcel = (columns , dataTable , fileName) => {
  console.log(columns);
  console.log(dataTable);
    downloadExcel({
      fileName,
      sheet: "react-export-table-to-excel",
      tablePayload: {
        header : columns,
        // accept two different data structures
        body: dataTable,
      },
    });
  }

export const toastMSGObject = ({
    position = "top-right",
    autoClose = 2000,
    hideProgressBar = false,
    closeOnClick = true,
    pauseOnHover = true,
    draggable = true,
    progress = undefined,
    theme = "colored",
}) => ({
  position,
  autoClose,
  hideProgressBar,
  closeOnClick,
  pauseOnHover,
  draggable,
  progress,
  theme
})

export const isExpiredVoucher = (expiredDate) => {
  return new Date(expiredDate) < new Date()
}

export const handleChangeAmountBuy = (action , amountChange , amountRemain ) => {
  console.log(amountChange)
  if(amountChange){
    switch (action) {
        case 'INCREASE':
            if(amountRemain < amountChange){
              toast.error(`Sản phẩm này chỉ còn lại ${amountRemain} cái`)
            }else{
              return (amountChange);
            }
            break;
        case 'DECREASE':           
            return (amountChange);            
        case 'INPUT':
            if(amountRemain < amountChange){
              toast.error(`Sản phẩm này chỉ còn lại ${amountRemain} cái`)
            }else if(amountChange >=1 && amountChange <=999){
              return (amountChange);
            }else{
              return (+(amountChange+'').slice(0,-1));
            }
            break;
        default:
            break;
    }
  }else{
    return 1;
  }
}

export function calculatePriceFinal ( firstPrice , discount ) {
  return discount === 0 ? firstPrice : firstPrice - (firstPrice * discount) / 100
}