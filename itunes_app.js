/*
Create a database called itunes.

Have 3 tables:
A pre-populated songs table
Columns: id, song_title, song_artist
A users table
Columns: id, name, username, password
A pivot table which stores what songs people have bought
Columns: id, song_id, user_id
Pre-populate a songs table.
Start off with Inquirer: This is where you will create your username if it does not exist in the database
Inquirer should prompt: Sign Up/Sign in
The sign in should check username and password.
If the username is not in the database, then you can tell the client to sign up and close the connection.
If the username is in the database, then prompt them to enter their password.
If the password matches the user's account, then prompt them either:
If they would like to add a song
Have it prompt what songs are available
Ask them what song they would like to add
Check the songs that they have
Get their songs from the database
Bonus

Create a bank table:
id, balance, user_id
Every time a user account is created, a bank record is created for that user
Add a column to your songs table called 'amount' which will be an INT and give each song a price
When the user add's a song, have it deduce the amount that the song is priced at from the user's balance in the bank table.
*/

// set up our modules to require.
var pg = require("pg");
var inquirer = require("inquirer");

// picking a DB to connect to using env. variables.
var dbUrl = {
	user: process.argv.POSTGRES_USER,
	password: process.argv.POSTGRES_PASSWORD,
	database: 'itunes_app.',
	host: "localhost",
	port: 5432,
};

// Create a client to connect to.
var pgClient = new pg.Client(dbUrl);

// Officially connnecting to the itunes_app. database.
pgClient.connect();

/* <------------------------------------------------------------------> */
console.log('Welcome to itunes!');

// Check to see if users can sign in or need to sign up.
inquirer.prompt([
	{
		type: 'list',
		message: 'Sign Up/Sign In',
		choices: ['Sign Up', 'Sign In'],
		name: 'sign_choice',
	},
]).then((sign) => {
	// console.log(sign);
	if (sign.sign_choice === "Sign Up") {
		console.log("Welcome to iTunes");
		inquirer.prompt([
			{
				type: 'input',
				message: 'What is your name?',
				name: 'name',
			},
			{
				type: 'input',
				message: 'What is your username?',
				name: 'username',
			},
			{
				type: 'password',
				message: 'What is your password?',
				name: 'password',
			},
		]).then((signup) => {
			// console.log(signup);
			pgClient.query('INSERT INTO users (name, username, password) VALUES ($1, $2, $3)', [signup.name, signup.username, signup.password], (err, result) => {
				// console.log(result);
				// if (err) {
				// 	console.log(err);
				// }
				console.log('Thank you for signing up. Please sign in now');
			});
		});
	} else {
		inquirer.prompt([
			{
				type: "input",
				message: "What is your username?",
				name: "username",
			},
			{
				type: "password",
				message: "What is your password?",
				name: "password",
			},
		]).then((res) => {
			// console.log(res);
			// if (err) {
			// 	console.log(err);
			// }
		pgClient.query(`SELECT * FROM users WHERE username='${res.username}'`, (err, result) => {
			if (result.rows.length > 0) {
				if (result.rows[0].password === res.password) {
					console.log('Welcome to iTunes ' + result.rows[0].name);
				} else {
					console.log('incorrect Password!');
					pgClient.end();
				}
			} else {
				console.log('username does not exist!');
				pgClient.end();
			}
		});
	 });
	}
});
