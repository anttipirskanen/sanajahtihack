$.get('https://raw.githubusercontent.com/anttipirskanen/sanajahtihack/master/kotus-sanalista_v1.xml',  data => {
    start($.parseXML(data));

    $('#new-game-btn').click( e => {
        location.reload();
    });  

});

function start(xmlData) {
    //var letters = prompt("Insert letters without spaces");
    var letters = 'xxxnakneakoxxxxx';
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
        matrix = [
            ['x', 'x', 'x', 'n'],
            ['a', 'k', 'n', 'e'],
            ['a', 'k', 'o', 'x'],
            ['x', 'x', 'x', 'x'],
        ];
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
                $('#word-list').append(getMatrixTable(word, letterMatrix(), coordinates));
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
                        console.log( word[letterIndex], {x:x, y:y});
                        return findWordPath(word, letterIndex + 1, letterMatrix, {x:x, y:y}, [{x:x, y:y}]);
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
                
                if(found) {
                    console.log(word[letterIndex], coords);
                    coords = {x : testCoords[i].x, y: testCoords[i].y};
                    usedCoords.push(coords);
                }

                //Entire word is found, return char coordinates
                if(found && (letterIndex == word.length-1)) {
                    return usedCoords;
                }
                //Char is found, lets see if we can find next one
                else if(found) {
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

function checkCharAt(char, x, y, matrix) {
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

//Create html of matrix, and show order of characters somewhow
function getMatrixTable(word, matrix, coordinates) {
    
    var orderMatrix = JSON.parse(JSON.stringify(matrix));
    for(var x = 0; x < orderMatrix.length; x++) {
        for(var y = 0; y < orderMatrix[x].length; y++) {
            orderMatrix[x][y] = null;
        }
    }

    for(var i = 0; i < coordinates.length; i++) {    
        orderMatrix[coordinates[i].x][coordinates[i].y] = i;
    }
    var ret = '<table>';
    ret += '<tr><th colspan="4">'+word.join('')+'</th></tr>';
    var count = 0;
    for(var x = 0; x < matrix.length; x++) {
        ret += '<tr>';
        for(var y = 0; y < matrix[x].length; y++) {   
            
            if(orderMatrix[x][y] != null) {
                count = count +2;
                ret += '<td style="color:red;">' + matrix[x][y]+ '</td>';
            }
            else {
                ret += '<td>' + matrix[x][y]+ '</td>';
            } 
        }
        ret += '</tr>'
    }
    ret += '</table>';
    return ret;
}













