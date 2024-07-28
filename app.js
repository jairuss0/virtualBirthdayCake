document.addEventListener("DOMContentLoaded", () => {
  const microphone = document.querySelector(".microphone");
  const microphone_icon = document.querySelector(".microphone-icon");
  const greetText = document.querySelector(".greet");
  const dancingGif = document.querySelector(".dancing-gif");

  let audioContext;
  let MicrophoneSource;
  let analyser;
  let averageVolume;
  let isMuted = true;
  let confettiSound = new Audio("./sounds/confetti.mp3");
  let fireworksSound = new Audio("./sounds/fireworks.mp3");
  let birthdaySong = new Audio('./sounds/happynabdaymopa.mp3');

  AudioInput();

  function isBlowing() {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    // sum the dataArray then divide to the buffer length
    averageVolume = dataArray.reduce((a, b) => a + b) / bufferLength;
    console.log(averageVolume);

    return averageVolume > 160;
  }

  function candleBlow() {
    requestAnimationFrame(candleBlow); // to capture noise every seconds
    if (!isMuted) {
      if (isBlowing()) {
        MicrophoneSource.disconnect(analyser);
        console.log("Significant noise reached!");
        triggerConfetti(() =>{
          fireworksConfetti();
          
          setTimeout(() =>{
            birthdaySong.play();
            birthdaySong.loop = true;
            revealText();
          },500);
        });
       
      }
    }
  }

  function AudioInput() {
    // check if the media api is supported
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
        })
        .then((stream) => {
          audioContext = new (window.AudioContext || window.AudioContext)();
          MicrophoneSource = audioContext.createMediaStreamSource(stream);
          analyser = audioContext.createAnalyser();
          MicrophoneSource.connect(analyser);
          analyser.fftSize = 256;

          requestAnimationFrame(candleBlow); // start the loop
        })
        .catch((error) => {
          console.log("Cannot Access Microphone: " + error);
          alert("Cannot Access Microphone: " + error);
        });
    } else {
      alert("getUserMedia not supported on your browser!");
    }
  }

  // audio capturing is disconnected by default
  microphone.addEventListener("click", () => {
    if (microphone_icon.classList.contains("fa-microphone-slash")) {
      microphone_icon.classList.remove("fa-microphone-slash");
      microphone_icon.classList.add("fa-microphone");
      isMuted = false;
      MicrophoneSource.connect(analyser);
    } else {
      microphone_icon.classList.remove("fa-microphone");
      microphone_icon.classList.add("fa-microphone-slash");
      isMuted = true;
      MicrophoneSource.disconnect(analyser);
    }
  });

  // key event for muting mic
  document.addEventListener("keydown", (event) => {
    if (event.key === "m") {
      if (microphone_icon.classList.contains("fa-microphone-slash")) {
        microphone_icon.classList.remove("fa-microphone-slash");
        microphone_icon.classList.add("fa-microphone");
        isMuted = false;
        MicrophoneSource.connect(analyser);
      } else {
        microphone_icon.classList.remove("fa-microphone");
        microphone_icon.classList.add("fa-microphone-slash");
        isMuted = true;
        MicrophoneSource.disconnect(analyser);
      }
    }
  });


  function revealText(){
    greetText.style.visibility = 'visible';
    greetText.classList.add('animate__animated','animate__zoomInUp');

    greetText.addEventListener('animationend', () => {
      dancingGif.style.visibility = 'visible';
      dancingGif.classList.add('animate__animated','animate__fadeIn');
    });
    
  }

  // function to trigger confetti send a fireworks confetti as a callback
  function triggerConfetti(callback) {
    confettiSound.play();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    setTimeout(() => {
      callback();
    },1000);
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

        fireworksSound.pause();
        fireworksSound.currentTime = 0;
        return clearInterval(interval);
        
      } else {
        console.log("ongoing fireworks");
        fireworksSound.play();
        fireworksSound.addEventListener('ended', function() {
          this.currentTime = 0;
          this.play();
        }, false);
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
});
