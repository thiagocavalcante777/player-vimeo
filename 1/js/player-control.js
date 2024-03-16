var playlist = [{
    id: 911924573,
    title: 'Video 1',
    watched: false
}, {
    id: 911924873,
    title: 'Video 2',
    watched: false
}, {
    id: 911925807,
    title: 'Video 3',
    watched: false
}];

var currentVideo = 0;
var player;
var playPercentage = 0; // guarda a porcentagem de reprodução dos vídeos

function playNextVideo() {
    var nextUnwatchedVideoIndex = playlist.findIndex((video, index) => index > currentVideo && video.watched == false);

    if (nextUnwatchedVideoIndex != -1) {
        currentVideo = nextUnwatchedVideoIndex;
    } else if (currentVideo < playlist.length - 1) {
        currentVideo++;
    } else {
        generatePlaylist();
        return; // Recomeça a lista
    }
    playVideo(playlist[currentVideo]);
}

// Function to generate the sidebar video list
function generatePlaylist() {
    var videoList = document.getElementById('videoList');
    // Clear existing list
    while (videoList.firstChild) {
        videoList.removeChild(videoList.firstChild);
    }
    // Generate new list
    playlist.forEach(function(video, index) {
        var li = document.createElement('li');
        var text = document.createTextNode(video.title);
        li.appendChild(text);

        var icon = document.createElement('span');

        if(video.watched) {
            icon.className = 'iconvideo';
        } else {
            icon.className = 'iconCompleted';
        }

        icon.addEventListener('click', function(event) {
            event.stopPropagation();
            video.watched = false;
            generatePlaylist();
        });
        li.insertBefore(icon, li.childNodes[0]);

        li.style.marginBottom = '10px';
        // Mark the video that is being played
        if (index === currentVideo) {
            li.style.fontWeight = 'bold';
            li.style.backgroundColor = "#aaa";
        }
        // Add click event to each li to play the corresponding video
        li.addEventListener('click', function() {
            currentVideo = index;
            playVideo(playlist[currentVideo]);
            generatePlaylist();
        });
        videoList.appendChild(li);
    });
}

function playVideo(video) {
    var options = {
        id: video.id,
        width: 640,
        autoplay: true,
    };
    if (player) {
        player.off('timeupdate');
        player.off('loaded');
        player.loadVideo(video.id);
    } else {
        player = new Vimeo.Player('vimeo_video', options);
    }

    player.on('timeupdate', function(data) {
        // Atualiza a porcentagem de vídeo assistida
        playPercentage = data.seconds / data.duration;

        // Marque como assistido quando 85% for reproduzido e atualiza playlist
        if (playPercentage >= 0.95) {
            markAsWatched(currentVideo);
        }
    });

    player.on('ended', function() {
        playlist[currentVideo].watched = true;
        playNextVideo();
    });

    player.on('loaded', function() {
        // Atualize a lista de reprodução depois que o vídeo for carregado
        generatePlaylist();
    });

}

// Start playing the playlist with the first video after an initial delay
setTimeout(function() {
    document.getElementById('vimeo_video').style.background = '#f9f9f9';
    document.getElementById('sidebar').style.background = '#f9f9f9';
    playVideo(playlist[currentVideo]);
    generatePlaylist();
}, 1000);