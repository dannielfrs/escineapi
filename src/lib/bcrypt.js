const bcrypt = require('bcryptjs');

const useBcrypt = {};

useBcrypt.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);     // Generate pattern
    const hash = await bcrypt.hash(password, salt);  // Generate encrypted password
    return hash;
};

useBcrypt.matchPassword = async (password, savedPassword) => {   // Compare password stored in database
    try {
        return await bcrypt.compare(password, savedPassword);
    } catch (error) {
        console.log(error);
    }
};

module.exports = useBcrypt;