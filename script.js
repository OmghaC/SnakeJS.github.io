//Get canvas placer in DOM
const canvasPlacer = document.getElementById("canvas_placer");

//Init player and first apple
let playerObj = CreatePlayer(1,1);
let appleObj = CreateApple(Math.floor(randomNumber(0,9)), Math.floor(randomNumber(0,9)), true);

//Obvious
let appleExist = true;

//How many times screen was rendered
let render_counter = 0;

//Direction section
let actualDir = "d";
let nextDir = null;

//Snake tail
let tail = []

//Generating random number in range
function randomNumber(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Create simple object not only for player.
function CreatePlayer(new_X, new_Y)
{
    let obj = {
        x : new_X,
        y : new_Y,
        getCoords : function()
        {
            return "X:" + this.x + " Y:" + this.y;
        }
    }
    return obj;
}

function CreateApple(new_X, new_Y, _created)
{
    let obj = {
        x : new_X,
        y : new_Y,
        created : _created,
        moveToRandomPos : function()
        {
            this.x = randomNumber(0,9);
            this.y = randomNumber(0,9);
        },
        checkForCollision: function()
        {
            let collision = false;
            for(i = 0; i <= tail.length-1; i++)
            {
                if(tail[i].x == this.x && tail[i].y == this.y)
                {
                    collision = true;
                }
                if(i == tail.length-1)
                {
                    console.log("test");
                    let offsetX;
                    let offsetY;
                    switch(actualDir)
                    {
                        case "s":
                            offsetX = 0;
                            offsetY = -1;
                            break;
                        case "w":
                            offsetX = 0;
                            offsetY = 1;
                            break;
                        case "a":
                            offsetX = 1;
                            offsetY = 0;
                            break;
                        case "d":
                            offsetX = -1;
                            offsetY = 0;
                            break;
                    }
                    let X_test = playerObj.x;
                    let Y_test = playerObj.y;
                    X_test += offsetX;
                    Y_test += offsetY;
                    if(this.x == X_test && this.y == Y_test)
                    {
                        collision = true;
                    }
                }
            }
            if(collision == false)
            {
                this.created = true;
            }
        },
        getCoords : function()
        {
            return "X:" + this.x + " Y:" + this.y;
        }
    }
    return obj;
}


function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(cname, cvalue, days) {
    var d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

//Keypress listener
document.onkeypress = function (e) {
    directionResolver(e.key)
};


//Function to check if you press correct key, ex. You can't press a, if you are moving towards right.
function directionResolver(key)
{
    let new_array = Array.from("wdsa");
    switch(actualDir)
    {
        case "w":
            new_array.splice(2,1);
            break;
        case "d":
            new_array.splice(3,1);
            break;
        case "s":
            new_array.splice(0,1);
            break;
        case "a":
            new_array.splice(1,1);
            break;
    }
    if(new_array.includes(key))
    {
        nextDir = key;
    }
}

function checkForCollisionWithTail()
{
    for(i = 0; i <= tail.length-1; i++)
    {
        if(playerObj.x == tail[i].x && playerObj.y == tail[i].y )
        {
            clearInterval(main_clock);
            CreateScoreBoard()
        }
    }
}

function createTailObject()
{
        let offsetX;
        let offsetY;
        switch(actualDir)
        {
            case "s":
                offsetX = 0;
                offsetY = -1;
                break;
            case "w":
                offsetX = 0;
                offsetY = 1;
                break;
            case "a":
                offsetX = 1;
                offsetY = 0;
                break;
            case "d":
                offsetX = -1;
                offsetY = 0;
                break;
        }
        tail.push(CreatePlayer(playerObj.x + offsetX, playerObj.y + offsetY));
}

function tailManagment()
{
    if(tail.length != 0)
    {
        tail.splice(0,1);
        createTailObject();
    }
        
}

function CreateScoreBoard()
{
    setCookie("LatestScore", tail.length, 31);
    let latestScore = tail.length;
    
    if(latestScore > getCookie("HighScore"))
    {
        setCookie("HighScore", latestScore, 365);
    }
    else if(getCookie("HighScore") == "")
    {
        setCookie("HighScore", latestScore, 365);
    }
    
    let scoreBoard_conatiner = document.createElement('div');
    scoreBoard_conatiner.innerHTML = "<p>Your score: " + tail.length + "<br>"+ "Your highscore: " + getCookie("HighScore") + "</p><br><p>Press f5 to restart!</p>";
    scoreBoard_conatiner.style.fontSize = "52px";
    document.body.insertBefore(scoreBoard_conatiner, canvasPlacer)
}

//Function which moves our player object, and checking for collision with wall and apples
function directionAnalyzer(dir)
{
    actualDir = dir;

    if(playerObj.x > 9 || playerObj.x < 0 || playerObj.y > 9 || playerObj.y < 0)
    {
        clearInterval(main_clock);
        CreateScoreBoard();
    }

    if(dir == "d")
    {
        playerObj.x += 1;
    }
    else if(dir == "a")
    {
        playerObj.x -= 1;
    }
    else if(dir == "s")
    {
        playerObj.y += 1;
    }
    else if(dir == "w")
    {
        playerObj.y -= 1;
    }
    
    if(playerObj.x == appleObj.x && playerObj.y == appleObj.y)
    {
        appleObj.created = false;
        while(appleObj.created == false)
        {
            appleObj.moveToRandomPos();
            appleObj.checkForCollision();
        }
        
        createTailObject();
    }
}

//Function for rendering a line
function render_line(ctx_)
{
    for(i=100; i < 1000; i += 100)
    {
        ctx_.moveTo(i, 0);
        ctx_.lineTo(i, 1000);
        ctx_.stroke();
        for(j = 100; j <= 1000; j += 100)
        {
            ctx_.moveTo(0, j);
            ctx_.lineTo(1000, j);
            ctx_.stroke();
        }
    }
}

//Function which create new canvas object.
function createNewCanvas()
{
    let new_canvas = document.createElement('canvas');
    new_canvas.style.border = "1px solid black";
    new_canvas.width = 1000;
    new_canvas.height = 1000;
    return new_canvas;
}

function render_segments(ctx_)
{
    let offsetXY = 2;
    let cubeSizeXY = 96;
    ctx_.fillStyle = "#000000";
    for(i = 0; i <= tail.length-1; i++)
    {
        ctx_.fillRect((tail[i].x * 100) + offsetXY,(tail[i].y * 100) + offsetXY, cubeSizeXY, cubeSizeXY);
    }
}

//Function for rendering a player object
function render_player(ctx_)
{
    let offsetXY = 2;
    let cubeSizeXY = 96;
    ctx_.fillStyle = "#000000";
    ctx_.fillRect((playerObj.x * 100) + offsetXY,(playerObj.y * 100) + offsetXY, cubeSizeXY, cubeSizeXY);
}

//Function for rendering an apple
function render_apple(ctx_)
{
    let offsetXY = 2;
    let cubeSizeXY = 96;
    ctx_.fillStyle = "#FF0000";
    ctx_.fillRect((appleObj.x * 100) + offsetXY,(appleObj.y * 100) + offsetXY, cubeSizeXY, cubeSizeXY);
}

//Main function
function render_whole()
{
    //Check if canvas was rendered at least one time
    if(render_counter != 0)
    {
        let old_canvas = document.querySelector('canvas');
        old_canvas.parentNode.removeChild(old_canvas);
    }
    
    let canvas = createNewCanvas(); 
    document.body.insertBefore(canvas, canvasPlacer);

    //Moving and rendering
    directionAnalyzer(nextDir);
    tailManagment();
    checkForCollisionWithTail();
    render_line(canvas.getContext("2d"));
    render_apple(canvas.getContext("2d"));
    render_player(canvas.getContext("2d"));
    if(tail.length != 0) render_segments(canvas.getContext("2d"));
    
    
    render_counter += 1;
}


let main_clock = setInterval(render_whole, 300);