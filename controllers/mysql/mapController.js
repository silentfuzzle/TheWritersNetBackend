const db = require('./db');
const pc = require('./pageController');

const SELECT_MAP =
`SELECT * FROM maps
WHERE id = ?`;

const INSERT_MAP =
`INSERT INTO maps (userid, bookid, visitedpages, currpageid)
VALUES (?, ?, ?, ?)`;

const UPDATE_LINK =
`UPDATE maps SET
maplinks = ?,
visitedpages = ?,
currpageid = ?,
prevhistory = ?,
nexthistory = ?,
percentageread = ?
WHERE id = ?
LIMIT 1`;

const UPDATE_POSITION =
`UPDATE maps SET
currpageid = ?,
prevhistory = ?,
nexthistory = ?
WHERE id = ?
LIMIT 1`;

const DELETE_MAP =
`DELETE FROM maps
WHERE id = ?
LIMIT 1`;

const mapController = {
    checkMap: (req,res,next) => {
        db.pool.query(SELECT_MAP, [req.params.mapId], 
            (error, result) => 
                db.sendCheck(error, next, result.userid, req.user.sqlid));
    },
    getMap: (req,res,next) => {
        db.pool.query(SELECT_MAP, [req.params.mapId], 
            (error, result) => {
                if (result.userid !== req.user.sqlid)
                    db.sendUnauthorized(next);
                else
                    db.sendResult(res, next, error, result);
            });
    },
    postMap: (req,res,next) => {
        db.pool.query(INSERT_MAP, 
            [req.user.sqlid, req.body.bookid, req.body.pageid, req.body.pageid], 
            (error, result) => db.sendId(res, next, error, result));
    },
    putLink: (req,res,next) => {
        db.pool.query(SELECT_MAP + '; ' + pc.SELECT_PAGES, [req.params.mapId], 
            (error, result) => {
                if (error) next(new Error(error));

                if (result[0].userid !== req.user.sqlid)
                    db.sendUnauthorized(next);

                let visitedpages = result[0].visitedpages.split(',');
                let percentageread = result[0].percentageread;
                if (!visitedpages.some(p => p === req.body.pageid)) {
                    visitedpages.push(req.body.pageid);
                    percentageread = visitedpages.length / result[1].length;
                    visitedpages = visitedpages.join(',');
                }
                else
                    visitedpages = result[0].visitedpages;

                let prevhistory = result[0].prevhistory.split(',');
                prevhistory.push(result[0].currpageid);
                prevhistory = prevhistory.join(',');

                db.pool.query(UPDATE_LINK, 
                    [req.body.maplinks, visitedpages, req.body.pageid, prevhistory, '', percentageread, req.params.mapId], 
                    (error, result) => {
                        if (error) next(new Error(error));
                
                        res.send('updated');
                    });
            });
    },
    putPosition: (req,res,next) => {
        db.pool.query(SELECT_MAP, [req.params.mapId], 
            (error, result) => {
                if (error) next(new Error(error));

                if (result.userid !== req.user.sqlid)
                    db.sendUnauthorized(next);

                let prevhistory = result.prevhistory.split(',');
                let nexthistory = result.nexthistory.split(',');
                
                let currpageid = 0;
                if (req.body.backward) {
                    currpageid = prevhistory.pop();
                    nexthistory.push(result.currpageid);
                }
                else {
                    currpageid = nexthistory.pop();
                    prevhistory.push(result.currpageid);
                }

                prevhistory = prevhistory.join(',');
                nexthistory = nexthistory.join(',');

                db.pool.query(UPDATE_POSITION, 
                    [currpageid, prevhistory, nexthistory, req.params.mapId], 
                    (error, result) => {
                        if (error) next(new Error(error));
                
                        res.send('updated');
                    });
            });
    },
    deleteMap: (req,res,next) => {
        db.pool.query(DELETE_MAP, [req.params.mapId], 
            (error, result) => {
                if (error) next(new Error(error));
        
                res.send('deleted');
            });
    }
}

module.exports = mapController;