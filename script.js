$.get('https://raw.githubusercontent.com/anttipirskanen/sanajahtihack/master/kotus-sanalista_v1.xml',  data => {
    start($.parseXML(data));

    $('#new-game-btn').click( e => {
        console.log('asf');
        location.reload();
    });  

});

function start(xmlData) {
    var letters = prompt("Insert letters without spaces");
    var count = 0;
    console.log('Processing....');
    $(xmlData).find('kotus-sanalista').find('st').each((index, item) => {
        var word =  $(item).find('s').text().split('');
        if(findWord(word, letters)) {
            count ++;
            $('#word-list').append('<li>'+word.join('')+'</li>');
        }
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









