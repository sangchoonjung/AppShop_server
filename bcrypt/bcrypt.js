const bcrypt = require("bcrypt")


class Encode {
    async hash(plain){
        const result = await bcrypt.hash(plain,10)
        return result;
    }
    async check(plain,hash){
        const result = await bcrypt.compare(plain,hash);
        return result
    }
}


module.exports = new Encode();
