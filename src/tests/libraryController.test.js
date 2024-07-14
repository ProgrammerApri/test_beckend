// src/tests/libraryController.test.js
const request = require('supertest');
const express = require('express');
const routes = require('../routes');
const { sequelize, loadMockData } = require('../data');

const app = express();
app.use(express.json());
app.use('/api', routes);

beforeAll(async () => {
    await sequelize.sync({ force: true });
    await loadMockData();
});

test('GET /api/books should return all books', async () => {
    const res = await request(app).get('/api/books');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(5);
});

test('GET /api/members should return all members', async () => {
    const res = await request(app).get('/api/members');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(3);
});

// Tambahkan lebih banyak test case sesuai kebutuhan
