import { Modal } from 'antd';
import MyVouchersPage from '../../pages/MyVouchersPage/MyVouchersPage';


export default function FormModalVoucher({isModalOpen , setIsModalOpen}) {
    
    return (
        <Modal width="560px" title={"HKT Shop khuyến mãi"} footer={null} open={isModalOpen} onCancel={() => setIsModalOpen(false)}>
            <MyVouchersPage isModalForm = {true}/>
        </Modal>
    )
}
