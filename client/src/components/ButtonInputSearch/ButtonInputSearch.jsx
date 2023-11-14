/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { useState } from "react";


export default function ButtonInputSearch(props) {
    const {
        size , 
        placeholder, 
        textButton,
        bordered , backgroundColorInput = "#fff",
        backgroundColorButton = 'rgb(13, 92, 182)',
        colorButton = "#fff", borderRadius = 0
    } = props;

    return (
        <div style={{display:"flex"}}>
            <Input 
                size={size}
                placeholder={placeholder} 
                style={{ backgroundColor: backgroundColorInput, border: !bordered && 'none', borderRadius }}
                {...props}
            />
            <Button         
                size={size} 
                icon={<SearchOutlined/>}
                style={{ backgroundColor: backgroundColorButton, border: !bordered && 'none', borderRadius }}
                color={colorButton}
            >{textButton}</Button>
        </div>
    )
}
