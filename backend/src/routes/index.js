const {Router} = require('express');
const router = Router();

const User = require('../model/User');

const jwt = require('jsonwebtoken');
router.get('/', (req, res) => res.send('hello world'))

router.post('/signup', async(req, res) => {

    const {email, password}= req.body;
    const newUser = new User({email, password});
    await newUser.save();

   const token = jwt.sign({_id: newUser._id}, 'secretkey')
    res.status(200).json({token})
    
})

router.post('/signin', async (req, res) =>{

    const {email, password} = req.body;
    const user = await User.findOne({email})
    if (!user) return res.status(401).send("the mail doesn´t exists");
    if (user.password !== password) return res.status(401).send('wrong password');

   const token = jwt.sign({_id: user._id}, 'secretkey');
   return res.status(200).json({token});
}) ;

router.get('/tasks', (req,res)=>{
    res.json([
        {
            _id:1,
            name: "Task one",
            description: "lo que sea",
            date:"2019-12-20T20:39:05.2112"
        },
        {
            _id:2,
            name: "Task two",
            description: "lo que sea",
            date:"2019-12-20T20:39:05.2112"
        },
        {
            _id:3,
            name: "Task three",
            description: "lo que sea",
            date:"2019-12-20T20:39:05.2112"
        }
    ])
});

router.get('/private-tasks', verifyToken,  (req, res) =>{
    res.json([
        {
            _id:1,
            name: "Task one",
            description: "lo que sea",
            date:"2019-12-20T20:39:05.2112"
        },
        {
            _id:2,
            name: "Task two",
            description: "lo que sea",
            date:"2019-12-20T20:39:05.2112"
        },
        {
            _id:3,
            name: "Task three",
            description: "lo que sea",
            date:"2019-12-20T20:39:05.2112"
        }

    ])
});


router.get('/profile', verifyToken, (req, res) => {
    res.send(req.userId);
})

async function verifyToken(req, res, next) {
	try {
		if (!req.headers.authorization) {
			return res.status(401).send('Unauhtorized Request');
		}
		let token = req.headers.authorization.split(' ')[1];
		if (token === 'null') {
			return res.status(401).send('Unauhtorized Request');
		}

		const payload = await jwt.verify(token, 'secretkey');
		if (!payload) {
			return res.status(401).send('Unauhtorized Request');
		}
		req.userId = payload._id;
		next();
	} catch(e) {
		//console.log(e)
		return res.status(401).send('Unauhtorized Request');
	}
}

module.exports = router;




