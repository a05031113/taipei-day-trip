const getRegisterLogin = document.getElementById("getRegisterLogin");
const logout = document.getElementById("logout")
const login = document.querySelector(".login");
const register = document.querySelector(".register");
const loginLeave = document.querySelector(".loginLeave");
const registerLeave = document.querySelector(".registerLeave");
const registerNow = document.querySelector(".registerNow");
const loginNow = document.querySelector(".loginNow");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const registerName = document.getElementById("registerName");
const registerEmail = document.getElementById("registerEmail");
const registerPassword = document.getElementById("registerPassword");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn")
const refreshToken = setInterval(function(){
    refresh();
}, 300*1000)
refresh();
registerBtn.onclick = function(){
    if (ValidateEmail(registerEmail)){
        if (ValidatePassword(registerPassword)){
            const data = {
                "data":{
                    "name": registerName.value,
                    "email": registerEmail.value,
                    "password": registerPassword.value
                }
            };
            const registerData = {
                "email": registerEmail.value,
                "password": registerPassword.value
            };
            registerAccount(data, registerData)
        }else{
            alert("password need at least 8 items with number, upper and lower case");
        }
    }else{
        alert("wrong email format");
    }
}
loginBtn.onclick = function(){
    if (loginEmail && loginPassword){
        const data = {
            "email": loginEmail.value,
            "password": loginPassword.value
        };
        loginAccount(data)
    }else{
        alert("Please fill in email and password");
    }
}
logout.onclick = function(){
    logoutAccount()
    window.location.reload();
}
async function registerAccount(data, loginData){
    try{
        let response = await fetch("/api/user", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json",
            }
        });
        let result = await response.json();
        if (response.status===200){
            loginAccount(loginData)
        }else if(response.status===400){
            alert(result["message"]);
            return false;
        }else{
            return false;
        }
    }catch(error){
        console.log({"error": error});
    }
}
async function loginAccount(data){
    try{
        let response = await fetch("/api/user/auth", {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json",
            }
        });
        let result = await response.json();
        if (response.status===200){
            console.log(result)
            // localStorage.setItem('JWT', result.access_token);
            // window.location.reload();
        }else if(response.status===400){
            alert(result["message"]);
            return false;
        }else{
            return false;
        }
    }catch(error){
        console.log({"error": error});
    }
}
async function refresh(){
    try{
        let response = await fetch("/refresh", {
            method: "GET",
        });
        if (response.status===200){
            logout.style.display = "block";
            getRegisterLogin.style.display = "none"
        }else{
            logout.style.display = "none";
            getRegisterLogin.style.display = "block"
            clearInterval(refreshToken);
            return false;
        }
    }catch(error){
        console.log({"error": error});
    }
}
async function logoutAccount(){
    try{
        let response = await fetch("/api/user/auth", {
            method: "DELETE"
        });
        let result = await response.json();
        if (response.status===200){
            console.log(result);
        }else{
            return false;
        }
    }catch(error){
        console.log({"error": error});
    }
}

getRegisterLogin.onclick = function(){
    login.style.display = "flex";
}
loginLeave.onclick = function(){
    login.style.display = "none";
    loginEmail.value = "";
    loginPassword.value = "";
}
registerLeave.onclick = function(){
    register.style.display = "none";
    registerName.value = "";
    registerEmail.value = "";
    registerPassword.value = ""
}
registerNow.onclick = function(){
    login.style.display = "none";
    register.style.display = "flex";
    loginEmail.value = "";
    loginPassword.value = "";
}
loginNow.onclick = function(){
    register.style.display = "none";
    login.style.display = "flex";
    registerName.value = "";
    registerEmail.value = "";
    registerPassword.value = ""
}
function ValidateEmail(input) {
    let validRegex = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
    if (input.value.match(validRegex)) {
        return true;
    } else {
        return false;
    }
}
function ValidatePassword(input) {
    let validRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (input.value.match(validRegex)) {
        return true;
    } else {
        return false;
    }
}