import axios from "axios";

const PORT = 3000;

export const api = axios.create({
  baseURL: `http://localhost:${PORT}`,
});
