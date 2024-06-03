document.addEventListener("DOMContentLoaded", function() {
    const startButton = document.getElementById("start-button");
    const videosContainer = document.getElementById("videos-container");
    let currentVideoIndex = 0;
    let videos = [];

    startButton.addEventListener("click", function() {
        // Hide the start button and show the videos container
        startButton.style.display = "none";
        videosContainer.style.display = "block";

        // Fetch data for each user's video
        fetchVideoData("0");
        fetchVideoData("1");
    });

    function fetchVideoData(userId) {
        fetch(`video/${userId}/data.json`)
            .then(response => response.json())
            .then(data => {
                const videoDiv = document.createElement("div");
                videoDiv.classList.add("video");

                const videoElement = document.createElement("video");
                videoElement.src = `video/${userId}/${data.url_video}`;
                videoElement.controls = false; // Disable controls for autoplay
                videoElement.autoplay = false;
                videoElement.muted = false;

                const metadataDiv = document.createElement("div");
                metadataDiv.classList.add("metadata");

                const titleElement = document.createElement("h2");
                titleElement.textContent = data.titre;

                const authorElement = document.createElement("p");
                authorElement.textContent = `By: ${data.auteur}`;

                const descriptionElement = document.createElement("p");
                descriptionElement.textContent = data.description;

                metadataDiv.appendChild(titleElement);
                metadataDiv.appendChild(authorElement);
                metadataDiv.appendChild(descriptionElement);

                videoDiv.appendChild(videoElement);
                videoDiv.appendChild(metadataDiv);

                videosContainer.appendChild(videoDiv);
                videos.push(videoDiv);

                if (videos.length === 1) {
                    // Start playing the first video
                    playVideo(currentVideoIndex);
                }
            })
            .catch(error => console.error("Error fetching video data:", error));
    }

    function playVideo(index) {
        videos.forEach((videoDiv, i) => {
            const video = videoDiv.querySelector('video');
            if (i === index) {
                video.play().catch(error => console.error("Video playback failed:", error));
                videoDiv.style.transform = 'translateY(0)';
            } else {
                video.pause();
                videoDiv.style.transform = i < index ? 'translateY(-100%)' : 'translateY(100%)';
            }
        });
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
            currentVideoIndex = (currentVideoIndex > 0) ? currentVideoIndex - 1 : videos.length - 1;
            playVideo(currentVideoIndex);
        } else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
            currentVideoIndex = (currentVideoIndex < videos.length - 1) ? currentVideoIndex + 1 : 0;
            playVideo(currentVideoIndex);
        }
    });
});
