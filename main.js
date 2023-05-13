prediction = "";

let cropper;
let isCrop = false;

Webcam.set({
  width: 400,
  height: 300.5,
  image_format: 'png',
  png_quality: 200
});

camera = document.getElementById("camera");
Webcam.attach('#camera');

function take_snapshot() {
  Webcam.snap(function (data_uri) {
    document.getElementById("result").innerHTML = '<img id="image_captured" src="' + data_uri + '"/>';
    document.getElementById("image").src = data_uri;

    const image = document.getElementById('image');
  });
}

document.getElementById('cropImageBtn').addEventListener('click', function() {
  isCrop = true;
  document.getElementById('crop-container').classList.toggle('hidden');
  document.getElementById('cropImageBtn').classList.toggle('hidden');
  document.getElementById('saveImageBtn').classList.toggle('hidden');
  document.getElementById('predictBtn').classList.toggle('hidden');

  cropper = new Cropper(image, {
  aspectRatio: 400/300.5,
  viewMode: 0,
  });

});

document.getElementById('saveImageBtn').addEventListener('click', function() {
  if (cropper) {
    const croppedImage = cropper.getCroppedCanvas().toDataURL("image/png");
    document.getElementById('image_captured').src = croppedImage;
    
    document.getElementById('crop-container').classList.toggle('hidden');
    document.getElementById('cropImageBtn').classList.toggle('hidden');
    document.getElementById('saveImageBtn').classList.toggle('hidden');
    document.getElementById('predictBtn').classList.toggle('hidden');
  }
  isCrop = false;
  cropper.destroy();
});


console.log("ml5 version:", ml5.version);
// https://teachablemachine.withgoogle.com/models/m7nslf1or/
// https://teachablemachine.withgoogle.com/models/birJb7zEO/model.json
classifier = ml5.imageClassifier('https://teachablemachine.withgoogle.com/models/m7nslf1or/model.json', modelLoaded);

function modelLoaded() {
    console.log("Model Loaded Successfully!");
}

function speak() {
    var synth = window.speechSynthesis;
    var speak_data = "The Prediction Is " + prediction;
    var utterThis = new SpeechSynthesisUtterance(speak_data);
    synth.speak(utterThis);
}

function check() {
    img = document.getElementById("image_captured");
    classifier.classify(img, gotResults);
}


function gotResults(error, results) {
    if (error) {
        console.error(error);
    } else {
        console.log(classifier);
        console.log(results);
        document.getElementById("result_gesture_name").innerHTML = results[0].label;
        prediction = results[0].label;
        speak();
    }
}

