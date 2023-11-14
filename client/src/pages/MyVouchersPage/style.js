import styled from "styled-components";

export const WrapperEmptyVoucher = styled.div`
    height: 90vh;
    display: flex;
    
    .vou-emp-cover{
        margin: auto;
        text-align: center;

        .content-main{
            margin: 40px 0 10px 0;
        }

        .content-support{
            color: rgba(0,0,0,.54);
            font-size: 14px;
            margin-bottom: 10px;
        }

        button{
            background: rgb(26, 148, 255);
            color: #fff;

            &:hover{
                opacity: 0.9;
            }
        }
    }
        
`