import bcrypt from 'bcrypt';

async function createParent({ name, email }) {
    const randomPassword = generateRandomPassword();

    const passwordHash = await bcrypt.hash(randomPassword, 10);

    const user = await user.Model.create({
        user_id,
        name,
        email,
        password: passwordHash,
        role: 'PARENT',
        firstLogin: true
    });

    return {
        user,
        tempPassword: randomPassword
    }


}

module.exports = {
    createParent
}