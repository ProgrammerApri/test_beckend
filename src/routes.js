// src/routes.js
const express = require('express');
const { borrowBook, returnBook, getBooks, getMembers } = require('./controllers/libraryController');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Member:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *         name:
 *           type: string
 *         penaltyUntil:
 *           type: string
 *           format: date-time
 *     Book:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *         title:
 *           type: string
 *         author:
 *           type: string
 *         stock:
 *           type: integer
 */

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Get all books
 *     responses:
 *       200:
 *         description: List of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
router.get('/books', getBooks);

/**
 * @swagger
 * /api/members:
 *   get:
 *     summary: Get all members
 *     responses:
 *       200:
 *         description: List of members
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Member'
 */
router.get('/members', getMembers);

/**
 * @swagger
 * /api/members/{memberCode}/borrow/{bookCode}:
 *   post:
 *     summary: Borrow a book
 *     parameters:
 *       - in: path
 *         name: memberCode
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: bookCode
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Borrow success
 *       400:
 *         description: Bad request
 */
router.post('/members/:memberCode/borrow/:bookCode', borrowBook);

/**
 * @swagger
 * /api/members/{memberCode}/return/{bookCode}:
 *   post:
 *     summary: Return a book
 *     parameters:
 *       - in: path
 *         name: memberCode
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: bookCode
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Return success
 *       400:
 *         description: Bad request
 */
router.post('/members/:memberCode/return/:bookCode', returnBook);

module.exports = router;
