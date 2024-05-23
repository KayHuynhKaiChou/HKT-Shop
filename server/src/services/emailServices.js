import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer'
import { convertDateAndTime, convertPrice } from '../utils/util.js';

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_ACCOUNT, // generated ethereal user
    pass: process.env.MAIL_PASSWORD, // generated ethereal password
  },
});

const generateOTP = () => {
    return Math.floor(Math.random() * (999999 - 100000 + 1) + 100000)
}

const sendEmailCreateOrder = async (email,order) => {
  
    let listItem = order.orderItems.map((item) => {
        return`
            <tr>
                <td>
                    <div class="product-item">
                        <img src=${item.image} alt="" />
                        <div class="product-name">${item.name}</div>
                    </div>
                </td>
                <td>${item.price}</td>
                <td>${item.amount}</td>
                <td>${item.price * item.discount / 100}</td>
                <td>${item.price - (item.price * item.discount / 100)}</td>
            </tr>
        `
    })
  
    // send mail with defined transport object
    await transporter.sendMail({
      from: process.env.MAIL_ACCOUNT, // sender address
      to: email, // list of receivers
      subject: "Cảm ơn bạn đã đặt hàng tại HKT SHOP", // Subject line
      text: "Hello world?", // plain text body
      html: `
        <!doctype html>
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>HKT Shop</title>
                <style>
                    .code-order{
                        font-size: 19px;
                        font-weight: 300;
                    }

                    .date-created{
                        align-self :flex-end;
                        font-size: 13px;
                        color: rgb(36, 36, 36);
                        line-height: 1.5;
                    }

                    table{
                        width: 100%;
                        color: rgb(66, 66, 66);
                        display: table;
                        font-size: 13px;
                        background: rgb(255, 255, 255);
                        border-radius: 4px;
                        border-collapse: collapse;
                        border-spacing: 0px;
                        line-height: 1.5;
                        word-break: break-word;
                    }

                    th{
                        display: table-cell;
                        padding: 20px 15px;
                        border-top: none;
                        min-width: 100px;
                        position: relative;
                        background: 0px 0px;
                        color: rgb(120, 120, 120);
                        font-size: 15px;
                        font-weight: 400;
                        border-bottom: 1px solid rgb(244, 244, 244);
                        text-align: left;
                    }
                
                    th:first-child {
                        border-left: none;
                    }
                
                    th:last-child {
                        text-align: right;
                    }

                    tbody tr{
                        border-bottom: 1px solid rgb(244, 244, 244);
                    }

                    tbody tr td:last-child{
                        text-align: right;
                    }
        
                    tbody tr td{
                        
                        display: table-cell;
                        padding: 20px 15px;
                        color: rgb(36, 36, 36);
                        vertical-align: top;
                        min-width: 100px;
                    }
                    .product-item{
                        display: flex;
                    }
                    .product-item img{
                        width: 60px;
                        height: 60px;
                        margin-right: 15px;
                    }
        
                    .product-name{
                        max-width: 340px;
                        font-size: 14px;
                        color: rgb(36, 36, 36);
                    }

                    tfoot tr td{
                        text-align: right;
                        display: table-cell;
                        padding: 10px 20px;
                        color: rgb(36, 36, 36);
                    }

                    tfoot tr td .sum{
                        color: rgb(255, 59, 39);
                        font-size: 18px;
                        display: block;
                    }

                    tfoot tr td span{
                        color: rgb(120, 120, 120);
                        font-size: 14px;
                    }

                    tfoot tr td button{
                        border: none;
                        background: #ffd54c;
                    }

                    tfoot tr td button span{
                        color: black !important;
                    }
                </style>
            </head>
            <body>
                <div class="header-order">
                    <div class="code-order">Chi tiết đơn hàng #${order.codeOrder}</div>
                    <div class="date-created">Ngày đặt hàng : ${convertDateAndTime(order.createdAt).time} ${convertDateAndTime(order.createdAt).date}</div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Sản phẩm</th>
                            <th>Giá</th>
                            <th>Số lượng</th>
                            <th>Giảm giá</th>
                            <th>Tạm tính</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${listItem}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="4">
                                <span>Tạm tính</span>
                            </td>
                            <td>${convertPrice(order.itemsPrice)}</td>
                        </tr>
                        <tr>
                            <td colSpan="4">
                                <span>Phí vận chuyển</span>
                            </td>
                            <td>${convertPrice(order.shippingPrice)}</td>
                        </tr>
                        <tr>
                            <td colSpan="4">
                                <span>Tổng cộng</span>
                            </td>
                            <td>
                                <span class="sum">${convertPrice(order.totalPrice)}</span>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </body>
        </html>
      `,
    });
}

const sendEmailToVerify = async (email) => {
    const otp = generateOTP();
    await transporter.sendMail({
        from: process.env.MAIL_ACCOUNT, // sender address
        to: email, // list of receivers
        subject: "Xác thực email "+email, // Subject line
        text: "Hello world?", // plain text body
        html: `
            <div style={text-align:"center"}>
                <h2>OTP XÁC THỰC EMAIL</h2>
                Mã OTP của bạn : <b>${otp}</b>
            </div>
        `
    })
    return otp;
}

export {sendEmailCreateOrder , sendEmailToVerify}