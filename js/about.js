let chk = document.querySelector('#chk');

chk.addEventListener('change', () => {

    console.log("checkbox clicked")
    document.body.classList.toggle('dark');
    document.querySelector("#about").classList.toggle('dark');
    document.querySelector(".navbarContent").classList.toggle('dark');

    if(document.body.classList.contains('dark')){ //when the body has the class 'dark' currently
        localStorage.setItem('darkMode', 'enabled'); //store this data if dark mode is on
    }else{
        localStorage.setItem('darkMode', 'disabled'); //store this data if dark mode is off
    }

});

if(localStorage.getItem('darkMode') == 'enabled'){
    document.body.classList.toggle('dark');
    document.querySelector("#about").classList.toggle('dark');
    document.querySelector(".navbarContent").classList.toggle('dark');
    if(document.body.classList.contains('dark')){ //when the body has the class 'dark' currently
    }else{
        localStorage.setItem('darkMode', 'disabled'); //store this data if dark mode is off
    }}
