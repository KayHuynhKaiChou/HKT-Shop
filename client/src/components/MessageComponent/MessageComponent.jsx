import { message } from "antd";

const success = (mes = 'Success') => {
    //message.success(mes);
    message.open({
        type: 'success',
        content: <span style={{color: '#52c41a'}}>{mes}</span>,
    })
};

const error = (mes = 'Error') => {
    //message.error(mes);
    message.open({
        type: 'error',
        content: <span style={{color: 'red'}}>{mes}</span>
    })
};

const warning = (mes = 'Warning') => {
    //message.warning(mes);
    message.open({
        type: 'warning',
        content: <span style={{color: '#ffcc00'}}>{mes}</span>,
    })
};

export { success, error, warning }