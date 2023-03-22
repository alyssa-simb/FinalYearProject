//This is the JS file to make the question cards move in the Questions and Answers Page

//once page has loaded 
window.addEventListener("DOMContentLoaded",	() => {
    
    //select html element  of the page that has class box and assign to box
    const box = document.querySelectorAll('.box');
    //when box element is clicked 'open' will be activated whether it was opne or close
    box.forEach(item => item.addEventListener('click', () => item.classList.toggle('open')));

});