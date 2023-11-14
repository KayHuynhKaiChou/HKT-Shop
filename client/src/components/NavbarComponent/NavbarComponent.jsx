import { useEffect, useState } from "react";
import { WrapperLabelText, WrapperNavbarLeft, WrapperValueText } from "./style";
import * as productService from '../../services/ProductService'
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function NavbarComponent() {
    const typesProduct = useSelector(state => state?.product?.typesProduct);
    const navigate = useNavigate();

    // useNavigate() thì component tương ứng sẽ KHÔNG unmouted khỏi DOM ; 
    // <Navigate /> thì component tương ứng sẽ bị unmouted khỏi DOM

    const renderContent = (type, options) => {
        switch (type) {
            case "Danh mục sản phẩm":
                return options.map((type,i) => (
                  <WrapperValueText onClick={() => navigate(`/product/${type?.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '')?.replace(/ /g, '_')}` , {state : type?.name})} key={i}>{type?.name}</WrapperValueText>
                ));        
            default:
                break;
        }
    }

    return (
      <WrapperNavbarLeft>
        <WrapperLabelText>Danh mục sản phẩm</WrapperLabelText>
        <div>
          {renderContent('Danh mục sản phẩm',typesProduct)}
        </div>
      </WrapperNavbarLeft>
    )
}
