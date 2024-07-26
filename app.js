
document.addEventListener("DOMContentLoaded", () => {

  const volume = document.querySelector('.volume');
  const volume_icon = document.querySelector('.volume-icon');

  let audioContext;
  let MicrophoneSource;
  let analyser;
  let averageVolume;
  let isMuted = true;

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
  

  function candleBlow(){
    requestAnimationFrame(candleBlow); // to capture noise every seconds
    if(!isMuted){
     
      if(isBlowing()){
        
        console.log('Significant noise reached!');
        triggerConfetti();
        fireworksConfetti();
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
  volume.addEventListener('click',() =>{
    if(volume_icon.classList.contains('fa-volume-xmark')){
        volume_icon.classList.remove('fa-volume-xmark')
        volume_icon.classList.add('fa-volume-high');
        isMuted = false;
        MicrophoneSource.connect(analyser);
       
    }
    else{
        
        volume_icon.classList.remove('fa-volume-high');
        volume_icon.classList.add('fa-volume-xmark');
        isMuted = true;
        MicrophoneSource.disconnect(analyser);
       
    }
  });

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
