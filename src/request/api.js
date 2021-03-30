import axios from "./$http";
import base from './base';

const API = {
    wsDemo() {
        return axios.post('login', this.loginFrom);
    }
}

export default API;
