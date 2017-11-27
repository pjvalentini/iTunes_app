/*
Create a database called itunes.

Have 3 tables:
A pre-populated songs table - DONE
Columns: id, song_title, song_artist - DONE
A users table - DONE
Columns: id, name, username, password - DONE
A pivot table which stores what songs people have bought - DONE
Columns: id, song_id, user_id - DONE
Pre-populate a songs table. - DONE
Start off with Inquirer: This is where you will create your username if it does not exist in the database
Inquirer should prompt: Sign Up/Sign in - DONE
The sign in should check username and password. - DONE
If the username is not in the database, then you can tell the client to sign up and close the connection. - DONE
If the username is in the database, then prompt them to enter their password. - DONE
If the password matches the user's account, then prompt them either: - DONE
If they would like to add a song - DONE
Have it prompt what songs are available - DONE
Ask them what song they would like to add - DONE
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

var signUp = () => {
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
					signUp();
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
		var runSignIn = () =>	{
			pgClient.query(`SELECT * FROM users WHERE username='${res.username}'`, (err, result) => {
				// console.log(res);
				// if (err) {
				// 	console.log(err);
				// }
				if (result.rows.length > 0) {
					if (result.rows[0].password === res.password) {
						console.log('Welcome to iTunes ' + result.rows[0].name);
						var goBack = () => {
							inquirer.prompt([
								{
									type: 'list',
									message: 'Please Choose?',
									choices: ['View Purchased Songs', 'Buy Songs'],
									name: 'selection',
								},
							]).then(function(resTwo) {
									// console.log(resTwo);
								if (resTwo.selection === 'View Purchased Songs') {
									console.log('Welcome ' + result.rows[0].name + '. Here are your purchased songs!');
									pgClient.query('SELECT songs.song_name FROM songs INNER JOIN bought_songs ON bought_songs.song_id=songs.id WHERE bought_songs.user_id=' + result.rows[0].id, (error, queryResTwo) => {
										// console.log(queryResTwo);
										// if (error) {
										// 	console.log(error);
										// }
										if (queryResTwo.rows.length > 0) {
											for (var i = 0; i < queryResTwo.rows.length; i++) {
											console.log((i + 1) + ". " + queryResTwo.rows[i].song_name);
											}
											goBack();
										} else {
											console.log("You dont have any songs yet!");
											goBack();
										}
									});
								} else {
									pgClient.query('SELECT * FROM songs', (errorThree, queryResThree) => {
										// console.log(queryResThree);
										// if (errorThree) {
										// 	console.log(errorThree);
										// }
										var songs = [];
										queryResThree.rows.forEach((songList) => {
											songs.push(songList.id + ". " + songList.song_name + " - " + songList.song_artist);
										});
										inquirer.prompt([
											{
												type: 'list',
												message: 'Please choose a song',
												choices: songs,
												name: 'song',
											},
										]).then((songs_list) => {
												// console.log(songs_list);
												var song_id;
												queryResThree.rows.forEach((songList) => {
													if (songList.song_name === songs_list.song_name) {
														song_id = songList.id;
														console.log(song_id);
													}
												});
												pgClient.query("INSERT INTO bought_songs (song_id, user_id) VALUES ($1, $2)", [result.rows[0].id, song_id], (errFour, resFour) => {
													// console.log(resFour);
													// if (errFour) throw (errFour);
													console.log("You bought a song!");
										    	goBack();
												});
										});
									});
								}
							});
						};
						goBack();
					} else {
						console.log('incorrect Password!');
						signUp();
					}
				} else {
					console.log('username does not exist!');
					signUp();
				}
			 });
			};
		 	runSignIn();
		 });
		}
	});
};
signUp();
