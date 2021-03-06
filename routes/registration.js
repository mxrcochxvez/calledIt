const router = require('express').Router();
const User = require('../models/User');
const { registerValidation, loginValidation } = require('../services/loginValidation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get('/login', (req, res) => {
    res.render('login');
})

router.post('/register', async (req, res) => {
    const { error } = registerValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    const emailExists = await User.findOne({
        email: req.body.email
    })

    if(emailExists) return res.status(400).send('Email already exists');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword
    })

    try {
        const savedUser = await user.save();
        res.send(savedUser._id);
    } catch (err) {
        res.status(400).send(err);
    }
})

router.post('/login', async (req, res) => {
    //VALIDATE
    const { error } = loginValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    //User Check
    const user = await User.findOne({ email: req.body.email });
    if(!user) return res.send('Email not associate with an account').redirect('/register');

    //Password check
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Check your password');

    //Create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.cookie('jwt', token).redirect('/events');
})


module.exports = router;