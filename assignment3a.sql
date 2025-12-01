-- 1. DATABASE INITIALIZATION

-- Drop the database if it exists to ensure a clean start
DROP DATABASE IF EXISTS mediashare_assignment;

-- Create the new database
CREATE DATABASE mediashare_assignment;

-- Select the database for subsequent operations
USE mediashare_assignment;


-- 2. CREATE TABLE STATEMENTS

-- Users table: Stores user information.
CREATE TABLE Users (
  user_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, -- Primary Key (PK)
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  user_level_id INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- MediaItems table: Stores information about uploaded media.
CREATE TABLE MediaItems (
  media_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL, -- Foreign Key (FK): Links to the owner (Users.user_id)
  filename VARCHAR(255) NOT NULL,
  filesize INT NOT NULL,
  media_type VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description VARCHAR(500),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- Define the Foreign Key constraint
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Comments table: Stores user comments on media items.
CREATE TABLE Comments (
  comment_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  media_id INT NOT NULL, -- FK: The media item being commented on
  user_id INT NOT NULL, -- FK: The user who wrote the comment
  comment_text VARCHAR(1000) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (media_id) REFERENCES MediaItems(media_id),
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Follows table: Tracks which user follows another user.
CREATE TABLE Follows (
  follower_id INT NOT NULL, -- FK: The user who is following
  following_id INT NOT NULL, -- FK: The user being followed
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- Composite Primary Key to ensure one user can only follow another once
  PRIMARY KEY (follower_id, following_id),
  FOREIGN KEY (follower_id) REFERENCES Users(user_id),
  FOREIGN KEY (following_id) REFERENCES Users(user_id)
);

-- Likes table: Tracks which user liked which media item.
CREATE TABLE Likes (
  media_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- Composite Primary Key to ensure one user can only like an item once
  PRIMARY KEY (media_id, user_id),
  FOREIGN KEY (media_id) REFERENCES MediaItems(media_id),
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
);


-- 3. INSERT MOCK DATA

-- Insert Users (IDs 1, 2, 3)
INSERT INTO Users (user_id, username, password, email) VALUES 
(1, 'Donatello', 'pass1', 'dona@example.com'),
(2, 'VCHar', 'pass2', 'vchar@example.com'),
(3, 'Anya', 'pass3', 'anya@example.com');

-- Insert MediaItems (media_id 1, 2, 3)
INSERT INTO MediaItems (user_id, filename, filesize, media_type, title) VALUES
(1, 'pic_dona_1.jpg', 150000, 'image/jpeg', 'Morning Coffee'), 
(1, 'vid_dona_2.mp4', 5000000, 'video/mp4', 'Vacation Clip'),  
(2, 'pic_vchar_1.jpg', 250000, 'image/jpeg', 'My Desktop');    

-- Insert Comments
INSERT INTO Comments (media_id, user_id, comment_text) VALUES
(1, 2, 'Great shot, Donatello!'),
(1, 3, 'Love the colors.'),
(2, 1, 'Awesome trip!');

-- Insert Follows (User 3 follows User 1; User 2 follows User 1)
INSERT INTO Follows (follower_id, following_id) VALUES
(3, 1), 
(2, 1); 

-- Insert Likes (Likes on media_id 1 by user 2 and 3; Like on media_id 3 by user 1)
INSERT INTO Likes (media_id, user_id) VALUES
(1, 2), 
(3, 1), 
(1, 3); 


-- 4. EXAMPLE USE CASES (QUERY, UPDATE, DELETE)

-- QUERY 1: Find all media items liked by a specific user (Anya, user_id = 3).
SELECT 
    U.username, 
    MI.title
FROM 
    Likes L
JOIN 
    Users U ON L.user_id = U.user_id
JOIN 
    MediaItems MI ON L.media_id = MI.media_id
WHERE 
    U.username = 'Anya';

-- QUERY 2: Find all comments for a specific media item ("Morning Coffee"), including the author's username.
SELECT 
    C.comment_text, 
    U.username AS author
FROM 
    Comments C
JOIN 
    Users U ON C.user_id = U.user_id
WHERE 
    C.media_id = 1
ORDER BY 
    C.created_at ASC;

-- UPDATE: Change the title of a media item.
UPDATE MediaItems 
SET 
    title = 'Awesome Vacation Clip'
WHERE 
    media_id = 2;

-- DELETE: Remove a specific follow relationship (VCHar (user_id 2) unfollows Donatello (user_id 1)).
DELETE FROM Follows 
WHERE 
    follower_id = 2 AND following_id = 1;

-- DELETE: Remove all comments made by a specific user (Anya, user_id = 3).
DELETE FROM Comments 
WHERE 
    user_id = 3;