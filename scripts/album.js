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

var $albumTitle = $('.album-view-title');
var $albumArtist = $('.album-view-artist');
var $albumReleaseInfo = $('.album-view-release-info');
var $albumImage = $('.album-cover-art');
var $albumSongList = $('.album-view-song-list');


var setCurrentAlbum = function(album) {
  $albumTitle = $('.album-view-title');
  $albumArtist = $('.album-view-artist');
  $albumReleaseInfo = $('.album-view-release-info');
  $albumImage = $('.album-cover-art');
  $albumSongList = $('.album-view-song-list');

  $albumTitle.text(album.title);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year + ' ' + album.label);
  $albumImage.attr('src', album.albumArtUrl);
  
  $albumSongList.empty();
  
    for (var i = 0; i < album.songs.length; i++) {
    var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    $albumSongList.append($newRow);
  }
};


var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var currentlyPlayingSong = null;

$(document).ready(function) {
    
var albums = [albumPicasso, albumMarconi, albumTwinPeaks];
var index = 2;

var createSongRow = function (songNumber, songName, songLength) {
    var template = 
        '<tr class="album-view-song-item">'
    +   '   <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'       
    +   '   <td class="song-item-title">' + songName + '</td>'
    +   '   <td class="song-item-duration">' + songLength + '</td>'
    +   '</tr>'
    ;
    
    var $row = $(template);
    var clickHandler = function() {
        var songNumber = $(this).attr('data-song-number');
        
        if (currentlyPlayingSong !== null) {
            var currentlyPlayingCell = $('.song.item.number[data-song-number="' + currentlyPlayingSong + '"]');
            currentlyPlayingCell.html(currentlyPlayingSong);
        }
        if (currentlyPlayingSong !== songNumber) {
            $(this).html(pauseButtonTemplate);
            currentlyPlayingSong =songNumber;
        } else if (currentlyPlayingSong === songNumber) {
            $(this).html(playButtonTemplate);
            currentlyPlayingSong = null;
        }
    };
    
    var onHover = function (event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = songNumberCell.attr('data-song-number');
        
        if(songNumber !== currentlyPlayingSong) {
            songNumberCell.html(playButtonTemplate);
        }
    };
    
    var offHover = funtion (event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = songNumberCell.attr('data-song-number')
        
        if (songNumber !== currentlyPlayingSong) {
            songNumberCell.html(songNumber);
        }
    };
    
    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
};


    
setCurrentAlbum(albums[index]);
    
albumImage.addEventListener('click', function(event) {
    index++;
    if (index === albums.length) {
        index = 0;
    }
    setCurrentAlbum(albums[index]);
});
        

});