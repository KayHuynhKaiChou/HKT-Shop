import { useEffect, useState } from "react";
import { TypePro, WrapperTypesProduct } from "./style"
import * as productService from '../../services/ProductService'
import { useNavigate } from "react-router-dom";

export default function TypeProductComponent() {

    const [typesProduct , setTypesProduct] = useState([])
    const navigate = useNavigate();
    
    useEffect(() => {
      productService.getAllTypeProduct().then(res => setTypesProduct(res?.data));
    },[typesProduct?.length]) 

    return (
      <WrapperTypesProduct>
        {typesProduct?.map((type,i) => {
          return (
              <TypePro onClick={() => navigate(`/product/${type.normalize('NFD').replace(/[\u0300-\u036f]/g, '')?.replace(/ /g, '_')}`, {state: type})} key={i}>{type}</TypePro>
          )
        })}
      </WrapperTypesProduct>
    )
}
