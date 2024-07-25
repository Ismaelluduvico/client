import axios from "axios";

const Api = axios.create({
    baseURL: "https://jogo-server-429819.uc.r.appspot.com",
    headers: {
        "Contex-type": "application/json",
        "Authorization": localStorage.getItem("token"),
    },
});

export default Api;