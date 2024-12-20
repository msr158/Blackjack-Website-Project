// Function to play the video when hovering over the button
function playVideo(button) {
    const videoElement = button.querySelector('video');
    videoElement.play(); // Play the video
}

// Function to stop the video when leaving the button
function stopVideo(button) {
    const videoElement = button.querySelector('video');
    videoElement.pause(); // Pause the video
    videoElement.currentTime = 0; // Reset the video to the beginning
}
