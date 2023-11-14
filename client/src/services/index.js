export const config = {
    headers : {
        authorization : `Bearer ${localStorage.getItem('accessToken')}`
    },
    withCredentials : true
}