import {HomeOutlined, RightOutlined} from '@ant-design/icons'
import { WrapperPathProduct } from './style'
import { useNavigate } from 'react-router-dom'
import { convertUTF8toUnicode } from '../../utils/utils';

export default function PathProductComponent(props) {
    const navigate = useNavigate();
    const { typePro = '' , namePro = '' } = props;
    const typeFormat = convertUTF8toUnicode(typePro).split(' ').join('-')

    return (
        <WrapperPathProduct>
            <div className="path link-active" onClick={() => navigate('/')}>
                <HomeOutlined />
                Trang chủ
            </div>
            <RightOutlined /> 
            <div className="path link-active" onClick={() => navigate(`/product/${typeFormat}`,{state : typePro})}>{typePro}</div>
            {namePro && <RightOutlined/>}
            {namePro && <div className="path">{namePro}</div>}
        </WrapperPathProduct>
    )
}
