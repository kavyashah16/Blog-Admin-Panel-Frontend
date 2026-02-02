import axios from "axios";

const multiapi = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export default multiapi;
