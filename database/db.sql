mysql -h localhost -u root -p

CREATE DATABASE database_movies;

USE database_movies;

---- Users table --------------------- 

CREATE TABLE users(
    id INT(11) NOT NULL,
    username VARCHAR(16) NOT NULL,
    password VARCHAR(60) NOT NULL,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL
);

ALTER TABLE users 
    ADD PRIMARY KEY (id);

ALTER TABLE users 
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

DESCRIBE users;

---- Movies table ------------------------

CREATE TABLE movies (
    id INT(11) NOT NULL,
    title VARCHAR(150) NOT NULL,
    year INT(4) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    duration INT(4) NOT NULL,
    description TEXT,
    imagePath VARCHAR(100) NOT NULL,
    user_id INT(11),
    created_at timestamp NOT NULL DEFAULT current_timestamp,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) 
);

ALTER TABLE movies 
    ADD PRIMARY KEY (id);

ALTER TABLE movies
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

DESCRIBE movies;

---------------------------------------------

ALTER TABLE movies
ADD COLUMN imagePath VARCHAR(100) NOT NULL AFTER description;