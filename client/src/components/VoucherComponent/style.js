import styled from "styled-components";

export const WrapperVoucherComponent = styled.div`
    display: flex;
    background: #fff;
    display: flex;
    filter: drop-shadow(0 0 6px rgba(0,0,0,.09));
    background-clip: content-box;
    height: 100%;
    border-radius: 5px;
`

export const WrapperVoucherImage = styled.div`
    position: relative;
    display: flex;
    flex: 1;
    
    .sYRxe3 path {
        fill: rgb(26, 148, 255); /* Đổi màu fill thành màu đỏ (#FF0000) */
    }

    > svg{
        position: absolute;
        top: 0;
        z-index: -1;
    }

    .voucher-title{
        margin: auto;
        color: #fff;
        text-align: center;
        font-size: ${props => props.percentFontSize*20/100 + 'px' || '20px'};
    }
`

export const WrapperVoucherContent = styled.div`
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    .name{
        padding-left: 20px;
        font-weight: 700;
        font-size: ${props => props.percentFontSize*24/100 + 'px' || '24px'};
        line-height: 32px;
    }
    .condition{
        padding: 0 20px;
        font-size: ${props => props.percentFontSize*18/100 + 'px' || '18px'};
        line-height: 20px;
        margin-top: 4px;
    }
    .condition::first-letter{
        text-transform: uppercase;
    }
    .expired-date{
        margin-top: 4px;
        padding: 0 20px;
        color: rgb(117, 117, 117);
    }
`

export const WrapperVoucherAction = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .use-act{
        display: flex;
        justify-content: center;
        color: rgb(11, 116, 229);
        cursor: pointer;

        span{
            font-size: 14px;
            margin: 3px 0 0 5px;
        }
    }
    
    .btn-unaction{
        opacity: 0.8;
        background: gray;
        cursor: no-drop;
    }

    .btn-action{
        position: relative;
    }

    .btn-action:hover{
        >div,>span{
            transform: translateY(-50px);
        }
    }

    .btn-action>div , .btn-action>span{
        transition: all 0.1s linear;
    }

    .btn-action>span{
        position: absolute;
        top: 60px;
        left: 28px;
        pointer-events: none;
    }

    button{
        background: rgb(26, 148, 255);
        color: #fff;
        font-size: ${props => props.percentFontSize*18/100 + 'px' || '18px'};
        padding: 10px 15px;
        margin: 0 10px;
    }
`