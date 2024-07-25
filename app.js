document.addEventListener("DOMContentLoaded", () => {
  let audioContext;
  let MicrophoneSource;
  let analyser;

  AudioInput();

  function AudioInput() {
    // check if the media api is supported
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
        })
        .then((stream) => {

            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            MicrophoneSource = audioContext.createMediaStreamSource(stream);
            analyser = audioContext.createAnalyser();

            MicrophoneSource.connect(analyser);
            analyser.fftSize = 256;

            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            function analyzeAudio(){
                requestAnimationFrame(analyzeAudio);
                analyser.getByteFrequencyData(dataArray);

                const averageVolume = dataArray.reduce((a, b) => a + b) / bufferLength;
                console.log("Average Volume: "+ averageVolume);
                if(averageVolume > 100){
                    console.log('Significant audio input Captured!');
                }
                const element = document.querySelector('.test-microphone');
                element.style.width = `${averageVolume}px`;
                
            }

            analyzeAudio();
            
        })  
        .catch((error) => {
          console.log("Cannot Access Microphone: " + error);
          alert("Cannot Access Microphone: " + error);
        });
    } else {
      alert("getUserMedia not supported on your browser!");
    }
  }

});


// function to trigger confetti
function triggerConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
}

function fireworksConfetti() {
  var duration = 15 * 1000;
  var animationEnd = Date.now() + duration;
  var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  var interval = setInterval(function () {
    var timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    var particleCount = 50 * (timeLeft / duration);
    // since particles fall down, start a bit higher than random
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);
}
