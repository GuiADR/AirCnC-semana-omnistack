import axios from 'axios';

const api = axios.create({
  //Lembrar de trocar o IP para o mesmo ip do EXPO
  baseURL: 'http://192.168.1.5:3333',
});

export default api;