const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = function (app, db) {

    function verifyToken(req, res, next) {

        const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
        console.log(token);

        // console.log(req.headers.authorization);

        if (!req.headers.authorization || !token) {
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

            res.json({
                token,
                user
            });
        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    })


    app.post('/api/register', async function (req, res) {

        try {
            const { username, password } = req.body;
            bcrypt.hash(password, saltRounds).then(async function (hash) {
                // Store hash in your password DB.
                // console.log(hash);
                await db.none(`insert into love_user (username, password, love_count) values ($1, $2, $3)`, [username, hash, 0])
            });

        }
        catch (err) {
            console.log(err);
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

    app.post('/api/loveCounter'), verifyToken, async function (req, res) {

        // const loveCount
        await db.none('insert into love_user (love_count) values ($1) where username = $2', [loveCount])



    }

    // app.get('/logout', (req, res) => {
    //     req.session.destroy();
    //     res.redirect('/');
    // });


}
