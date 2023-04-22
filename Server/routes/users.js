const router = require("express").Router();
const User = require("../models/User")
const verify = require("../middleware/verify")
const CryptoJS = require("crypto-js")

//UPDATE
router.put("/:id", verify, async(req, res) => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
        if (req.body.password) {
            req.body.password = CryptoJS.AES.encrypt(
              req.body.username,
              process.env.SECRET_KEY
            ).toString();
        }

        try {
            const updateUser = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
            res.status(200).json(updateUser)
        } catch (error) {
            res.status(500).json(error)
        }
    }
    else {
        res.status(403).json("You can only Update your Account!")
    }
})

module.exports = router