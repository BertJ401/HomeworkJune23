const questionTex = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const timerCount = document.getElementById("timer")
var timerCd = 100
var currentQuestion = {};
var acceptingAnswers = false;
var score = 0;
var questionCounter = 0;
var questList = [];
var correctAudio = new Audio("assets/correct answer.mp3");
var wrongAudio = new Audio("assets/wrong answer.mp3");
var endAudio = new Audio("assets/commerical break.mp3");
var letsAudio = new Audio("assets/lets play.mp3")
var allAudios = document.querySelectorAll('audio');

const corrPoints = 10;
const maxQuest = 10;

function stopAllAudio() {
  allAudios.forEach(function (audio) {
    audio.pause();
  })
};

startGame = function () {
  letsAudio.play();
  questionCounter = 0;
  score = 0;
  questList = [...questions];
  getNewQuestion();

};

getNewQuestion = function () {
  if (questList.length === 0 || questionCounter >= maxQuest) {
    localStorage.setItem("mostRecentScore", score);
    stopAllAudio();
    endAudio.play();
    return window.location.assign("end.html");
  }
  questionCounter++;
  progressText.innerText = `Question ${questionCounter}/${maxQuest}`;
  const questionIndex = Math.floor(Math.random() * questList.length);
  currentQuestion = questList[questionIndex];
  questionTex.innerText = currentQuestion.question;

  choices.forEach(choice => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + number];
  });

  questList.splice(questionIndex, 1);
  acceptingAnswers = true;
};

choices.forEach(choice => {
  choice.addEventListener("click", e => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];

    const classToApply =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

    if (classToApply === "correct") {
      incrementScore(corrPoints);
      stopAllAudio();
      correctAudio.currentTime = 0;
      correctAudio.play();
    } else {
      stopAllAudio();
      wrongAudio.currentTime = 0;
      wrongAudio.play();
    }

    selectedChoice.parentElement.classList.add(classToApply);

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 2000);
  });
});

countDown = function () {
  timerCd = timerCd - 1;
  if (timerCd < 200) {
    const minutesCd = Math.floor(timerCd / 60);
    var secondsCd = timerCd % 60;
    timerCount.innerText = `Time Left: ${minutesCd}:${secondsCd}`;
  }
  if (timerCd < 1) {
    window.clearInterval(update);
    localStorage.setItem("mostRecentScore", score);
    stopAllAudio();
    endAudio.play();
    return window.location.assign("end.html");
  }
}

update = setInterval("countDown()", 1000);


incrementScore = function (num) {
  score += num;
  scoreText.innerText = score;
};

startGame();
