import axios from "axios";

export default function app() {
    return {
        info_message: '',
        error: false,

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
        logout:true,

        init(){
            // first check token in localstorage 
            //  - set open to true
            // - set login to true
            if(localStorage['token'] === undefined) {
                this.open = false;
                this.login = true;
            } else {
                this.open = true;
                this.login = false;
            }

        },
        

        register() {
            const { username, password } = this;
            if (this.username && this.password != '') {
                // console.log(this.username);
                // console.log(this.password);

                axios
                    // .post(`http://localhost:3010/api/register/${this.username}/${this.password}`)
                    .post('http://localhost:3010/api/register', {username, password}, {withCredentials : true})
                    .then(
                        this.usermessage = 'Successfully registered',
                        this.reg = false,
                        this.login = true,

                        console.log('Successfully registered'),
                        console.log(this.username, this.password)
                    )
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
            // this.loginLink = false
            // this.regLink = true

        },

        registerScreen() {
            this.login = false
            this.reg = true
            // this.loginLink = true
            // this.regLink = false
        },

        logoutF(){
            localStorage.clear();
            this.login = true;
            this.open = false;
            this.username = ''
            this.password = ''
        },

        loginF() {
            const { username, password } = this;
            axios
                .post('http://localhost:3010/api/login', {withCredentials : true}, {
                    username, password
                })
                .then(r => r.data)
                .then(r => {

                    const { user, token } = r;

                    if(r.token) {
                        this.open = true;
                        localStorage.setItem('token', token)
                        this.token = token;
                        this.loggedInUser = user;
                    }
                    // console.log(r);
                    // this.logout = true
                }).catch(e => console.log(e)) // display error message 

        },

        counter(){
            

        },
    }
}

