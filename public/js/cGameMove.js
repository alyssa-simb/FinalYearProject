//This is the JS file to make the Card Game move.

const cards = document.querySelectorAll(".card");

//setting variables
let matched = 0;
let cardOne, cardTwo;
let disableDeck = false;


// Function that flips the cards using target properties
function flipCard({target: clickedCard}) {
  
  //if card isn't flipped
    if(cardOne !== clickedCard && !disableDeck) {
       //flip movement activated from css sheet
        clickedCard.classList.add("flip");
        if(!cardOne) {

            return cardOne = clickedCard;
        }
        //sets cardTwo and get image sources of both cards 
        cardTwo = clickedCard;
        disableDeck = true;
        let cardOneImg = cardOne.querySelector(".back img").src,
        cardTwoImg = cardTwo.querySelector(".back img").src;
        //call matched cards
        matchCards(cardOneImg, cardTwoImg);
    }
}

//Function to check if the chosen cards match by comparing them
function matchCards(img1, img2) {

    //if image matches
    if(img1 === img2) {
        matched++;
        if(matched == 8) {
            setTimeout(() => {
                return shuffleCard();
            }, 1000);
        }
        //remove event listener for both cards and reset variables to empty string
        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);
        cardOne = cardTwo = "";
        return disableDeck = false;
    }

    //if image doesn't match then shake cards and flip over
    setTimeout(() => {
        cardOne.classList.add("shake");
        cardTwo.classList.add("shake");
    }, 400);

    setTimeout(() => {
        cardOne.classList.remove("shake", "flip");
        cardTwo.classList.remove("shake", "flip");
        cardOne = cardTwo = "";
        disableDeck = false;
    }, 1200);
}

//Function to restart the game
function refreshGame() {
    // Reset game state
    matched = 0;
    cardOne = null;
    cardTwo = null;
    disableDeck = false;
  
    // Remove all "flip" and "shake" classes
    cards.forEach((card) => {
      card.classList.remove("flip", "shake");
      card.addEventListener("click", flipCard);
    });
  
    // Shuffle the cards
    shuffleCards();
  }
  
//function to shufflecards
function shuffleCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      let randomPos = Math.floor(Math.random() * cards.length);
      card.style.order = randomPos;
    });
  }
  
  //When the page is loaded, shuffle the card
  window.addEventListener('load', () => {
    shuffleCards();
    cards.forEach(card => {
      card.addEventListener("click", flipCard);
    });
  });

//Settting up  an event listener for each card to trigger flip action
cards.forEach(card => {
  card.addEventListener("click", flipCard);
});

//Settting up  an event listener to restart when button is clciked
const refreshButton = document.querySelector("#refresh-button");
refreshButton.addEventListener("click", refreshGame);
