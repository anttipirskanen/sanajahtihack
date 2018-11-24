$.get('https://raw.githubusercontent.com/anttipirskanen/sanajahtihack/master/kotus-sanalista_v1.xml',  data => {
    start($.parseXML(data));

    $('#new-game-btn').click( e => {
        location.reload();
    });  

});

function start(xmlData) {
    //var letters = prompt("Insert letters without spaces");
    var letters = 'axxnaknexkoxxxxx';
    console.log(letters, xmlData);
    if(letters == null) 
        return false;
    
    var letterMatrix = () => {
        var arr = letters.split('');
        var matrix = [];
        var row = [];
        for(var  i = 0; i < arr.length; i++) {
            if(i == 4 || i == 8 || i == 12  ) {
                matrix.push(row);
                row = [];
            }
            row.push(arr[i]);
            if(i == arr.length -1) {
                matrix.push(row);
            }
        }
        return matrix;
    }

    var count = 0;
    console.log('Processing....');
    $(xmlData).find('kotus-sanalista').find('st').each((index, item) => {
        var word =  $(item).find('s').text().split('');
        if(findWord(word, letters)) {
            var coordinates = findWordPath(word, 0, letterMatrix(), null, null);
            console.log(coordinates);
            if(coordinates) {
                count ++;
                $('#word-list').append('<li>'+word.join('')+'</li>');
            }
        }

        return false;
     });
     console.log('DONE! ' + count + ' words found');
}

function findWord(word, letters) {
    var letters = JSON.parse(JSON.stringify(letters));
    for(var i = 0; i < word.length; i++) {
        if(letters.indexOf(word[i]) == -1)
            return false;
        
        letters = letters.replace(word[i], '');
    }
    return true;    
}

//TODO if multiple instances of letter is found, pass state as parameter and call recursively with its contents as fallback instead of returning false.
//If fallback param is empty, return false
function findWordPath(word, letterIndex, letterMatrix, coords, usedCoords) {
    if(!usedCoords) {
        usedCoords = [];
    }
    try {
        //find first letter
        if(!coords) {
            for(var x = 0; x < letterMatrix.length; x++) {
                for(var y = 0; y < letterMatrix[x].length; y++) {
                    if(letterMatrix[x][y] == word[letterIndex]) {
                        return findWordPath(word, letterIndex + 1, letterMatrix, {x:x, y:y}, [{x:x, y:y}]);
                    }
                    else {
                        return false; 
                    }
                }
            }
        }
        else {
            var x = coords.x;
            var y = coords.y;
            
            var testCoords = [
                {x: x-1, y:y-1},
                {x: x, y:y-1},
                {x: x+1, y:y-1},
                {x: x+1, y:y},
                {x: x+1, y:y+1},
                {x: x, y:y+1},
                {x: x-1, y:y-1},
                {x: x-1, y:y},
            ];

            for(var i = 0; i < testCoords.length; i++) {
                var ignoreCoords = false;
     
                for(var j = 0; j < usedCoords.length; j++) {
                    if(usedCoords[j].x == testCoords[i].x && usedCoords[j].y == testCoords[i].y) {
                        ignoreCoords = true;
                    }
                }
                
                var found = false;
                //if coordinates are already used, ignore them
                if(!ignoreCoords) {
                    found = checkCharAt(word[letterIndex], testCoords[i].x, testCoords[i].y, letterMatrix);
                } 

                //Entire word is found, return char coordinates
                if(found && (letterIndex == word.length-1)) {
                    console.log('FOUND', usedCoords);
                    return usedCoords;
                }
                //Char is found, lets see if we can find next one
                else if(found) {
                    coords = {x : testCoords[i].x, y: testCoords[i].y};
                    usedCoords.push(coords);
                    return findWordPath(word, letterIndex+1, letterMatrix, coords, usedCoords);
                }
            }
            return false;
        }
    }
    catch(err) {
        console.log(err);
        return false;
    }
}

function checkCharAt(char, y, x, matrix) {
    try { 
        if(matrix[x][y] == char) {
            return true;
        }
        return false;
    }
    catch(err) {
        //Out of bounds
        return false;
    }
}

var letters = [
    ['A', 'X', 'X', 'N'],
    ['A', 'K', 'N', 'E'],
    ['X', 'K', 'O', 'X'],
    ['X', 'X', 'X', 'X'],
];












