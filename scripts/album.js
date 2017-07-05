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
    +   '   <td class="song-item-number">' + songNumber + '</td>'
    +   '   <td class="song-item-titel">' + songName + '</td>'
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
};

songListContainer.addEventListener('mouseover', function(event) {
    console.log(event.target);
});

