const handleErr = (res) => {
    res.status(400).json({
        status: 'false',
        message: '欄位錯誤或無此 Id'
    })
}
module.exports = handleErr