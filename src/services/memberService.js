// src/services/memberService.js
const { Member, Borrow } = require('../models');
const dayjs = require('dayjs');

const checkPenalty = async (memberCode) => {
    const member = await Member.findByPk(memberCode);
    if (!member) {
        throw new Error('Member not found');
    }

    if (member.penaltyUntil && dayjs().isBefore(dayjs(member.penaltyUntil))) {
        return true; // Member sedang dikenai penalti
    }
    return false; // Member tidak sedang dikenai penalti
};

module.exports = { checkPenalty };
