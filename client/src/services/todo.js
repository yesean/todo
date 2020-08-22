import axios from 'axios';

const baseUrl = '/api/todos';

let token = null;

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

const getAll = async () => {
  const req = await axios.get(baseUrl);
  return req.data;
};

const create = async (todo) => {
  const config = { headers: { Authorization: token } };
  const res = await axios.post(baseUrl, todo, config);
  return res.data;
};

const update = async (todo) => {
  const config = { headers: { Authorization: token } };
  const res = await axios.put(`${baseUrl}/${todo.id}`, todo, config);
  return res.data;
};

const remove = async (todo) => {
  const res = await axios.delete(`${baseUrl}/${todo.id}`);
  return res.data;
};

export default { getAll, create, update, remove, setToken };
