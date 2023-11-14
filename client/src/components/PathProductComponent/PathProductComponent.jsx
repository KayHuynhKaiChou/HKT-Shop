import {HomeOutlined, RightOutlined} from '@ant-design/icons'
import { WrapperPathProduct } from './style'
import { useNavigate } from 'react-router-dom'

export default function PathProductComponent(props) {
    const navigate = useNavigate();
    // eslint-disable-next-line react/prop-types
    const { typePro = '' , namePro = '' } = props

    return (
        <WrapperPathProduct>
            <div className="path link-active" onClick={() => navigate('/')}>
                <HomeOutlined />
                Trang chủ
            </div>
            <RightOutlined /> 
            <div className="path link-active" onClick={() => navigate(`/product/${typePro.normalize('NFD').replace(/[\u0300-\u036f]/g, '')?.replace(/ /g, '_')}`,{state : typePro})}>{typePro}</div>
            {namePro && <RightOutlined/>}
            {namePro && <div className="path">{namePro}</div>}
        </WrapperPathProduct>
    )
}
