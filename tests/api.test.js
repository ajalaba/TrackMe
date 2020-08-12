const dotenv = require('dotenv');
const axios = require('axios');
dotenv.config();
const { API_URL } = process.env;

test('test device array', () => {
    expect.assertions(2);
    return axios.get(`${API_URL}/devices`)
    .then(resp => resp.data)
    .then(resp => {
    expect(resp[0].user).toEqual('mary123');
    expect(resp[1].user).toEqual('kev');
    });
});

test('test device history', () => {
    expect.assertions(1);
    return axios.get(`${API_URL}/devices/5f195bf045ae10b857081e2c/device-history`)
    .then(resp => resp.data)
    .then(resp => {
    expect(resp[0].ts).toEqual('1529542743');
    });
});

test('test user device', () => {
    expect.assertions(1);
    return axios.get(`${API_URL}/users/mary123/devices`)
    .then(resp => resp.data)
    .then(resp => {
    expect(resp[0].name).toEqual("Mary's iPhone");
    });
});
    
