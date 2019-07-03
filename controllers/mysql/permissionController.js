exports.SELECT_AUTHORS =
`SELECT userid FROM permissions
WHERE permissionid = 1 AND bookid = ?`;

exports.DELETE_PERMISSIONS =
`DELETE FROM permissions
WHERE bookid = ?`;