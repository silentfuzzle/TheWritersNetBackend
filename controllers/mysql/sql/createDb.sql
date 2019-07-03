CREATE DATABASE thewritersnet;

USE thewritersnet;

CREATE TABLE users (
    id INT(11) NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    displayname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    facebook VARCHAR(255) DEFAULT '',
    linkedin VARCHAR(255) DEFAULT '',
    twitter VARCHAR(255) DEFAULT '',
    youtube VARCHAR(255) DEFAULT '',
    website VARCHAR(255) DEFAULT '',
    about TEXT DEFAULT '',
    PRIMARY KEY (id)
);

ALTER TABLE users
ADD INDEX idx_mongo_id (mongoid);

CREATE TABLE sections (
    id INT(11) NOT NULL AUTO_INCREMENT,
    bookid INT(11) NOT NULL,
    title VARCHAR(255) NOT NULL,
    displaytitle BOOLEAN DEFAULT 0,
    content TEXT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE pages (
    id INT(11) NOT NULL AUTO_INCREMENT,
    bookid INT(11) NOT NULL,
    title VARCHAR(255) NOT NULL,
    outgoinglinks TEXT DEFAULT '',
    PRIMARY KEY (id)
);

ALTER TABLE pages
ADD INDEX fk_book_id (bookid);

CREATE TABLE books (
    id INT(11) NOT NULL AUTO_INCREMENT,
    startpageid INT(11) DEFAULT 0,
    ownerid INT(11) NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255) DEFAULT '',
    description TEXT DEFAULT '',
    visibility BOOLEAN DEFAULT 0,
    length DECIMAL(5,2) DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT -1,
    PRIMARY KEY (id)
);

ALTER TABLE books
ADD INDEX fk_page_id (startpageid);

ALTER TABLE books
ADD INDEX fk_user_id (ownerid);

CREATE TABLE positions (
    id INT(11) NOT NULL AUTO_INCREMENT,
    pageid INT(11) NOT NULL,
    sectionid INT(11) NOT NULL,
    position INT(11) NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE positions
ADD INDEX fk_page_id (pageid);

ALTER TABLE positions
ADD INDEX fk_section_id (sectionid);

CREATE TABLE reviews (
    id INT(11) NOT NULL AUTO_INCREMENT,
    userid INT(11) NOT NULL,
    bookid INT(11) NOT NULL,
    rating INT(2) NOT NULL,
    title VARCHAR(255) DEFAULT '',
    review TEXT DEFAULT '',
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    percentageread DECIMAL(5,2) NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE reviews
ADD INDEX fk_user_id (userid);

ALTER TABLE reviews
ADD INDEX fk_book_id (bookid);

CREATE TABLE maps (
    id INT(11) NOT NULL AUTO_INCREMENT,
    userid INT(11) NOT NULL,
    bookid INT(11) NOT NULL,
    maplinks TEXT DEFAULT '',
    updatefirst BOOLEAN DEFAULT 0,
    visitedpages TEXT DEFAULT '',
    currpageid INT(11) NOT NULL,
    prevhistory TEXT DEFAULT '',
    nexthistory TEXT DEFAULT '',
    percentageread DECIMAL(5,2) DEFAULT 0,
    PRIMARY KEY (id)
);

ALTER TABLE maps
ADD INDEX fk_user_id (userid);

ALTER TABLE maps
ADD INDEX fk_book_id (bookid);

ALTER TABLE maps
ADD INDEX fk_page_id (currpageid);

CREATE TABLE permissiontypes (
    id INT(2) NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO permissiontypes (name) VALUES ('Co-Author'), ('Moderator'), ('Viewer');

CREATE TABLE permissions (
    id INT(11) NOT NULL AUTO_INCREMENT,
    bookid INT(11) NOT NULL,
    userid INT(11) NOT NULL,
    permissionid INT(2) NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE permissions
ADD INDEX fk_book_id (bookid);

ALTER TABLE permissions
ADD INDEX fk_user_id (userid);

ALTER TABLE permissions
ADD INDEX fk_permission_id (permissionid);