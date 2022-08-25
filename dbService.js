//ACCESSING MYSQL
const mysql = require('mysql');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();

//CREATING A MYSQL CONNECTION
const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});

// SPECIFYING IF CONNECTION TO OUR DATABASE IS SUCCESSFUL OR UNSUCCESSFUL
connection.connect((err) => {
    if (err) {
        console.log(err.message);
    }
    console.log('AWS is LIT')
});


//STATIC IS SO THERE'S ONE INSTANCE OF THIS FUNCTION THAT IS SHARED BY ALL OBJECTS OF CLASS
class DbService {
    static getDbServiceInstance() {
        // IF INSTANCE IS NOT NULL RETURN OBJECT CREATED, IF IS NULL RETURN A NEW INSTANCE OF DBSERVICE
        return instance ? instance : new DbService();
    }

    async getAllData() {
        //IF QUERY IS SUCCESSFUL WE RESOLVE IT, IF NOT WE REJECT, THE REJECT WILL GO INTO CATCH BLOCK AND WE'LL HANDLE
        try {
            const response = await new Promise((resolve, reject) => {

                 //WRITING OUR SQL QUERY
                //EXAMPLE OF CONNECTION QUERY WITH CONDITION: const query = "SELECT * FROM names WHERE id = ?"
                const query = "SELECT * FROM names;";

                 //EXAMPLE CONT.: connection.query(query, [id])
                //IF QUERY IS UNSUCCESSFUL THE ERROR.MESSAGE WILL BE CAUGHT BY OUR CATCH BLOCK
                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            // console.log(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    }


    async insertNewName(name) {
        try {
            const dateAdded = new Date();
            const insertId = await new Promise((resolve, reject) => {

                //WRITING OUR SQL QUERY
                //EXAMPLE OF CONNECTION QUERY WITH CONDITION: const query = "SELECT * FROM names WHERE id = ?"
                const query = "INSERT INTO names (name, date_added) VALUES (?,?);";

                 //EXAMPLE CONT.: connection.query(query, [id])
                //IF QUERY IS UNSUCCESSFUL THE ERROR.MESSAGE WILL BE CAUGHT BY OUR CATCH BLOCK
                connection.query(query, [name, dateAdded] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                })
            });
            //FOR OUR INSERT FUNCTION, WHEN ADDING A NEW NAME, WE NEED THE NAME DATE AND ID ADDED SO WE RETURN AN OBJECT WITH THOSE VALUES
            return {
                id : insertId,
                name : name,
                dateAdded : dateAdded
            };
        } catch (error) {
            console.log(error);
        }
    }

    async deleteRowById(id) {
        try {
            id = parseInt(id, 10); 
            const response = await new Promise((resolve, reject) => {

            //WRITING OUR SQL QUERY
            //EXAMPLE OF CONNECTION QUERY WITH CONDITION: const query = "SELECT * FROM names WHERE id = ?"
                const query = "DELETE FROM names WHERE id = ?";
                
                //EXAMPLE CONT.: connection.query(query, [id])
                //IF QUERY IS UNSUCCESSFUL THE ERROR.MESSAGE WILL BE CAUGHT BY OUR CATCH BLOCK
                connection.query(query, [id] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
            
            //IF RESPONSE IS EQUAL 1 RETURN TRUE, OTHERWISE RETURN FALSE, THIS SHOULD ALWAYS RETURN 1 BECAUSE IT SHOULD ALWAYS HAVE 1 AFFECTED ROW
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async updateNameById(id, name) {
        try {
            id = parseInt(id, 10); 
            const response = await new Promise((resolve, reject) => {

            //WRITING OUR SQL QUERY
            //EXAMPLE OF CONNECTION QUERY WITH CONDITION: const query = "SELECT * FROM names WHERE id = ?"
                const query = "UPDATE names SET name = ? WHERE id = ?";
                
                //EXAMPLE CONT.: connection.query(query, [id])
                //IF QUERY IS UNSUCCESSFUL THE ERROR.MESSAGE WILL BE CAUGHT BY OUR CATCH BLOCK
                connection.query(query, [name, id] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
    
            //IF RESPONSE IS EQUAL 1 RETURN TRUE, OTHERWISE RETURN FALSE, THIS SHOULD ALWAYS RETURN 1 BECAUSE IT SHOULD ALWAYS HAVE 1 AFFECTED ROW
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    
}

// EXPORTING MODULE(FILE) IN ORDER TO USE THE FUNCTIONS OF THIS MODULE IN OTHER MODULES
module.exports = DbService;