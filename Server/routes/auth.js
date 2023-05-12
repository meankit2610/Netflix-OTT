const router = require("express").Router()
const User = require("../models/User")  
var CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken")
//REGISTER
router.post('/register',async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString()
    });

    try {
        const user = await newUser.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json(err)
    }
    
});

//LOGIN
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(401).json("Wrong Password or username!")

        const bytes = CryptoJS.AES.decrypt(
          user.password,
          process.env.SECRET_KEY
        );
        const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
        originalPassword !== req.body.password &&
            res.status(401).json("Wrong Password or username!-2");
        
        const accessToken = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.SECRET_KEY,
            {expiresIn:"5d"}
        )
        
        const{password, ...info} = user._doc
        
        res.status(200).json({...info,accessToken})
    } catch (err) {
        res.status(500).json("error")
    }
})

module.exports = router;




//test token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NWNhNDdhNzk5NmExMzViN2ZiMTQ0ZCIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE2ODM3OTMzMzEsImV4cCI6MTY4NDIyNTMzMX0.WLeiafJ5QcAVKweWIgLg0LMOgQdyrv-0b9Xu9tydGQE
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NDk3NWQwMjY2M2E3NjUwZmQxZGRiZSIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY4MzgyODcwNiwiZXhwIjoxNjg0MjYwNzA2fQ.Nac9og51Gzm4FVXVD2_l0gRvS5SYsk-mnJWrY_IiBNg