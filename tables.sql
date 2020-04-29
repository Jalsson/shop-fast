/*CREATE TABLE Users(
id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
username CHAR(60) NOT NULL,
email CHAR(40) NOT NULL,
password CHAR(120) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

############################################

CREATE TABLE Product(
id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
name CHAR(50) NOT NULL,
owner_id int(11) NOT NULL,
price_flex CHAR(80) NOT NULL,
price double(20,2) NOT NULL,
description CHAR(255),
location CHAR(60) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

ALTER TABLE Product
ADD FOREIGN KEY (owner_id) REFERENCES Users(id);

########################################

CREATE TABLE Message(
id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
message char(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

########################################

CREATE TABLE User_message_relation(
user_id int(11) NOT NULL ,
sent_user_id int(11) NOT NULL,
message_id int(11) NOT NULL,
FOREIGN KEY (user_id) REFERENCES Users(id),
FOREIGN KEY (sent_user_id) REFERENCES Users(id),
FOREIGN KEY (message_id) REFERENCES Message(id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

########################################

CREATE TABLE Picture(
id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
url CHAR(80) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


########################################
//
CREATE TABLE Product_picture_relation(
product_id int(11) NOT NULL ,
picture_id int(11) NOT NULL,
FOREIGN KEY (product_id) REFERENCES Product(id),
FOREIGN KEY (picture_id) REFERENCES Picture(id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

########################################

CREATE TABLE Admin(
id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
username CHAR(60) NOT NULL,
email CHAR(40) NOT NULL,
password CHAR(120)) NOT NULL

) ENGINE=MyISAM DEFAULT CHARSET=utf8;

#########################################
CREATE TABLE Settings(
id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
setting_1 int(11) NOT NULL,
setting_2 CHAR(80) NOT NULL,
setting_3 (20,2) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

#########################################

CREATE TABLE User_settings_relation(
settings_id int(11) NOT NULL ,
user_id int(11) NOT NULL,
FOREIGN KEY (settings_id) REFERENCES Settings(id),
FOREIGN KEY (user_id) REFERENCES Users(id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

#########################################
##########SOME INSERTS###################
#########################################

INSERT INTO Product (owner_id, price, description, location ) VALUES
(2, 5.2, "Test Product 2", "test location");

INSERT INTO Picture (url) VALUES
('http://placekitten.com/400/302');

INSERT INTO Picture (url) VALUES
('http://placekitten.com/400/300');

**/

/* Dummy chat data */

/*jalmari 21 nilsson 20*/

INSERT INTO Message VALUES (1, "jou jou taa on viesti sulle");
INSERT INTO Message VALUES (2, "toinen viesti");
INSERT INTO Message VALUES (3, "kolmas viesti");
INSERT INTO Message VALUES (4, "neljas viesti");
INSERT INTO Message VALUES (5, "viides viesti");
INSERT INTO Message VALUES (6, "kuudes viesti");

INSERT INTO User_message_relation VALUES (20,21,1);
INSERT INTO User_message_relation VALUES (21,20,2);
INSERT INTO User_message_relation VALUES (20,21,3);
INSERT INTO User_message_relation VALUES (21,20,4);
INSERT INTO User_message_relation VALUES (20,21,5);
INSERT INTO User_message_relation VALUES (20,21,6);

SELECT Message.message, User_message_relation.user_id
FROM Message 
INNER JOIN User_message_relation ON User_message_relation.user_id = 20 OR User_message_relation.sent_user_id = 20
WHERE Message.id = User_message_relation.message_id

/*############################################*/

SELECT id, Name, price_flex, price, description, location
FROM Product

SELECT url
FROM Picture
INNER JOIN Product_picture_relation ON Product_picture_relation.product_id = ?
WHERE Picture.id = Product_picture_relation.picture_id

/*SELECT url
FROM Picture
  INNER JOIN Product_picture_relation ON product_id = ?
WHERE Picture.id = Product_picture_relation.picture_id
*/