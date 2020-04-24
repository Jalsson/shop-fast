/*CREATE TABLE Users(
id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
username CHAR(60) NOT NULL,
email CHAR(40) NOT NULL,
password CHAR(120) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

############################################

CREATE TABLE Product(
id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
Name CHAR(50) NOT NULL,
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
message_id int(11) NOT NULL,
FOREIGN KEY (user_id) REFERENCES Users(id),
FOREIGN KEY (message_id) REFERENCES Message(id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

########################################

CREATE TABLE Picture(
id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
url CHAR(80) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


########################################

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