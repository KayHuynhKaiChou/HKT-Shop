import { AiFillDelete, AiOutlineCheckCircle, AiTwotoneEdit } from 'react-icons/ai'
import { useLocation } from 'react-router-dom'
import { Button } from 'antd'

export default function AddressShipItem(props) {

    const {
        id,
        fullName,
        phone,
        province,
        district,
        ward,
        addressDetail,
        type,
        default : isDefault,
        handleDeleteAddressShip,
        handleShowDetailAddressShip,
        setAddressShipSelect
    } = props
    const location = useLocation();
    const renderBtn = () => {
        if(location.pathname === '/cart/payment'){
            return (
                <Button 
                    type='primary' 
                    className={isDefault ? `btn-address__default` : `btn-address`}
                    onClick={() => setAddressShipSelect && setAddressShipSelect({
                        _id : id,
                        fullName,
                        phone,
                        province,
                        district,
                        ward,
                        addressDetail,
                        type,
                        default : isDefault
                    })}
                >
                    Giao đến địa chỉ này
                </Button>
            )
        }else{
            return(
                <>
                    <div className='act-edit' onClick={() => handleShowDetailAddressShip && handleShowDetailAddressShip({
                        id,
                        fullName,
                        phone,
                        province,
                        district,
                        ward,
                        addressDetail,
                        type,
                        default : isDefault
                    })}>
                        <AiTwotoneEdit />
                        Chỉnh sửa
                    </div>
                    {!isDefault && (
                        <div className='act-delete' onClick={() => handleDeleteAddressShip && handleDeleteAddressShip(id || 0)}>
                            <AiFillDelete />
                            Xóa
                        </div>
                    )}
                </>
            )
        }
    }

    return (
        <div 
            className="address-ship" 
            style={{ 
                display: location.pathname === '/cart/payment' ? 'block' : 'flex' ,
                border: isDefault ? '1px dashed rgb(38, 188, 78)' : '1px solid #c4c4c4'
            }}
        >
            <div className="info">
                <div className="name">
                    {fullName}
                    {isDefault && (
                        <span>
                            <AiOutlineCheckCircle />
                            <span className='ms-2'>Địa chỉ mặc định</span>
                        </span>
                    )}
                </div>
                <div className="address" style={{ marginBottom: 5 }}>
                    <span>Address: </span>
                    {`${addressDetail} , ${ward} , ${district.split('-')[0]} , ${province.split('-')[0]}`}
                </div>
                <div className="phone">
                    <span>Phone: </span>
                    {phone}
                </div>
            </div>
            <div className="action">
                {renderBtn()}
            </div>
        </div>
    )
}
