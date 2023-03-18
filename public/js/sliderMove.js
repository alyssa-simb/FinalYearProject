const Container = document.querySelector(".card-carousel");
const Controller = document.querySelector(".card-carousel + .card-controller")

class CardDrag {
  constructor(targetElement = undefined) {
    this.targetElement = targetElement;
  }
  
  event(callback) {
    let eventHandler;
  
    this.targetElement.addEventListener("mousedown", mouseDownEvent => {
      mouseDownEvent.preventDefault()
  
      eventHandler = callback(mouseDownEvent)
  
      window.addEventListener("mousemove", eventHandler)
  
      document.addEventListener("mouseleave", clearDragHandler)
  
      window.addEventListener("mouseup", clearDragHandler)
  
      function clearDragHandler() {
        window.removeEventListener("mousemove", eventHandler)
        window.removeEventListener("mouseup", clearDragHandler)
  
        document.removeEventListener("mouseleave", clearDragHandler)
  
        eventHandler(null)
      }
    })
  
    this.targetElement.addEventListener("touchstart", touchStartEvent => {
      eventHandler = callback(touchStartEvent)
  
      window.addEventListener("touchmove", eventHandler)
  
      window.addEventListener("touchend", clearTouchHandler)
  
      document.body.addEventListener("mouseleave", clearTouchHandler)
  
      function clearTouchHandler() {
        window.removeEventListener("touchmove", eventHandler)
        window.removeEventListener("touchend", clearTouchHandler)
  
        eventHandler(null)
      }
    })
  }
  
// Get the distance that the user has dragged
getDistance(callback) {
  function initDistanceHandler(startEvent) {
    let startX, startY;
      
    if ("touches" in startEvent) {
      startX = startEvent.touches[0].clientX
      startY = startEvent.touches[0].clientY
    } else {
      startX = startEvent.clientX
      startY = startEvent.clientY
    }

    return function(moveEvent) {
      if (moveEvent === null) {
        return callback(null)
      } else {
        let moveX, moveY;
          
        if ("touches" in moveEvent) {
          moveX = moveEvent.touches[0].clientX
          moveY = moveEvent.touches[0].clientY
        } else {
          moveX = moveEvent.clientX
          moveY = moveEvent.clientY
        }
          
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
  

  build(fix = 0) {
    Array.from(this.cards).forEach((card, i) => {
      const x = i - this.centerIndex;
      const scale = this.calcScale(x);
      const scale2 = this.calcScale2(x);
      const zIndex = -(Math.abs(i - this.centerIndex));
      const leftPos = this.calcPos(x, scale2);
      
      this.xScale[x] = card;
      
      this.updateCards(card, {
        x,
        scale,
        leftPos,
        zIndex
      });
    });
  }
  
  
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
      
    for (let x in newXScale) {
      const scale = this.calcScale(x),
            scale2 = this.calcScale2(x),
            leftPos = this.calcPos(x, scale2),
            zIndex = -Math.abs(x);
    
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
  
  calcScale(x) {
    const formula = 1 - 1 / 5 * Math.pow(x, 2)
    
    if (formula <= 0) {
      return 0 
    } else {
      return formula      
    }
  }

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