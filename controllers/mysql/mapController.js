const db = require('./db');
const pc = require('./pageController');

const SELECT_MAP =
`SELECT * FROM maps
WHERE id = ?`;

exports.SELECT_MAP_FROM_USER =
`SELECT percentageread FROM maps
WHERE userid = ? AND bookid = ?`;

const SELECT_LINK_PAGE =
`SELECT p.id
FROM sections AS s
JOIN positions AS p ON p.sectionid = s.sectionid
WHERE p.pageid = ? AND s.links REGEXP ?
LIMIT 1`;

const SELECT_LINK_BOOK =
`SELECT id
FROM sections
WHERE bookid = ? AND links REGEXP ?
LIMIT 1`;

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

const SET_UPDATE =
`UPDATE maps SET
updatefirst = 1
WHERE bookid = ?`;

exports.DELETE_MAPS =
`DELETE FROM maps
WHERE bookid = ?`;

const DELETE_MAP =
`DELETE FROM maps
WHERE id = ?
LIMIT 1`;

exports.updateMaps = (bookid) => {
    return new Promise((resolve, reject) => {
        db.pool.query(SET_UPDATE, [bookid], 
            (error, result) => {
                if (error) 
                    reject(error);

                resolve(true);
            });
    });
}

const mapController = {
    checkMap: (req,res,next) => {
        db.pool.query(SELECT_MAP, [req.params.mapId], 
            (error, result) => {
                if (error)
                    next(new Error(error));
                
                req.map = result;
                db.sendCheck(error, next, result.userid, req.user.sqlid)
            });
    },
    getMap: (req,res,next) => {
        if (result.updatefirst) {
            // Check and update map.maplinks if needed
            // Update map.updatefirst to false
        }

        db.sendResult(res, next, error, req.map);
    },
    postMap: (req,res,next) => {
        db.pool.query(INSERT_MAP, 
            [req.user.sqlid, req.body.bookid, req.body.pageid, req.body.pageid], 
            (error, result) => db.sendId(res, next, error, result));
    },
    putLink: (req,res,next) => {
        const pageid = req.body.pageid;
        const pageSearch = pageid + ',%|%,' +  pageid + ',%|%,' + pageid;

        db.pool.query(pc.SELECT_PAGES + '; ' + SELECT_LINK_PAGE + '; ' + SELECT_LINK_BOOK, 
            [req.map.bookid, req.map.currpageid, pageSearch, req.map.bookid, pageSearch], 
            (error, result) => {
                if (error) next(new Error(error));

                let prevhistory = req.map.prevhistory.split(',');
                prevhistory.push(req.map.currpageid);
                prevhistory = prevhistory.join(',');

                let visitedpages = req.map.visitedpages.split(',');
                let percentageread = req.map.percentageread;
                if (!visitedpages.some(p => p === pageid)) {
                    if ((req.body.addlink && result[1]) || !result[2]) {
                        visitedpages.push(pageid);
                        percentageread = visitedpages.length / result[0].length;
                    }
                }
                visitedpages = visitedpages.join(',');

                let maplinks = req.map.maplinks;
                if (req.body.addlink && result[1]) {
                    // Update maplinks
                }

                db.pool.query(UPDATE_LINK, 
                    [maplinks, visitedpages, pageid, prevhistory, '', percentageread, req.params.mapId], 
                    (error, result) => {
                        if (error) next(new Error(error));
                
                        res.send('updated');
                    });
            });
    },
    putPosition: (req,res,next) => {
        let prevhistory = req.map.prevhistory.split(',');
        let nexthistory = req.map.nexthistory.split(',');
        
        let currpageid = 0;
        if (req.body.backward) {
            currpageid = prevhistory.pop();
            nexthistory.push(req.map.currpageid);
        }
        else {
            currpageid = nexthistory.pop();
            prevhistory.push(req.map.currpageid);
        }

        prevhistory = prevhistory.join(',');
        nexthistory = nexthistory.join(',');

        db.pool.query(UPDATE_POSITION, 
            [currpageid, prevhistory, nexthistory, req.params.mapId], 
            (error, result) => {
                if (error) next(new Error(error));
        
                res.send('updated');
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

exports.mapController = mapController;