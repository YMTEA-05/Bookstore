create database bookstore;
use bookstore;


-- Bookstore Database Schema



-- Table: Customer
-- Stores information about registered customers.
CREATE TABLE Customer (
    Customer_ID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Address TEXT,
    Joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- Table: Books
-- Stores details for each book available in the store.
CREATE TABLE Books (
    Book_ID INT PRIMARY KEY AUTO_INCREMENT,
    Title VARCHAR(255) NOT NULL,
    Author VARCHAR(255) NOT NULL,
    Genre VARCHAR(100),
    Published YEAR NOT NULL,
    Price DECIMAL(10, 2) NOT NULL CHECK (Price >= 0),
    Stock INT NOT NULL DEFAULT 0 CHECK (Stock >= 0)
);
ALTER TABLE Books
ADD Language VARCHAR(100) NOT NULL DEFAULT 'English';

-- Table: Orders
-- Stores the main information for each customer order.
CREATE TABLE Orders (
    Order_ID INT PRIMARY KEY AUTO_INCREMENT,
    CID INT NOT NULL,
    Order_Date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Total_Amount DECIMAL(10, 2) NOT NULL CHECK (Total_Amount >= 0),
    Status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    FOREIGN KEY (CID) REFERENCES Customer(Customer_ID) ON DELETE RESTRICT
);

-- Table: Order_Items
-- A junction table that links books to specific orders, detailing the quantity and price at the time of purchase.
CREATE TABLE Order_Items (
    OID INT NOT NULL,
    BID INT NOT NULL,
    Quantity INT NOT NULL CHECK (Quantity > 0),
    Price DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (OID, BID),
    FOREIGN KEY (OID) REFERENCES Orders(Order_ID) ON DELETE CASCADE,
    FOREIGN KEY (BID) REFERENCES Books(Book_ID) ON DELETE RESTRICT
);


-- Table: Reviews
-- Stores customer reviews and ratings for books.
CREATE TABLE Reviews (
    Review_ID INT PRIMARY KEY AUTO_INCREMENT,
    BID INT NOT NULL,
    CID INT NOT NULL,
    Rating INT NOT NULL CHECK (Rating BETWEEN 1 AND 5),
    Comments TEXT,
    Created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (BID) REFERENCES Books(Book_ID) ON DELETE CASCADE,
    FOREIGN KEY (CID) REFERENCES Customer(Customer_ID) ON DELETE CASCADE
);

-- Table: Payments
-- Stores payment details for each order.
CREATE TABLE Payments (
    Payment_ID INT PRIMARY KEY AUTO_INCREMENT,
    OID INT NOT NULL UNIQUE,
    Payment_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Amount DECIMAL(10, 2) NOT NULL,
    Method VARCHAR(50) NOT NULL,
    Status VARCHAR(50) NOT NULL DEFAULT 'Incomplete',
    FOREIGN KEY (OID) REFERENCES Orders(Order_ID) ON DELETE CASCADE
);


INSERT INTO Customer (Name, Email, Address) VALUES
('Yashvardhan Singh', 'abc@email.com', '123 Street, Bengaluru, Karnataka'),
('Yash Tharappan', 'def@email.com', '456 Road, Bengaluru, Karnataka'),
('Vibhav K', 'hij@email.com', '789 Lane, Bengaluru, Karnataka');



INSERT INTO Books (Title, Author, Genre, Published, Price, Stock, Language) VALUES
('The Jungle Book', 'Rudyard Kipling', 'Children''s Fiction', 1901, 199.00, 40, 'English'),
('The Immortals of Meluha', 'Amish Tripathi', 'Mythological Fiction', 2010, 299.00, 50, 'English'),
('Mahabharata', 'Vyasa', 'Epic', 1951, 450.00, 30, 'Sanskrit'),
('Bible', 'Moses, Paul, David, Solomon', 'Religious Text', 1901, 500.00, 25, 'Hebrew'),
('Quran', 'Prophet Muhammad', 'Religious Text', 1924, 400.00, 20, 'Arabic');





INSERT INTO Orders (CID, Total_Amount, Status) VALUES
(1, 648.50, 'Shipped'), 
(2, 280.75, 'Delivered'), 
(1, 870.00, 'Pending');   


INSERT INTO Order_Items (OID, BID, Quantity, Price) VALUES
(1, 1, 1, 299.00),
(1, 2, 1, 349.50), 
(2, 4, 1, 280.75), 
(3, 3, 1, 320.00), 
(3, 5, 1, 550.00); 


INSERT INTO Reviews (BID, CID, Rating, Comments) VALUES
(1, 1, 5, 'An absolutely fantastic and thought-provoking read! Highly recommend.'),
(4, 2, 4, 'A very compelling story with rich characters. Enjoyed it thoroughly.'),
(1, 2, 4, 'Good book, interesting concept.');


INSERT INTO Payments (OID, Amount, Method, Status) VALUES
(1, 648.50, 'Credit Card', 'Completed'),
(2, 280.75, 'UPI', 'Completed');
-- No payment for Order_ID 3 as its status is 'Pending'.

INSERT INTO Customer (Name, Email, Address) VALUES
('Ravi Kumar', 'ravi@email.com', '101 Main St, Delhi, India'),
('Ananya Sharma', 'ananya@email.com', '202 Park Rd, Mumbai, India'),
('Karan Mehta', 'karan@email.com', '303 Lakeview, Pune, India'),
('Sneha Gupta', 'sneha@email.com', '404 Hilltop, Chennai, India'),
('Aditya Singh', 'aditya@email.com', '505 Garden St, Kolkata, India'),
('Isha Reddy', 'isha@email.com', '606 Riverside, Hyderabad, India'),
('Vikram Patel', 'vikram@email.com', '707 Downtown, Jaipur, India');

INSERT INTO Books (Title, Author, Genre, Published, Price, Stock, Language) VALUES
('Harry Potter and the Sorcerer''s Stone', 'J.K. Rowling', 'Fantasy', 1997, 399.00, 60, 'English'),
('The Alchemist', 'Paulo Coelho', 'Fiction', 1988, 249.00, 45, 'English'),
('Sapiens', 'Yuval Noah Harari', 'Non-Fiction', 2011, 499.00, 35, 'English'),
('Inferno', 'Dan Brown', 'Thriller', 2013, 399.00, 50, 'English'),
('The Great Gatsby', 'F. Scott Fitzgerald', 'Classic', 1925, 299.00, 40, 'English');

INSERT INTO Books (Title, Author, Genre, Published, Price, Stock, Language) VALUES
('Harry Potter and the Sorcerer''s Stone', 'J.K. Rowling', 'Fantasy', 1997, 399.00, 60, 'English'),
('The Alchemist', 'Paulo Coelho', 'Fiction', 1988, 249.00, 45, 'English'),
('Sapiens', 'Yuval Noah Harari', 'Non-Fiction', 2011, 499.00, 35, 'English'),
('Inferno', 'Dan Brown', 'Thriller', 2013, 399.00, 50, 'English'),
('The Great Gatsby', 'F. Scott Fitzgerald', 'Classic', 1925, 299.00, 40, 'English');

INSERT INTO Orders (CID, Total_Amount, Status) VALUES
(3, 520.00, 'Delivered'),
(4, 350.50, 'Shipped'),
(5, 610.00, 'Pending'),
(6, 430.25, 'Delivered'),
(7, 720.00, 'Shipped'),
(8, 295.50, 'Pending'),
(9, 480.75, 'Delivered');

INSERT INTO Order_Items (OID, BID, Quantity, Price) VALUES
(4, 6, 1, 399.00),
(4, 7, 1, 121.50),
(5, 8, 2, 249.00),
(6, 9, 1, 399.00),
(6, 10, 1, 31.25),
(7, 2, 1, 299.00),
(7, 5, 1, 181.75);

INSERT INTO Reviews (BID, CID, Rating, Comments) VALUES
(2, 3, 5, 'Loved the mythological twist!'),
(3, 4, 4, 'Great insights on history and philosophy.'),
(5, 5, 5, 'A classic must-read.'),
(6, 6, 4, 'Engaging and thrilling!'),
(7, 7, 5, 'Inspirational story, beautifully written.'),
(8, 8, 3, 'Interesting concept but a bit slow.'),
(9, 9, 5, 'Absolutely gripping thriller!');

INSERT INTO Payments (OID, Amount, Method, Status) VALUES
(3, 870.00, 'Credit Card', 'Pending'),
(4, 520.00, 'UPI', 'Completed'),
(5, 610.00, 'Debit Card', 'Pending'),
(6, 430.25, 'Credit Card', 'Completed'),
(7, 720.00, 'UPI', 'Completed'),
(8, 295.50, 'Debit Card', 'Pending'),
(9, 480.75, 'Credit Card', 'Completed');
