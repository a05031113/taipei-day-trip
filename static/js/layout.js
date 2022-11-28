const getRegisterLogin = document.querySelector(".getRegisterLogin");
const login = document.querySelector(".login");
const register = document.querySelector(".register");
const loginLeave = document.querySelector(".loginLeave");
const registerLeave = document.querySelector(".registerLeave");
const registerNow = document.querySelector(".registerNow");
const loginNow = document.querySelector(".loginNow");
getRegisterLogin.onclick = function(){
    login.style.display = "flex";
}
loginLeave.onclick = function(){
    login.style.display = "none";
}
registerLeave.onclick = function(){
    register.style.display = "none";
}
registerNow.onclick = function(){
    login.style.display = "none";
    register.style.display = "flex";
}
loginNow.onclick = function(){
    register.style.display = "none";
    login.style.display = "flex";
}
