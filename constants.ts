import { Problem } from './types';

export const PROBLEMS: Problem[] = [
    {
        id: 1,
        title: "8.1 Practice Lab 1",
        category: "DDL - CREATE TABLE",
        schema: [{
            name: "Member",
            columns: [
                { name: "ID", type: "positive integer" },
                { name: "FirstName", type: "variable-length string with up to 100 characters" },
                { name: "MiddleInitial", type: "fixed-length string with 1 character" },
                { name: "LastName", type: "variable-length string with up to 100 characters" },
                { name: "DateOfBirth", type: "date" },
                { name: "AnnualPledge", type: "positive decimal value representing a cost of up to $999,999, with 2 digits for cents" }
            ]
        }],
        question: "Write a SQL statement to create the Member table with the following constraints:\n- The `FirstName` and `LastName` columns cannot be null.\n- The `AnnualPledge` must be a positive value (greater than 0).\n- If no `AnnualPledge` is specified, it should default to 0.00.",
        correctQuery: "CREATE TABLE Member (\n  ID INT UNSIGNED,\n  FirstName VARCHAR(100) NOT NULL,\n  MiddleInitial CHAR(1),\n  LastName VARCHAR(100) NOT NULL,\n  DateOfBirth DATE,\n  AnnualPledge DECIMAL(8,2) UNSIGNED DEFAULT 0.00 CHECK (AnnualPledge >= 0)\n);",
        defaultQuery: "CREATE TABLE Member (\n  ID INT UNSIGNED,\n  FirstName VARCHAR(100) -- Add NOT NULL constraint,\n  MiddleInitial CHAR(1),\n  LastName VARCHAR(100) -- Add NOT NULL constraint,\n  DateOfBirth DATE,\n  AnnualPledge DECIMAL(8,2) UNSIGNED -- Add DEFAULT and CHECK constraints\n);"
    },
    {
        id: 2,
        title: "8.2 Practice Lab 2",
        category: "DDL - CREATE TABLE",
        schema: [
            { name: "Rating", columns: [
                { name: "RatingCode", type: "variable-length string", description: "primary key" },
                { name: "RatingDescription", type: "variable-length string" },
            ]},
            { name: "Movie", description: "The Movie table should have the following columns:", columns: [
                { name: "Title", type: "variable-length string, maximum 30 characters" },
                { name: "RatingCode", type: "variable-length string, maximum 5 characters" },
            ]}
        ],
        question: "Write a SQL statement to create the Movie table. Designate the RatingCode column in the Movie table as a foreign key to the RatingCode column in the Rating table.",
        correctQuery: "CREATE TABLE Movie(\n  Title VARCHAR(30),\n  RatingCode VARCHAR(5),\n  FOREIGN KEY (RatingCode) REFERENCES Rating(RatingCode)\n);",
        defaultQuery: "CREATE TABLE Movie(\n  -- Define columns: Title, RatingCode\n  -- Add foreign key constraint\n);"
    },
    {
        id: 3,
        title: "8.3 Practice Lab 3",
        category: "DDL - ALTER TABLE",
        schema: [{
            name: "Movie", columns: [
                { name: "ID", type: "integer", description: "primary key" },
                { name: "Title", type: "variable-length string" },
                { name: "Genre", type: "variable-length string" },
                { name: "RatingCode", type: "variable-length string" },
                { name: "Year", type: "integer" },
            ]
        }],
        question: "A new column must be added to the Movie table:\n- Column name: Score\n- Data type: decimal(3,1)\n\nWrite a SQL statement to add the Score column to the Movie table.",
        correctQuery: "ALTER TABLE Movie\nADD Score DECIMAL(3,1);",
        defaultQuery: "ALTER TABLE Movie\nADD -- Add the Score column with its data type;"
    },
    {
        id: 4,
        title: "8.4 Practice Lab 4",
        category: "DDL - CREATE VIEW",
        schema: [{
            name: "Movie", columns: [
                { name: "ID", type: "integer", description: "primary key" },
                { name: "Title", type: "variable-length string" },
                { name: "Genre", type: "variable-length string" },
                { name: "RatingCode", type: "variable-length string" },
                { name: "Year", type: "integer" },
            ]
        }],
        question: "Write a SQL statement to create a view named MyMovies that contains the Title, Genre, and Year columns for all movies. Ensure your result set returns the columns in the order indicated.",
        correctQuery: "CREATE VIEW MyMovies AS\nSELECT Title, Genre, Year\nFROM Movie;",
        defaultQuery: "CREATE VIEW MyMovies AS\nSELECT -- Specify columns: Title, Genre, Year\nFROM -- Specify table: Movie;"
    },
    {
        id: 5,
        title: "8.5 Practice Lab 5",
        category: "DDL - DROP VIEW",
        schema: [{
            name: "MovieView", description: "A database has a view named MovieView.", columns: []
        }],
        question: "Write a SQL statement to delete the view named MovieView from the database.",
        correctQuery: "DROP VIEW MovieView;",
        defaultQuery: "DROP VIEW -- Specify the view name to drop;"
    },
    {
        id: 6,
        title: "8.6 Practice Lab 6",
        category: "DDL - ALTER TABLE",
        schema: [{
            name: "Movie", columns: [
                { name: "ID", type: "integer" },
                { name: "Title", type: "variable-length string" },
                { name: "Genre", type: "variable-length string" },
                { name: "RatingCode", type: "variable-length string" },
                { name: "Year", type: "integer" },
            ]
        }],
        question: "Write a SQL statement to modify the Movie table to make the ID column the primary key.",
        correctQuery: "ALTER TABLE Movie\nADD PRIMARY KEY(ID);",
        defaultQuery: "ALTER TABLE Movie\nADD -- Add the primary key constraint to the ID column;"
    },
    {
        id: 7,
        title: "8.7 Practice Lab 7",
        category: "DDL - ALTER TABLE",
        schema: [
            { name: "Movie", columns: [
                { name: "ID", type: "integer", description: "primary key" },
                { name: "Title", type: "variable-length string" },
                { name: "Genre", type: "variable-length string" },
                { name: "RatingCode", type: "variable-length string" },
                { name: "Year", type: "integer" },
            ]},
            { name: "YearStats", columns: [
                { name: "Year", type: "integer" },
                { name: "TotalGross", type: "bigint unsigned" },
                { name: "Releases", type: "integer" },
            ]}
        ],
        question: "Write a SQL statement to designate the Year column in the Movie table as a foreign key to the Year column in the YearStats table.",
        correctQuery: "ALTER TABLE Movie\nADD FOREIGN KEY (Year) REFERENCES YearStats(Year);",
        defaultQuery: "ALTER TABLE Movie\nADD FOREIGN KEY ( -- local column -- ) REFERENCES -- foreign_table(column) --;"
    },
    {
        id: 8,
        title: "8.8 Practice Lab 8",
        category: "DDL - CREATE INDEX",
        schema: [{
            name: "Movie", columns: [
                { name: "ID", type: "integer", description: "primary key" },
                { name: "Title", type: "variable-length string" },
                { name: "Genre", type: "variable-length string" },
                { name: "RatingCode", type: "variable-length string" },
                { name: "Year", type: "integer" },
            ]
        }],
        question: "Write a SQL statement to create an index named idx_year on the Year column of the Movie table.",
        correctQuery: "CREATE INDEX idx_year\nON Movie(Year);",
        defaultQuery: "CREATE INDEX -- index_name\nON -- table_name(column_name);"
    },
    {
        id: 9,
        title: "8.9 Practice Lab 9",
        category: "DML - INSERT",
        schema: [{
            name: "Movie", columns: [
                { name: "ID", type: "integer", description: "primary key, auto-increment" },
                { name: "Title", type: "variable-length string" },
                { name: "Genre", type: "variable-length string" },
                { name: "RatingCode", type: "variable-length string" },
                { name: "Year", type: "integer" },
            ]
        }],
        question: "The following data needs to be added to the Movie table:\n- Title: Pride and Prejudice\n- Genre: Romance\n- RatingCode: G\n- Year: 2005\n\nWrite a SQL statement to insert the indicated data into the Movie table.",
        correctQuery: "INSERT INTO Movie (Title, Genre, RatingCode, Year)\nVALUES ('Pride and Prejudice', 'Romance', 'G', 2005);",
        defaultQuery: "INSERT INTO Movie (Title, Genre, RatingCode, Year)\nVALUES ( -- Provide values for 'Pride and Prejudice', 'Romance', 'G', 2005 -- );"
    },
    {
        id: 10,
        title: "8.10 Practice Lab 10",
        category: "DML - DELETE",
        schema: [{
            name: "Movie", columns: [
                { name: "ID", type: "integer", description: "primary key" },
                { name: "Title", type: "variable-length string" },
                { name: "Genre", type: "variable-length string" },
                { name: "RatingCode", type: "variable-length string" },
                { name: "Year", type: "integer" },
            ]
        }],
        question: "Write a SQL statement to delete the row with the ID value of 3 from the Movie table.",
        correctQuery: "DELETE FROM Movie\nWHERE ID = 3;",
        defaultQuery: "DELETE FROM Movie\nWHERE -- Add condition to delete row with ID = 3 -- ;"
    },
    {
        id: 11,
        title: "8.11 Practice Lab 11",
        category: "DML - UPDATE",
        schema: [{
            name: "Movie", columns: [
                { name: "ID", type: "integer", description: "primary key" },
                { name: "Title", type: "variable-length string" },
                { name: "Genre", type: "variable-length string" },
                { name: "RatingCode", type: "variable-length string" },
                { name: "Year", type: "integer" },
            ]
        }],
        question: "Write a SQL statement to update the Year value to be 2022 for all movies with a Year value of 2020.",
        correctQuery: "UPDATE Movie\nSET Year = 2022\nWHERE Year = 2020;",
        defaultQuery: "UPDATE Movie\nSET -- Set Year = 2022\nWHERE -- Add condition for movies with Year = 2020 -- ;"
    },
    {
        id: 12,
        title: "8.12 Practice Lab 12",
        category: "DQL - SELECT",
        schema: [{
            name: "Movie", description: "The database contains a table named Movie.", columns: []
        }],
        question: "Write a SQL query to return all data from the Movie table without directly referencing any column names.",
        correctQuery: "SELECT *\nFROM Movie;",
        defaultQuery: "SELECT -- Select all columns\nFROM -- Specify the table -- ;"
    },
    {
        id: 13,
        title: "8.13 Practice Lab 13",
        category: "DQL - WHERE",
        schema: [{
            name: "Movie", columns: [
                { name: "ID", type: "integer", description: "primary key" },
                { name: "Title", type: "variable-length string" },
                { name: "Genre", type: "variable-length string" },
                { name: "RatingCode", type: "variable-length string" },
                { name: "Year", type: "integer" },
            ]
        }],
        question: "Write a SQL query to retrieve the Title and Genre values for all records in the Movie table with a Year value of 2020. Ensure your result set returns the columns in the order indicated.",
        correctQuery: "SELECT Title, Genre\nFROM Movie\nWHERE Year = 2020;",
        defaultQuery: "SELECT -- Select Title and Genre\nFROM Movie\nWHERE -- Filter for Year = 2020 -- ;"
    },
    {
        id: 14,
        title: "8.14 Practice Lab 14",
        category: "DQL - ORDER BY",
        schema: [{
            name: "Movie", columns: [
                { name: "ID", type: "integer", description: "primary key" },
                { name: "Title", type: "variable-length string" },
                { name: "Genre", type: "variable-length string" },
                { name: "RatingCode", type: "variable-length string" },
                { name: "Year", type: "integer" },
            ]
        }],
        question: "Write a SQL query to display all Title values in alphabetical order A–Z.",
        correctQuery: "SELECT Title\nFROM Movie\nORDER BY Title ASC;",
        defaultQuery: "SELECT Title\nFROM Movie\nORDER BY -- Order by Title alphabetically -- ;"
    },
    {
        id: 15,
        title: "8.15 Practice Lab 15",
        category: "DQL - GROUP BY",
        schema: [{
            name: "Movie", columns: [
                { name: "ID", type: "integer", description: "primary key" },
                { name: "Title", type: "variable-length string" },
                { name: "Genre", type: "variable-length string" },
                { name: "RatingCode", type: "variable-length string" },
                { name: "Year", type: "integer" },
            ]
        }],
        question: "Write a SQL query to output the unique RatingCode values and the number of movies with each rating value from the Movie table as RatingCodeCount. Sort the results by the RatingCode in alphabetical order A–Z. Ensure your result set returns the columns in the order indicated.",
        correctQuery: "SELECT RatingCode, COUNT(*) AS RatingCodeCount\nFROM Movie\nGROUP BY RatingCode\nORDER BY RatingCode ASC;",
        defaultQuery: "SELECT -- Select RatingCode and count of movies as RatingCodeCount\nFROM Movie\nGROUP BY -- Group by RatingCode\nORDER BY -- Order by RatingCode alphabetically -- ;"
    },
    {
        id: 16,
        title: "8.16 Practice Lab 16",
        category: "DQL - JOINs",
        schema: [
            { name: "Movie", columns: [
                { name: "ID", type: "integer", description: "primary key" },
                { name: "Title", type: "variable-length string" },
                { name: "Genre", type: "variable-length string" },
                { name: "RatingCode", type: "variable-length string" },
                { name: "Year", type: "integer" },
            ]},
            { name: "YearStats", columns: [
                { name: "Year", type: "integer" },
                { name: "TotalGross", type: "bigint unsigned" },
                { name: "Releases", type: "integer" },
            ]}
        ],
        question: "Write a SQL query to display both the Title and the TotalGross (if available) for all movies. Ensure your result set returns the columns in the order indicated.",
        correctQuery: "SELECT Title, TotalGross\nFROM Movie\nLEFT JOIN YearStats ON Movie.Year = YearStats.Year;",
        defaultQuery: "SELECT -- Select Title and TotalGross\nFROM Movie\nLEFT JOIN YearStats ON -- Join condition on the Year column -- ;"
    },
    {
        id: 17,
        title: "8.17 Practice Lab 17",
        category: "DQL - Aggregates",
        schema: [{
            name: "Movie", columns: [
                { name: "ID", type: "integer", description: "primary key" },
                { name: "Title", type: "variable-length string" },
                { name: "Genre", type: "variable-length string" },
                { name: "RatingCode", type: "variable-length string" },
                { name: "Year", type: "integer" },
            ]
        }],
        question: "Write a SQL query to return how many movies have a Year value of 2019.",
        correctQuery: "SELECT COUNT(*) AS TotalMovies\nFROM Movie\nWHERE Year = 2019;",
        defaultQuery: "SELECT COUNT(*) -- Count all movies\nFROM Movie\nWHERE -- Filter for Year = 2019 -- ;"
    }
];