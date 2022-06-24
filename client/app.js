import axios from "axios";

export default function app() {
    const URL_BASE =  import.meta.env.VITE_SERVER_URL
    return {
        info_message: '',
        error: false,
        hearts: '',

        login: true,
        loginBtn: '',
        username: '',
        password: '',
        open: false,
        token: '',
        decoded: '',
        reg: false,
        usermessage: '',
        // show:false,
        hide: true,
        unauthorised: false,
        heading: true,
        hashPassword: '',
        loginLink: '',
        regLink: '',
        loggedInUser: {},
        logout: true,
        loveCounter: 0,

        updateCount(username) {
            if (username) {
                axios
                    .post(`${URL_BASE}/api/updateCount`, { username, token: localStorage.getItem('token') })
                    .catch(e => console.log(e.message))
            }

        },

        countUpdate: setInterval(() => {
                const user = this.getUser()

                if (user.love_count > 0) {
                    user.love_count--;
                }
                
                localStorage.setItem('user', JSON.stringify(user))
                this.loveCounter = user.love_count
                console.log(user)
                this.updateCount(user.username)


            }, 3000)
        ,


        init() {
            // first check token in localstorage 
            //  - set open to true
            // - set login to true
            if (localStorage['token'] === undefined) {
                this.open = false;
                this.login = true;
            } else {
                // this.countUpdate()
                this.open = true;
                this.login = false;
            }
            // this.updateCount()


        },


        register() {
            const { username, password } = this;
            if (this.username && this.password != '') {

                axios
                    .post(`${URL_BASE}/api/register`, { username, password })
                    .then(r => r.data)
                    .then(
                        r => {
                            // this.usermessage = 'Successfully registered',
                            this.usermessage = r.message,
                                this.reg = false,
                                this.login = true,
                                console.log(r.success);

                            // console.log('Successfully registered')
                            // console.log(this.username, this.password)

                        })
                setTimeout(() => {
                    this.usermessage = ''
                    // this.unauthorised = false
                }, 3000);

                axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
                this.username = ''
                this.password = ''


                // });
            }
            else {
                this.usermessage = 'Please enter a username!'
                this.unauthorised = true
                setTimeout(() => {
                    this.usermessage = ''
                    // this.unauthorised = true
                }, 3000);
            }

        },


        loginScreen() {
            this.login = true
            this.reg = false
        },

        registerScreen() {
            this.login = false
            this.reg = true
        },

        logoutF() {
            localStorage.clear();
            this.login = true;
            this.open = false;
            this.username = ''
            this.password = ''
            clearInterval(this.countUpdate)
        },

        loginF() {
            const { username, password } = this;
            axios
                .post(`${URL_BASE}/api/login`, {
                    username, password
                })
                .then(r => r.data)
                .then(r => {

                    const { user, token, hearts } = r;
                    // console.log(r)
                    this.usermessage = r.message

                    if (r.token) {
                        this.open = true;
                        this.hearts = hearts
                        localStorage.setItem('token', token)
                        localStorage.setItem('user', JSON.stringify(user))
                        this.countUpdate
                        this.loveCounter = user.love_count
                        console.log(user);

                        this.token = token;
                        this.loggedInUser = user;
                    }
                    // console.log(r);
                    // this.logout = true
                }).catch(e => console.log(e)) // display error message 

        },

        getUser() {
            return JSON.parse(localStorage.getItem('user'))

        },


        love() {
            const { loveCounter, getUser } = this;
            const { username } = getUser()
            if (!username) this.logout()
            // this.loveCounter
            // this.loveCounter++
            // loveCounter++ 
            console.log(loveCounter);

            const user = this.getUser()
            this.loveCounter = user.love_count
            user.love_count++;

            axios
                .post(`${URL_BASE}/api/loveCounter`, { loveCounter, username, token: localStorage.getItem('token') })
                .then(result => {
                    // console.log(result.data);
                    // console.log(result);
                    // console.log(loveCounter);
                    
                    localStorage.setItem('user', JSON.stringify(user))

                    this.hearts = result.data.hearts
                    // console.log(this.hearts);

                })


        },


    }
}

