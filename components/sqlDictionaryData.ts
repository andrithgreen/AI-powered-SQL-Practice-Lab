export interface Command {
    name: string;
    description: string;
    syntax: string;
}

export interface CommandCategory {
    category: string;
    description: string;
    commands: Command[];
}

export const SQL_COMMANDS: CommandCategory[] = [
    {
        category: "Data Definition Language (DDL)",
        description: "Commands that define and manage database objects.",
        commands: [
            {
                name: "CREATE TABLE",
                description: "Creates a new table in the database.",
                syntax: "CREATE TABLE table_name (\n  column1 datatype constraint,\n  ...\n);"
            },
            {
                name: "ALTER TABLE",
                description: "Adds, deletes, or modifies columns in an existing table.",
                syntax: "ALTER TABLE table_name\nADD column_name datatype;"
            },
            {
                name: "DROP TABLE",
                description: "Deletes an existing table in the database.",
                syntax: "DROP TABLE table_name;"
            },
            {
                name: "CREATE INDEX",
                description: "Creates an index on a table to speed up searches.",
                syntax: "CREATE INDEX index_name\nON table_name (column1, ...);"
            },
            {
                name: "CREATE VIEW",
                description: "Creates a virtual table based on the result-set of an SQL statement.",
                syntax: "CREATE VIEW view_name AS\nSELECT column1, column2\nFROM table_name\nWHERE condition;"
            },
            {
                name: "NOT NULL",
                description: "Ensures that a column cannot have a NULL value.",
                syntax: "column_name datatype NOT NULL"
            },
            {
                name: "DEFAULT",
                description: "Provides a default value for a column when none is specified.",
                syntax: "column_name datatype DEFAULT 'default_value'"
            },
             {
                name: "CHECK",
                description: "Ensures that the values in a column satisfy a specific condition.",
                syntax: "column_name datatype CHECK (condition)"
            },
            {
                name: "PRIMARY KEY",
                description: "A constraint that uniquely identifies each record in a table.",
                syntax: "column_name datatype PRIMARY KEY"
            },
            {
                name: "FOREIGN KEY",
                description: "A key used to link two tables together.",
                syntax: "FOREIGN KEY (column_name)\nREFERENCES other_table(other_column)"
            }
        ]
    },
    {
        category: "Data Manipulation Language (DML)",
        description: "Commands for inserting, updating, and deleting data.",
        commands: [
            {
                name: "INSERT INTO",
                description: "Inserts new records into a table.",
                syntax: "INSERT INTO table_name (column1, column2)\nVALUES (value1, value2);"
            },
            {
                name: "UPDATE",
                description: "Modifies existing records in a table.",
                syntax: "UPDATE table_name\nSET column1 = value1\nWHERE condition;"
            },
            {
                name: "DELETE",
                description: "Deletes existing records in a table.",
                syntax: "DELETE FROM table_name\nWHERE condition;"
            }
        ]
    },
    {
        category: "Data Query Language (DQL)",
        description: "Command used to retrieve data from the database.",
        commands: [
            {
                name: "SELECT",
                description: "Extracts data from a database.",
                syntax: "SELECT column1, column2\nFROM table_name\nWHERE condition;"
            },
            {
                name: "BETWEEN",
                description: "Selects values within a given range. The values can be numbers, text, or dates.",
                syntax: "SELECT column_name(s)\nFROM table_name\nWHERE column_name BETWEEN value1 AND value2;"
            },
             {
                name: "JOIN",
                description: "Combines rows from two or more tables, based on a related column.",
                syntax: "SELECT columns\nFROM table1\nINNER JOIN table2\nON table1.column = table2.column;"
            },
            {
                name: "GROUP BY",
                description: "Groups rows that have the same values into summary rows.",
                syntax: "SELECT COUNT(column_name), column_name\nFROM table_name\nGROUP BY column_name;"
            },
            {
                name: "ORDER BY",
                description: "Sorts the result-set in ascending or descending order.",
                syntax: "SELECT column1, column2\nFROM table_name\nORDER BY column1 ASC;"
            }
        ]
    },
    {
        category: "Aggregate Functions",
        description: "Functions that perform a calculation on a set of values and return a single value.",
        commands: [
            {
                name: "COUNT()",
                description: "Returns the number of rows that matches a specified criterion.",
                syntax: "SELECT COUNT(column_name)\nFROM table_name\nWHERE condition;"
            },
            {
                name: "SUM()",
                description: "Returns the total sum of a numeric column.",
                syntax: "SELECT SUM(column_name)\nFROM table_name\nWHERE condition;"
            },
            {
                name: "AVG()",
                description: "Returns the average value of a numeric column.",
                syntax: "SELECT AVG(column_name)\nFROM table_name\nWHERE condition;"
            },
            {
                name: "MIN()",
                description: "Returns the smallest value of the selected column.",
                syntax: "SELECT MIN(column_name)\nFROM table_name\nWHERE condition;"
            },
            {
                name: "MAX()",
                description: "Returns the largest value of the selected column.",
                syntax: "SELECT MAX(column_name)\nFROM table_name\nWHERE condition;"
            }
        ]
    }
];