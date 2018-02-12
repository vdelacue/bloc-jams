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
    +   '   <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
    +   '</tr>'
    ;
    
    var $row = $(template);
    
    var clickHandler = function() {
        var songNumber = parseInt($(this).attr('data-song-number'));
        
        if (currentlyPlayingSongNumber !== null) {
            var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }
        
        if (currentlyPlayingSongNumber !== songNumber) {
            $(this).html(pauseButtonTemplate);
            setSong(songNumber);
            currentSoundFile.play();
            updateSeekBarWhileSongPlays();
            updatePlayerBarSong();
        } else if (currentlyPlayingSongNumber === songNumber) {
            
            if (currentSoundFile.isPaused()) {
                currentSoundFile.play();
                updateSeekBarWhileSongPlays();
                $(this).html(pauseButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPauseButton);
            } else { 
                currentSoundFile.pause();
                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
            }
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
    if (currentSoundFile) {
        currentSoundFile.stop();
    }
    currentlyPlayingSongNumber = parseInt(songNumber);
    
    // Option A
    // currentSongFromAlbum = (songNumber !== null) ? currentAlbum.songs[songNumber - 1] : null;
    
    // Option B
    if (songNumber !== null) {
        currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
        var buzzOptions = {
            formats: ['mp3'],
            preload: true
        };
        
        currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, buzzOptions);
        
        // pretend we are now in playSong().
        setVolume(currentVolume);
        currentSoundFile.play();
    } else {
        currentSongFromAlbum = null;
    }
    
}

var setVolume = function(volume) {
        if (currentSoundFile) {
            currentSoundFile.setVolume(volume);
        }
    };

var seek = function(time) {
    if (currentSoundFile) {
        currentSoundFile.setTime(time);
    }
}

var getSongNumberCell = function(number) {
    
    return $('.song-item-number [data-song-number="' + number + '"]');
    //returns the song number element that corresponds to that song number
};

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

var updateSeekBarWhileSongPlays = function() {
    if (currentSoundFile) {
        currentSoundFile.bind('timeupdate', function(event) {
            var seekBarFillRatio = this.getTime() / this.getDuration();
            var $seekBar = $('.seek-control .seek-bar');
            
            updateSeekPercentage($seekBar, seekBarFillRatio);
            setCurrentTimeInPlayerBar(filterTimeCode(this.getTime()));
        });
    }
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
    
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
};

var setupSeekBars = function() {
    var $seekBars = $('.player-bar .seek-bar');
    
    $seekBars.click(function(event) {
        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();
        var seekBarFillRatio = offsetX / barWidth;
        if($(this).parent().attr('class') == 'seek-control') {
            seek(seekBarFillRatio * currentSoundFile.getDuration());
        } else {
            setVolume(seekBarFillRatio * 100);
        }
        
        updateSeekPercentage($(this), seekBarFillRatio);
    });
    
    $seekBars.find('.thumb').mousedown(function(event) {
    
        var $seekBar = $(this).parent();
        
        $(document).bind('mousemove.thumb', function(event) {
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;
            
            if($seekBar.parent().attr('class') == 'seek-control') {
                seek(seekBarFillRatio * currentSoundFile.getDuration());
            } else {
                setVolume(seekBarFillRatio);
            }
           
            updateSeekPercentage($seekBar, seekBarFillRatio);
        });
        
        $(document).bind('mouseup.thumb', function() {
            $(document).unbind('mousemove.thumb');
            $(document).unbind('mouseup.thumb');
        });
    });
};

var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
};

var updatePlayerBarSong = function() {
    
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    setTotalTimeInPlayerBar(filterTimeCode(currentSongFromAlbum.duration));

};

var nextSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex++;
    
    if(currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }
    
    var lastSongNumber = currentlyPlayingSongNumber;
    
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    
    updatePlayerBarSong();
    
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    
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
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    
    updatePlayerBarSong();
    
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
    
};

var togglePlayFromPlayerBar = function() {
    var songNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    if (currentSoundFile.isPaused()) {
        currentSoundFile.play();
        songNumberCell.html(pauseButtonTemplate);
        $mainPlayPauseButton.html(playerBarPauseButton);
    } else { 
        currentSoundFile.pause();
        songNumberCell.html(playButtonTemplate);
        $mainPlayPauseButton.html(playerBarPlayButton);
    }
    
}

var setCurrentTimeInPlayerBar = function(currentTime) {
    $('.current-time').text(currentTime);
}

var setTotalTimeInPlayerBar = function(totalTime) {
    $('.total-time').text(totalTime);
}

var filterTimeCode = function(timeInSeconds) {
    
    //Use the parseFloat() method to get the seconds in number form.
    var wholeSecs = parseFloat(timeInSeconds);
    var wholeMins = parseFloat(wholeSecs / 60);
    //Store variables for whole seconds and whole minutes (hint: use Math.floor() to round numbers down).
    wholeMins = Math.floor(wholeMins);
    var remainderSecs = (wholeSecs % 60);
    remainderSecs = Math.floor(remainderSecs); 
    //don't understand the Math.floor concept here but I know the assignment requests to use it here, will ask mentor. 
    if(remainderSecs < 10){
        remainderSecs = "0" + remainderSecs
    };
    console.log(wholeMins);
    console.log(wholeSecs);
    //Return the time in the format X:XX
    var returnTime = wholeMins + ':' + remainderSecs;
    return returnTime; 
}

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $mainPlayPauseButton = $('.main-controls .play-pause');

$(document).ready(function() {
  
var albums = [albumPicasso, albumMarconi, albumTwinPeaks];
var index = 2;

setCurrentAlbum(albums[index]);
setupSeekBars(); //Is this function not being called because we are waiting for the the click on a seekbar? unlike the other ones that need to be executed as page loads??
$previousButton.click(previousSong);
$nextButton.click(nextSong);

$mainPlayPauseButton.click(togglePlayFromPlayerBar);
    
});

// Examples, do not use directly

//
//<div class="messages">
//    <!--<div class="chat-window"></div>-->
//</div>
//
//
//var $el = $('.whatever');
//
//$el.on('click', function() {
//    // some code here
//});
//
//$el.click(function() {
//    // some code here
//});
//
//$('.messages').on('click', '.chat-window', function(event) {
//    // this would only fire if the target of the event matches '.whatever'.
//    // event.target
//});