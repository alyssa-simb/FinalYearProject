window.addEventListener("DOMContentLoaded",	() => {

    const box = document.querySelectorAll('.box');

    box.forEach(item => item.addEventListener('click', () => item.classList.toggle('open')));

});