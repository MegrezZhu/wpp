import axios from 'axios';

// TODO: auto retry ?
export default axios.create({
  timeout: 3000
});
