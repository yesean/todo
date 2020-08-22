import axios from 'axios';

const baseUrl = '/api/users';

const createAccount = async (credentials) => {
  try {
    const res = await axios.post(baseUrl, credentials);
    return res.data;
  } catch (error) {
    return Promise.reject(error.response);
  }
};

export default { createAccount };
