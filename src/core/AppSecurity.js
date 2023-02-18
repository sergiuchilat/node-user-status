require('dotenv').config()
class AppSecurity {
    checkAccess(key, level = '') {
        if (level === 'SYSTEM') {
            if(process.env.ACCESS_KEY_SYSTEM !== key){
                throw Error('access-denied')
            }
        }else if(process.env.ACCESS_KEY !== key){
            throw Error('access-denied')
        }
    }
}

module.exports = new AppSecurity()