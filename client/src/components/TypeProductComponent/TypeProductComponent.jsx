import { useEffect, useState } from "react";
import { TypePro, WrapperTypesProduct } from "./style"
import * as productService from '../../services/ProductService'
import { useNavigate } from "react-router-dom";
import { convertUTF8toUnicode } from "../../utils/utils";

export default function TypeProductComponent() {

    const [typesProduct , setTypesProduct] = useState([])
    const navigate = useNavigate();
    
    useEffect(() => {
      productService.getAllTypeProduct().then(res => setTypesProduct(res?.data));
    },[typesProduct?.length]) 

    return (
      <WrapperTypesProduct>
        {typesProduct?.map((type,i) => {
          const typeFormat = convertUTF8toUnicode(type).split(' ').join('-');
          return (
            <TypePro onClick={() => navigate(`/product/${typeFormat}`, {state: type})} key={i}>{type}</TypePro>
          )
        })}
      </WrapperTypesProduct>
    )
}
