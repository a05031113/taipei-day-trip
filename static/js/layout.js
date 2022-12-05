const getRegisterLogin = document.getElementById("getRegisterLogin");
const logout = document.getElementById("logout");
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
const registerBtn = document.getElementById("registerBtn");
const bookingBtn = document.querySelector(".project");
const loginFail = document.querySelector(".loginFail");
const registerFail = document.querySelector(".registerFail");
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
            registerAccount(data)
        }else{
            registerFail.textContent = "密碼至少需8位英文大小寫與數字";

        }
    }else{
        registerFail.textContent = "email格式錯誤";
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
        loginFail.textContent = "請輸入帳號及密碼";
    }
}
logout.onclick = function(){
    sessionStorage.removeItem("jwt");
    logoutAccount()
    window.location.reload();
}
bookingBtn.onclick = function(){
    window.location.href = "/booking"
}
async function registerAccount(data){
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
            registerFail.textContent = "註冊成功！"
        }else if(response.status===400){
            registerFail.textContent = result.message;
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
            window.location.reload();
        }else if(response.status===400){
            loginFail.textContent = result.message;
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
        let result = await response.json();
        if (response.status===200){
            sessionStorage.setItem('jwt', result.access_token)
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
            return true;
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
    loginFail.textContent = "";
}
registerLeave.onclick = function(){
    register.style.display = "none";
    registerName.value = "";
    registerEmail.value = "";
    registerPassword.value = ""
    registerFail.textContent = "";
}
registerNow.onclick = function(){
    login.style.display = "none";
    register.style.display = "flex";
    loginEmail.value = "";
    loginPassword.value = "";
    loginFail.textContent = "";
}
loginNow.onclick = function(){
    register.style.display = "none";
    login.style.display = "flex";
    registerName.value = "";
    registerEmail.value = "";
    registerPassword.value = "";
    registerFail.textContent = "";
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