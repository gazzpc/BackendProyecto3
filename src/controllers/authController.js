const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

const  User = require('../models/userModel');
const { generateJWT } = require('../helpers/generateToken');

const login = async (req = request, res = response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res
        .status(400)
        .json( {msg: 'User / password incorrecto (email)'} );
    }
    if (!user.status) {
        return res
        .status(400)
        .json( {msg: 'User / password incorrecto (status)'} );
    }

    const validPassword = bcryptjs.compareSync(password, user.password);

    if (!validPassword) {
        return res
        .status(400)
        .json( {msg: 'User / password incorrecto (password)'} )
    }

    const token = await generateJWT(user.id)
    res.json( {msg: 'Login ok', user, token } );
}

module.exports =  login ; 