# iTunes_app

This is a command line itunes application using node and postgreSQL Database
  - Dependencies: pg and inquirer

  - Create a database called itunes using postgreSQL .

  - A pre-populated songs table (pre-populated)
      - Columns: id, song_title, song_artist
  - A users table
      - Columns: id, name, username, password
  - A pivot table which stores what songs people have bought
      - Columns: id, song_id, user_id

  - I used Inquirer to set up Sign in/Sign Up prompts, buy songs, and view song purchases.
    - The sign in should check username and password.
    - If the username is not in the database, then you can tell the client to sign up and close the connection.
    - If the username is in the database, then prompt them to enter their password.

  - App Flow:
    - 1. Sign In (If you are a current user) or Sign up as a new user.
    - 2. Buy a song or View Purchased songs.
        - Initially all users have no songs so you will need to purchase one after sign in.
    - 3. Buy songs will prompt a list of available songs. Select one and you bought it!
    - 4. After Purchase of songs you will be prompted to view the songs you bought.
    - 5. Select View Purchased Songs and you will see what you have bought and the bought_songs table
         will update. 
