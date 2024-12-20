document.getElementById('play').addEventListener('click', function() {
    document.getElementById('audio').play();
});

document.getElementById('pause').addEventListener('click', function() {
    document.getElementById('audio').pause();
});

document.getElementById('volume').addEventListener('input', function() {
    document.getElementById('audio').volume = this.value;
});

document.getElementById('toggle-volume').addEventListener('click', function() {
    var slider = document.getElementById('volume-slider');
    if (slider.style.display === 'none') {
        slider.style.display = 'block';
    } else {
        slider.style.display = 'none';
    }
});

var audio = document.getElementById('audio');
var timeSlider = document.getElementById('time');
var currentTimeDisplay = document.getElementById('current-time');
audio.loop = true;


audio.addEventListener('loadedmetadata', function() {
    timeSlider.max = audio.duration;
});

timeSlider.addEventListener('input', function() {
    audio.currentTime = this.value;
});

audio.addEventListener('timeupdate', function() {
    timeSlider.value = audio.currentTime;
    var minutes = Math.floor(audio.currentTime / 60);
    var seconds = Math.floor(audio.currentTime % 60);
    currentTimeDisplay.textContent = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
});