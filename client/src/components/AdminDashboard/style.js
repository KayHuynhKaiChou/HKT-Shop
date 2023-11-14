import styled from "styled-components";

export const WrapperStatistic = styled.div`
    display: flex;
    margin: 10px 0;
    gap: 10px;

    .statistic{
        color: #fff;
        padding : 10px;
        background : green;
        border-radius : 10px;
        width: 25%;
        display: flex;
        justify-content: space-between;

        .statis-content{

            .sta-label{
                font-size: 18px;
                font-weight: 500;
            }
    
            .sta-value{
                font-size: 30px;
            }
    
            .sta-note{
                font-size: 14px;
            }
        }
    
        span{
            font-size: 70px;
            display: flex;
            align-items: center;
        }
    }

    .design-product{
        background-image: linear-gradient(45deg, #ff8400, #eda87f);
    }

    .design-order{
        background-image: linear-gradient(45deg, #fae704, #eda87f);
    }

    .design-customer{
        background-image: linear-gradient(45deg, #30da74, #5cc825);
    }

    .design-money{
        background-image: linear-gradient(45deg, #00702d, #e4ff00);
    }
`

export const WrapperChart = styled.div`
    width : 95%;
    height : 500px;
    margin-top : 10px;

    .chart-title{
        text-align: center;
        padding: 10px;
        font-size: 22px;
        font-weight: bold;
    }
`