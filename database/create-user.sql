CREATE USER 'mediauser'@'localhost' IDENTIFIED BY 'tosisalainen';
GRANT ALL PRIVILEGES ON `MediaSharingApp`.* TO 'mediauser'@'localhost';
FLUSH PRIVILEGES;