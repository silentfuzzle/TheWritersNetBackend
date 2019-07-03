const db = require('./db');

exports.DELETE_SECTIONS =
`DELETE FROM sections
WHERE bookid = ?`;

exports.DELETE_POSITIONS_FROM_BOOK =
`DELETE p
FROM positions AS p
INNER JOIN sections AS s ON p.sectionid = s.id
WHERE s.bookid = ?`;

exports.DELETE_POSITIONS_FROM_PAGE =
`DELETE FROM positions
WHERE pageid = ?`;

const sectionController = {
}

exports.sectionController = sectionController;