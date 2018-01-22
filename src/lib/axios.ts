import axios from 'axios';

export const ax = axios.create({
  timeout: 10000
});

// TODO: add response timeout guard
