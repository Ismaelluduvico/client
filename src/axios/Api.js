import axios from "axios";

const Api = axios.create({
    baseURL: "http://localhost:5000/",
    //http://localhost:5000/
    //https://jogo-server-429819.uc.r.appspot.com/
    headers: {
        "Contex-type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token"),
    },
});

export default Api;