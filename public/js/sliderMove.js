////This is the JS file to make the slider move in the Home Page

//selecting Html elements
const Container = document.querySelector(".card-carousel");
const Controller = document.querySelector(".card-carousel + .card-controller")


//dragging mechanism of slider/carousel
class CardDrag {

  //defining CardDrag with a constructor 
  constructor(targetElement = undefined) {
    this.targetElement = targetElement;
  }
  
//event method that takes in callback function as a parameter
  event(callback) {

    let eventHandler;
  
    //set up mouse event listener on targetElement
    this.targetElement.addEventListener("mousedown", mouseDownEvent => {
      
      mouseDownEvent.preventDefault()
      //sets up event listeners
      eventHandler = callback(mouseDownEvent)
      window.addEventListener("mousemove", eventHandler)
      document.addEventListener("mouseleave", clearDragHandler)
      window.addEventListener("mouseup", clearDragHandler)
  
      //removes eventlisteners from window object
      function clearDragHandler() {
        window.removeEventListener("mousemove", eventHandler)
        window.removeEventListener("mouseup", clearDragHandler)
        document.removeEventListener("mouseleave", clearDragHandler)
        eventHandler(null)
      }

    })
  
    //set up touch event listener on target element
    this.targetElement.addEventListener("touchstart", touchStartEvent => {
      
      //triggers callback and passes touch event as a parameter
      //set to result of callback function with touch event
      eventHandler = callback(touchStartEvent)
      //sets up event listener on window object
      window.addEventListener("touchmove", eventHandler)
      window.addEventListener("touchend", clearTouchHandler)
      document.body.addEventListener("mouseleave", clearTouchHandler)
  
      //removes event listeners from window object
     function clearTouchHandler() {
        window.removeEventListener("touchmove", eventHandler)
        window.removeEventListener("touchend", clearTouchHandler)
        eventHandler(null)
      }

    })

  }
  
// Get the distance that the user has dragged
//By calculating th distance between two positions of the user's input
getDistance(callback) {

  function initDistanceHandler(startEvent) {
    let startX, startY;
      
    //If 'touches' is present - indicates that user input was a touch event
    if ("touches" in startEvent) {
      startX = startEvent.touches[0].clientX
      startY = startEvent.touches[0].clientY
    } else {
      //if not present then it was a mouse event
      startX = startEvent.clientX
      startY = startEvent.clientY
    }

    //calculates distance between starting point and current position of input
    return function(moveEvent) {

      //if null - input has ended-function should stop calculating distance
      if (moveEvent === null) {
        return callback(null)
      } else {
        //if not null - two variables are declared to store current position of input
        let moveX, moveY;
          
        if ("touches" in moveEvent) {
          //if touches present = touch input -set variables to clientXandY properties of first touch event 
          moveX = moveEvent.touches[0].clientX
          moveY = moveEvent.touches[0].clientY
        } else {
          //otherwise set them to clientXandY properities of movevent object
          moveX = moveEvent.clientX
          moveY = moveEvent.clientY
        }
          //returns to callback function with x and y dixtance between starting and current position of users input
        return callback({
          x: moveX - startX,
          y: moveY - startY
        })
      }
    }
  }
    
  this.event(initDistanceHandler)
}
}

//Create Card Carousel for user to navigate through card
class CardCarousel extends CardDrag {
  constructor(container, controller = undefined) {
    super(container)
    
    // DOM elements
    this.container = container
    this.controllerElement = controller
    this.cards = container.querySelectorAll(".card")
    
    // Carousel data
    this.centerIndex = (this.cards.length - 1) / 2;
    this.cardWidth = this.cards[0].offsetWidth / this.container.offsetWidth * 100
    this.xScale = {};
    
    // Resizing
    window.addEventListener("resize", this.updateCardWidth.bind(this))
    
    if (this.controllerElement) {
      this.controllerElement.addEventListener("keydown", this.controller.bind(this))      
    }

    // Initializers
    this.build()
    
    // Bind dragging event
    super.getDistance(this.moveCards.bind(this))
  }
  
  updateCardWidth() {
    this.cardWidth = this.cards[0].offsetWidth / this.container.offsetWidth * 100
    
    this.build()
  }
  
//to position and scale cards in slider layout
  build(fix = 0) {
    Array.from(this.cards).forEach((card, i) => {
      const x = i - this.centerIndex;
      const scale = this.calcScale(x);
      const scale2 = this.calcScale2(x);
      const zIndex = -(Math.abs(i - this.centerIndex));
      const leftPos = this.calcPos(x, scale2);
      
      //card updated to keep trach of cards position in slider
      this.xScale[x] = card;
      
      this.updateCards(card, {
        x,
        scale,
        leftPos,
        zIndex
      });
    });
  }
  
  //controller function for the slider to allow user to naivigate between the cards
  controller(event) {
    const newXScale = { ...this.xScale };
        
    if (event.keyCode === 39) {
      // Left arrow
      for (let x in this.xScale) {
        const newX = (parseInt(x) - 1 < -this.centerIndex) ? this.centerIndex : parseInt(x) - 1;
    
        newXScale[newX] = this.xScale[x]
      }
    }
      
    if (event.keyCode === 37) {
      // Right arrow
      for (let x in this.xScale) {
        const newX = (parseInt(x) + 1 > this.centerIndex) ? -this.centerIndex : parseInt(x) + 1;
    
        newXScale[newX] = this.xScale[x]
      }
    }
      
    this.xScale = newXScale;
      
    //calculate properties for each card based on it distance from the center card
    for (let x in newXScale) {
      const scale = this.calcScale(x),
            scale2 = this.calcScale2(x),
            leftPos = this.calcPos(x, scale2),
            zIndex = -Math.abs(x);
     //sets the properties of the card to calculated values
      this.updateCards(newXScale[x], {
        x: x,
        scale: scale,
        leftPos: leftPos,
        zIndex: zIndex
      });
    }
  }

  calcPos(x, scale) {
    const formula = (x === 0) 
      ? 100 - (scale * 100 + this.cardWidth) / 2 
      : (x < 0) 
        ? (scale * 100 - this.cardWidth) / 2 
        : 100 - (scale * 100 + this.cardWidth) / 2;
    
    return formula;
  }
  
//Updates the properties of the card based on data passed to it
  updateCards(card, data) {
    if (data.x || data.x === 0) {
      card.dataset.x = data.x;
    }
  
    if (data.scale || data.scale === 0) {
      const scaleTransform = `scale(${data.scale})`;
  
      card.style.transform = scaleTransform;
      card.style.opacity = data.scale === 0 ? data.scale : 1;
    }
  
    if (data.leftPos !== undefined) {
      card.style.left = `${data.leftPos}%`;
    }
  
    if (data.zIndex || data.zIndex === 0) {
      const shouldHighlight = data.zIndex === 0;
  
      card.classList.toggle("highlight", shouldHighlight);
      card.style.zIndex = data.zIndex;
    }
  }

  //Calculate the scale of one side of card based on its distance from the center card
  calcScale(x) {
    const formula = 1 - 1 / 5 * Math.pow(x, 2)
    
    if (formula <= 0) {
      return 0 
    } else {
      return formula      
    }
  }
//Calculate the scale of other of card based on its distance from the center card
  calcScale2(x) {
    let formula;
   
    if (x <= 0) {
      formula = 1 - -1 / 5 * x
      
      return formula
    } else if (x > 0) {
      formula = 1 - 1 / 5 * x
      
      return formula
    }
  }
  // Checks order of the cards after movement
  checkOrder(card, x, xDist) {    
    const original = parseInt(card.dataset.x)
    const rounded = Math.round(xDist)
    let newX = x
    
    if (x !== x + rounded) {
      if (x + rounded > original) {
        if (x + rounded > this.centerIndex) {
          
          newX = ((x + rounded - 1) - this.centerIndex) - rounded + -this.centerIndex
        }
      } else if (x + rounded < original) {
        if (x + rounded < -this.centerIndex) {
          
          newX = ((x + rounded + 1) + this.centerIndex) - rounded + this.centerIndex
        }
      }
      
      this.xScale[newX + rounded] = card;
    }
    
    const temp = -Math.abs(newX + rounded)
    
    this.updateCards(card, {zIndex: temp})

    return newX;
  }
  //function to let cards move on slider horizontally in a smooth movement
  moveCards(data) {
    let xDist;
    
    if (data != null) {
      this.container.classList.remove("smooth-return")
      xDist = data.x / 250;
    } else {

      
      this.container.classList.add("smooth-return")
      xDist = 0;

      for (let x in this.xScale) {
        this.updateCards(this.xScale[x], {
          x: x,
          zIndex: Math.abs(Math.abs(x) - this.centerIndex)
        })
      }
    }

    for (let i = 0; i < this.cards.length; i++) {
      const x = this.checkOrder(this.cards[i], parseInt(this.cards[i].dataset.x), xDist),
            scale = this.calcScale(x + xDist),
            scale2 = this.calcScale2(x + xDist),
            leftPos = this.calcPos(x + xDist, scale2)
      
      
      this.updateCards(this.cards[i], {
        scale: scale,
        leftPos: leftPos
      })
    }
  }
}

const carousel = new CardCarousel(Container)