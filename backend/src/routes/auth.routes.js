import express from "express";
const router = express.Router();

router.post('/register/merchant', (req, res) => {
    const body = req.body;
    console.log(body)

    res.send()
})

export default router;