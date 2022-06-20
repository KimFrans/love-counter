import './style.css'

import Alpine from 'alpinejs'
import LoveCounter from './love-counter';
import Quotes from './quote';
import app from './app'
import axios from 'axios'
// import Login from './login'
window.Alpine = Alpine
Alpine.data('loveCounter', LoveCounter);
Alpine.data('app', app);
Alpine.data('quoteApp', Quotes)
Alpine.start()

// document.querySelector('#app').innerHTML = "I 💚 Alpine JS!"
