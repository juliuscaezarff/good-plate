import axios from "axios";

export const api = axios.create({
  baseURL: "https://api.clarifai.com",
  headers: {
    "Authorization": "Key 3fa866e378524c5fa4b8701b30937fdb",
  }
})