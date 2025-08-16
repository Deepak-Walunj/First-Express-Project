const doesExist = (username) => {
    let userWithSameName = users.filter((user) => {
        return user.username == username
    })
    if (userWithSameName.length>0){
        return true
    }else{
        return false
    }
}

module.exports = {
    doesExist,
}