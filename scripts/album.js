//Example Album attempting to duplicate exactly as written in Bloc assignment for a third time.
var albumPicasso = {
    title: 'The Colors',
    artist: 'Pablo Picasso',
    label: 'Cubism',
    year: '1881',
    albumArtUrl: 'assets/images/album_covers/01.png',
    songs: [
        { title: 'Blue', duration: '4:26' },
        { title: 'Green', duration: '3:14' },
        { title: 'Red', duration: '5:01' },
        { title: 'Pink', duration: '3:21' },
        { title: 'Magenta', duration: '2:15' }
    ]
};

var albumMarconi = {
    title: 'The Telefone',
    artist: 'Guglielmo Marconi',
    label: 'EM',
    year: '1909',
    albumArtUrl: 'assets/images/album_covers/20.png',
    songs: [
        { title: 'Hello, Operator?', duration: '1:01' },
        { title: 'Ring, ring, ring', duration: '5:01' },
        { title: 'Fits in your pocket', duration: '3:21' },
        { title: 'Can you hear me now', duration: '3:14' },
        { title: 'Wrong phone number', duration: '2:15' }
    ]
};
//Assignment 12 Part 1: create another album with same properties as other albums with different values
var albumTwinPeaks = {
    title: 'Dual Spires',
    artist: 'David Lynch',
    label: 'The Black Lodge',
    year: '1990',
    albumArtUrl: 'assets/images/album_covers/22.png',
    songs: [
        { title: 'Wheres Annie?', duration: '1:43' },
        { title: 'Creamed Corn', duration: '3:15' },
        { title: 'Dougie Jones', duration: '6:13' },
        { title: 'The owls are not what they seem', duration: '4:25' },
        { title: 'Who killed Laura Palmer?', duration: '3:26' }
    ]
};

var createSongRow = function(songNumber, songName, songLength) {
    var template = 
        '<tr class="album-view-song-item">'
    +   '   <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'       
    +   '   <td class="song-item-title">' + songName + '</td>'
    +   '   <td class="song-item-duration">' + songLength + '</td>'
    +   '</tr>'
    ;
    
    return template;
};

// Assignment 12 Part 2: Add an event listener to the album cover. When a user clicks it, the album page content should toggle between the three album objects: albumPicasso, albumMarconi, and your album object.
// Event Listner format: element.addEventListener('event', functionName [, Boolean]);
// A reference to DOM element Node to target album cover is stored in a variable, a variable is already created in setCurrentAlbum scope, need to repeat all the variables in this scope to use them since they are not outside the scope of the setCurrentAlbumScope

var albumTitle = document.getElementsByClassName('album-view-title')[0];
var albumArtist = document.getElementsByClassName('album-view-artist')[0];
var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
var albumImage = document.getElementsByClassName('album-cover-art')[0];
var albumSongList = document.getElementsByClassName('album-view-song-list')[0];


var setCurrentAlbum = function(album) {
  albumTitle = document.getElementsByClassName('album-view-title')[0];
  albumArtist = document.getElementsByClassName('album-view-artist')[0];
  albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
  albumImage = document.getElementsByClassName('album-cover-art')[0];
  albumSongList = document.getElementsByClassName('album-view-song-list')[0];

  albumTitle.firstChild.nodeValue = album.title;
  albumArtist.firstChild.nodeValue = album.artist;
  albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
  albumImage.setAttribute('src', album.albumArtUrl);
  
  albumSongList.innerHTML = '';
  for (var i = 0; i < album.songs.length; i++) {
    albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
  }
};

var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var currentlyPlayingSong = null;

window.onload = function() {
    
    var albums = [albumPicasso, albumMarconi, albumTwinPeaks];
    var index = 2;
    setCurrentAlbum(albums[index]);
    albumImage.addEventListener('click', function(event) {
        index++;
        if (index === albums.length) {
            index = 0;
        }
        setCurrentAlbum(albums[index]);
    });
    for (var i = 0; i < songRows.length; i++) {
        songRows[i].addEventListener('mouseleave', function(event) {
            var songItem = getSongItem(event.target);
            var songItemNumber = songItem.getAttribute('data-song-number');
            
            if (songItemNumber !== currentlyPlayingSong) {
                songItem.innerHTML = songItemNumber;
            }
        });
        songRows[i].addEventListener('click', function(event) {
            clickHandler(event.target);
        });
    }  
};

var findParentByClassName = function(element, targetClass) {
    
    if (element) {
        var currentParent = element.parentElement;
        if (currentParent == null) {
            console.log("no parent available!");
            return null;
        }
        while (currentParent.className !== targetClass && currentParent.parentElement !== null) {
            currentParent = currentParent.parentElement;
        }
        if (currentParent.className !== targetClass) {
            console.log('no matching parent found');
            return null;
        }
        return currentParent;
    }
};

var getSongItem = function(element) {
    console.log(element);
    switch (element.className) {
        case 'album-song-button':
        case 'ion-play':
        case 'ion-pause':
            return findParentByClassName(element, 'song-item-number');
        case 'album-view-song-item':
            return element.querySelector('.song-item-number');
        case 'song-item-title':
        case 'song-item-duration':
            return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
        case 'song-item-number':
            return element;
        default:
            return;          }
};

var clickHandler = function(targetElement) {
    var songItem = getSongItem(targetElement);
    if (currentlyPlayingSong === null) {
        songItem.innerHTML = pauseButtonTemplate;
        currentlyPlayingSong = songItem.getAttribute('data-song-number')
    } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
        songItem.innerHTML = playButtonTemplate;
        currentlyPlayingSong = null;
    } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
        var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
        currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
        songItem.innerHTML = pauseButtonTemplate;
        currentlyPlayingSong = songItem.getAttribute('data-song-number');
    }
};

songListContainer.addEventListener('mouseover', function(event) {
    if (event.target.parentElement.className === 'album-view-song-item') {
        var songItem = getSongItem(event.target);
        
        if (songItem.getAttribute('data-song-number') !== currentlyPlayingSong) {
            songItem.innerHTML = playButtonTemplate;
        }
    }    
});

