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

var createSongRow = function(songNumber, songName, songLength) {
    var template = 
        '<tr class="album-view-song-item">'
    +   '   <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'       
    +   '   <td class="song-item-title">' + songName + '</td>'
    +   '   <td class="song-item-duration">' + songLength + '</td>'
    +   '</tr>'
    ;
    
    var $row = $(template);
    
    var clickHandler = function() {
        var songNumber = parseInt($(this).attr('data-song-number'));
        
        if (currentlyPlayingSongNumber !== null) {
            var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }
        
        if (currentlyPlayingSongNumber !== songNumber) {
            $(this).html(pauseButtonTemplate);
            setSong(songNumber);
            updatePlayerBarSong();
        } else if (currentlyPlayingSongNumber === songNumber) {
            $(this).html(playButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPlayButton);
            setSong(null);
        }
    };
    
    var onHover = function (event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
        
        console.log(songNumber);
        
        if(songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
    };
    
    var offHover = function (event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
        
        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
        }
    };
    
    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
    console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
};

var setSong = function(songNumber) {
    currentlyPlayingSongNumber = songNumber;
    
    // Option A
    // currentSongFromAlbum = (songNumber !== null) ? currentAlbum.songs[songNumber - 1] : null;
    
    // Option B
    if (songNumber !== null) {
        currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    } else {
        currentSongFromAlbum = null;
    }
}

var setCurrentAlbum = function(album) {
    currentAlbum = album;
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

var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
};

var updatePlayerBarSong = function() {
    
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);

};

var nextSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex++;
    
    if(currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }
    
    var lastSongNumber = currentlyPlayingSongNumber;
    
    setSong(currentSongIndex + 1);
    
    updatePlayerBarSong();
    
    var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
    
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber); 
};

var previousSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex--;
    
    if(currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }
    
    var lastSongNumber = currentlyPlayingSongNumber;
    
    setSong(currentSongIndex + 1);
    
    updatePlayerBarSong();
    
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var $previousSongNumberCell = $('.song-item-number [data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number [data-song-number="' + lastSongNumber + '"]');
    
    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber); 
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
    
var albums = [albumPicasso, albumMarconi, albumTwinPeaks];
var index = 2;

setCurrentAlbum(albums[index]);
$previousButton.click(previousSong);
$nextButton.click(nextSong);

});


