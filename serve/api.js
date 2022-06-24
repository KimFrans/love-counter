const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = function (app, db) {

    function verifyToken(req, res, next) {

        const token = req.headers.authorization && req.headers.authorization.split(" ")[1] || req.body.token;
        console.log(!token);

        // console.log(req.headers.authorization);

        if ( !token) {
            res.sendStatus(401);
            return;
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const { username } = decoded;

        // console.log(username);

        if (username && username) {
            next();
        } else {
            res.sendStatus(403);
        }

    }


    async function getUserByUsername(username) {
        return await db.oneOrNone('select * from love_user where username = $1', [username])
    }

    app.post('/api/updateCount', verifyToken, async (req, res)=> {

        const { username } = req.body

        const user = await getUserByUsername(username);

        (user.love_count > 0) 
        ?  await db.none('update love_user set love_count = love_count - 1 where username = $1', [username])
        : null


    })


    app.post('/api/login', async function (req, res) {

        try {
            const { username, password } = req.body;
            const user = await db.one('select * from love_user where username = $1', [username])
            const decrypt = await bcrypt.compare(password, user.password); // return boolean

            if (!decrypt) {
                throw new Error("Wrong password or username")
            }

            const token = jwt.sign({
                username
            }, process.env.ACCESS_TOKEN_SECRET);

           const hearts = await getHearts(username)
           console.log({hearts});
            res.json({
                token,
                user:{
                    ...user,
                    password: null
                },
                hearts
            });
        } catch (error) {
            res.json({
                message: error.message
            })

            // res.status(500).json({
            //     message: error.message
            // })
        }
    })


    app.post('/api/register', async function (req, res) {

        try {
            const { username, password } = req.body;
            const check = await db.oneOrNone('select username from love_user where username = $1', [username])
            // console.log(check.length);
            let success = ''

            if (check == null) {

                bcrypt.hash(password, saltRounds).then(async function (hash) {
                    await db.none(`insert into love_user (username, password, love_count) values ($1, $2, $3)`, [username, hash, 0])
                    // Store hash in your password DB.
                    // console.log(hash);
                });
                success = 'successfully registered'
            }
            else {
                throw new Error("User already exists")
            }
            res.json({
                message: success
            });
        }
        catch (err) {
            // console.log(err);
            res.json({
                message: err.message

            })
        }
    });

    app.post('/api/token/', async function (req, res) {
        const { username } = req.body;
        console.log(req.body)
        // console.log(username);

        const token = jwt.sign({
            username
        }, process.env.ACCESS_TOKEN_SECRET);

        // console.log(token);

        res.json({
            token
        });


    });

    app.post('/api/loveCounter', verifyToken, async function (req, res) {

        try {
            const { loveCount, username } = req.body
            // const { loveCount, username } = req.query
    
            await db.none('update love_user set love_count = love_count +1 where username = $1', [username])

            const hearts = await getHearts(username)

            res.json({
                hearts
            })


        } catch (error) {
            console.log(error);
            res.json({
                message: error.message

            })
        }

    })

    /**
     * 
     * @param {String} username 
     * @returns {String} hearts
     */
    async function getHearts(username) {
        const loveCounter = await db.one('select love_count from love_user where username = $1', [username], (r) => r.love_count)

        if (loveCounter <= 0) {
            return "💔"
        }
        if (loveCounter > 0 && loveCounter <= 5) {
            return "💚"
        } 
        else if (loveCounter <= 10) {
            return "💚💚";
        } 
        else {
            return "💚💚💚";
        }


    }



}
