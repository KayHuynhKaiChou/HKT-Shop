export const convertPrice = (price) => {
    try {
        const result  = price?.toLocaleString().replaceAll(',', '.')
        return `${result} ₫`
    } catch (error) {
        return null
    }
}

export const convertDateAndTime = (isoDateString, num = 0) => {
    const date = new Date(isoDateString);

    const year = date.getFullYear(); // Lấy năm
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Lấy tháng (lưu ý rằng tháng bắt đầu từ 0)
    const day = (date.getDate()+num).toString().padStart(2, '0'); // Lấy ngày 
    const hours = date.getHours(); // Lấy giờ
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Lấy phút
    //const seconds = date.getSeconds(); // Lấy giây
    //const milliseconds = date.getMilliseconds(); // Lấy mili giây

    return {
        date : `${day}-${month}-${year}`,
        time: `${hours}:${minutes}`
    }
}