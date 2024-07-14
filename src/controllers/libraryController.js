// src/controllers/libraryController.js
const { Member, Book, Borrow } = require('../models');
const { Op } = require('sequelize');
const dayjs = require('dayjs');

const borrowBook = async (req, res) => {
    const { memberCode, bookCode } = req.params;

    try {
        const member = await Member.findByPk(memberCode);
        if (!member) {
            return res.status(400).json({ message: 'Member not found' });
        }

        const book = await Book.findByPk(bookCode);
        if (!book) {
            return res.status(400).json({ message: 'Book not found' });
        }

        if (book.stock <= 0) {
            return res.status(400).json({ message: 'Book is not available' });
        }

        const borrows = await Borrow.findAll({
            where: {
                MemberCode: memberCode,
                returnDate: null
            }
        });

        if (borrows.length >= 2) {
            return res.status(400).json({ message: 'Member cannot borrow more than 2 books' });
        }

        const existingBorrow = await Borrow.findOne({
            where: {
                BookCode: bookCode,
                returnDate: null
            }
        });

        if (existingBorrow) {
            return res.status(400).json({ message: 'Book is already borrowed by another member' });
        }

        if (member.penaltyUntil && dayjs().isBefore(dayjs(member.penaltyUntil))) {
            return res.status(400).json({ message: 'Member is currently penalized' });
        }

        await Borrow.create({ MemberCode: memberCode, BookCode: bookCode, borrowDate: new Date() });
        book.stock -= 1;
        await book.save();

        res.status(200).json({ message: 'Book borrowed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

const returnBook = async (req, res) => {
    const { memberCode, bookCode } = req.params;

    try {
        const member = await Member.findByPk(memberCode);
        if (!member) {
            return res.status(400).json({ message: 'Member not found' });
        }

        const book = await Book.findByPk(bookCode);
        if (!book) {
            return res.status(400).json({ message: 'Book not found' });
        }

        const borrow = await Borrow.findOne({
            where: {
                MemberCode: memberCode,
                BookCode: bookCode,
                returnDate: null
            }
        });

        if (!borrow) {
            return res.status(400).json({ message: 'Book not borrowed by this member' });
        }

        const borrowDate = dayjs(borrow.borrowDate);
        const returnDate = dayjs();
        const diffDays = returnDate.diff(borrowDate, 'day');

        if (diffDays > 7) {
            member.penaltyUntil = returnDate.add(3, 'day').toDate();
            await member.save();
        }

        borrow.returnDate = returnDate.toDate();
        await borrow.save();

        book.stock += 1;
        await book.save();

        res.status(200).json({ message: 'Book returned successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

const getBooks = async (req, res) => {
    try {
        const books = await Book.findAll();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

const getMembers = async (req, res) => {
    try {
        const members = await Member.findAll({
            include: {
                model: Book,
                through: {
                    where: { returnDate: null }
                }
            }
        });

        const result = members.map(member => ({
            ...member.toJSON(),
            borrowedBooks: member.Books.map(book => book.code)
        }));

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

module.exports = { borrowBook, returnBook, getBooks, getMembers };
