const cards = document.querySelectorAll(".card");

let matched = 0;
let cardOne, cardTwo;
let disableDeck = false;

function flipCard({target: clickedCard}) {
    if(cardOne !== clickedCard && !disableDeck) {
        clickedCard.classList.add("flip");
        if(!cardOne) {
            return cardOne = clickedCard;
        }
        cardTwo = clickedCard;
        disableDeck = true;
        let cardOneImg = cardOne.querySelector(".back img").src,
        cardTwoImg = cardTwo.querySelector(".back img").src;
        matchCards(cardOneImg, cardTwoImg);
    }
}

function matchCards(img1, img2) {
    if(img1 === img2) {
        matched++;
        if(matched == 8) {
            setTimeout(() => {
                return shuffleCard();
            }, 1000);
        }
        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);
        cardOne = cardTwo = "";
        return disableDeck = false;
    }
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
  

function shuffleCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      let randomPos = Math.floor(Math.random() * cards.length);
      card.style.order = randomPos;
    });
  }
  
  window.addEventListener('load', () => {
    shuffleCards();
    cards.forEach(card => {
      card.addEventListener("click", flipCard);
    });
  });

  const refreshButton = document.querySelector("#refresh-button");
refreshButton.addEventListener("click", refreshGame);
    
cards.forEach(card => {
    card.addEventListener("click", flipCard);
});