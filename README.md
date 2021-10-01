# Endless Asteroids

This is a game built using using Phaser. It's an endless runner take on
the 80s game asteroids.


![Screenshot of the game](/screenshot.png)

## How to download/play

### Step One
First off, you'll just need to clone into wherever you'd like on your computer

```
git clone https://github.com/benrutter/endless-asteroids.git
```

### Step Two
Because phaser requires a simple server in order to serve up static files to the game, you'll need to set up a simple server. You can do this with python or node.

**Python** comes with a simple http server by default, so open up the command line, navigate to the game folder (the 'endless-asteroids' folder inside this git repo) and run:
```
python -m http.server 8080
```

**Node** has a bunch of simple server options, but the easiest is (http-server)[https://www.npmjs.com/package/http-server]. Install is globally with:
```
npm install --global http-server
```
then run:
```
http-server home/wherever/you/cloned/the/repo/endless-asteroids/endless-asteroids/
```

### Step Three

Now you're good to go! Just navigate any browser to "localhost:8080" and the start screen should appear!
