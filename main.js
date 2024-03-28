const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const feedbackElement = document.getElementById('feedback');
const scoreElement = document.getElementById('score-value');
const nextButton = document.getElementById('next-question');
const numquesElement = document.getElementById('numques');

let currentQuestionIndex = 0;
let score = 0;
let questions = [];

fetch('questions.json')
  .then(response => response.json())
  .then(data => {
    questions = data.questions;
    startQuiz();
  })
  .catch(error => {
    console.error('Une erreur est survenue lors du chargement des questions :', error);
  });

function showQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  questionElement.textContent = currentQuestion.question;

  if (currentQuestion.type === 'multiple_choice') {
    showMultipleChoiceQuestion(currentQuestion);
  } else if (currentQuestion.type === 'input') {
    showInputQuestion(currentQuestion);
  }
}


function showMultipleChoiceQuestion(question) {
  currentQuestion = questions[currentQuestionIndex];
  questionNumber = currentQuestionIndex + 1;
  numquesElement.textContent = `Question ${questionNumber}/${questions.length}: `;
  optionsElement.innerHTML = '';

  question.options.forEach((option, index) => {
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'option';
    input.id = 'option' + index;
    input.value = option;
   
    const label = document.createElement('label');
    label.textContent = option;
    label.htmlFor = 'option' + index;
    label.appendChild(document.createElement('br')); 
    optionsElement.appendChild(input);
    optionsElement.appendChild(label);
    optionsElement.appendChild(document.createElement('br'));
  });
}


function showInputQuestion(question) {
   currentQuestion = questions[currentQuestionIndex];
   questionNumber = currentQuestionIndex + 1;
   numquesElement.textContent = `Question ${questionNumber}/${questions.length}: `;

  optionsElement.innerHTML = '';

  const input = document.createElement('input');
  input.type = 'text';
  input.id = 'input-answer';

  optionsElement.appendChild(input);
}


function startQuiz() {
  showQuestion();
  startTimer();
}

function startTimer() {
	let time = 30;
	const timerElement = document.getElementById('timer');
  
	timerInterval = setInterval(() => {
	  time--;
	  timerElement.textContent = `Temps : ${time} s`;
  
	  if (time <= 0) {
		clearInterval(timerInterval);
		timerElement.textContent = 'Temps écoulé !';
		moveToNextQuestion();
	
	  }
	}, 1000); 
  }
  

nextButton.addEventListener('click', () => {
  const currentQuestion = questions[currentQuestionIndex];
  

  if (currentQuestion.type === 'multiple_choice') {
	clearInterval(timerInterval);
	startTimer();
    checkMultipleChoiceAnswer();

  } else if (currentQuestion.type === 'input') {
	clearInterval(timerInterval);
	startTimer();
    checkInputAnswer();
  }
});


function checkMultipleChoiceAnswer() {
  const selectedOption = document.querySelector('input[name="option"]:checked');
  if (!selectedOption) {
    feedbackElement.textContent = 'Veuillez sélectionner une réponse.';
    return;
  }

  const selectedAnswer = selectedOption.value;
  const currentQuestion = questions[currentQuestionIndex];
  if (selectedAnswer === currentQuestion.answer) {
    score++;
    scoreElement.textContent = score;
  } else {
    feedbackElement.textContent = 'Réponse incorrecte';
  }

  currentQuestionIndex++;
  feedbackElement.textContent = '';
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  }else{
    endQuiz();
  }
}

function checkInputAnswer() {
  const inputAnswer = document.getElementById('input-answer').value;
  const currentQuestion = questions[currentQuestionIndex];
  if (inputAnswer.toLowerCase() === currentQuestion.answer.toLowerCase()) {
    score++;
    scoreElement.textContent = score;
	
  } else {
    feedbackElement.textContent = 'Réponse incorrecte';
  }

  currentQuestionIndex++;
  feedbackElement.textContent = '';

  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    endQuiz();
  }
}

function moveToNextQuestion() {
	clearInterval(timerInterval); 
  
	setTimeout(() => {
	  currentQuestionIndex++;
	  if (currentQuestionIndex < questions.length) {
		showQuestion();
		startTimer(); 
	  } else {
		endQuiz();
	  }
	}, 2000); 
  }
  

function endQuiz() {
	clearInterval(timerInterval);
	questionElement.textContent = 'Quiz terminé ! Votre score est de ' + score + ' sur ' + questions.length;
	optionsElement.innerHTML = '';
	if (score === questions.length) {
	  feedbackElement.textContent = 'Bravo ! Vous avez répondu correctement à toutes les questions.';
	} else if (score > questions.length / 2 && score !== questions.length) {
	  feedbackElement.textContent = 'Bien! Vous pouvez faire mieux.';
	} else {
	  feedbackElement.textContent = 'Vous devez apprendre vos cours.';
	}
    feedbackElement.appendChild(document.createElement('br'));
    feedbackElement.style.fontSize="20px";
    feedbackElement.style.color="brown";

	const resultButton = document.createElement('button');
	resultButton.textContent = 'Correction';
	resultButton.addEventListener('click', showResults);
  

	resultButton.style.padding = '10px 20px';
	resultButton.style.backgroundColor = '#4CAF50';
	resultButton.style.color = 'white';
	resultButton.style.border = 'none';
	resultButton.style.borderRadius = '5px';
	resultButton.style.cursor = 'pointer';
	resultButton.style.marginTop = '20px';
  resultButton.style.marginleft = '20px';
	feedbackElement.appendChild(resultButton);
  

	nextButton.style.display = 'none';
	h4.style.display = 'none';
	score1.style.display = 'none';
	numques.style.display = 'none';
	const timerElement = document.getElementById('timer');
	timerElement.style.display = 'none';
  }
  

  
function showResults() {
    const resultContainer = document.createElement('div');
    
    questions.forEach((question, index) => {
        const questionResult = document.createElement('p');
        questionResult.textContent = `Question ${index + 1}: ${question.question}`;
        questionResult.style.fontSize = "19px";
        questionResult.style.color ="blue";
        const correctAnswer = document.createElement('p');
        correctAnswer.textContent = `Réponse correcte : ${question.answer}`;
        correctAnswer.style.fontSize="17px";
        resultContainer.appendChild(questionResult);
        resultContainer.appendChild(correctAnswer);
        resultContainer.appendChild(document.createElement('br')); 
    });

    
    feedbackElement.appendChild(resultContainer);
}
