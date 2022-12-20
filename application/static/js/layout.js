const getRegisterLogin = document.getElementById("getRegisterLogin");
const logout = document.getElementById("logout");
const popup = document.querySelector(".popup");
const popupContent = document.querySelector(".popupContent");
const leave = document.querySelector(".leave");
const memberPage = document.getElementById("memberPage");
const userSystem = document.querySelector(".userSystem");
const bookingBtn = document.querySelector(".project");
const orderBtn = document.getElementById("historyOrder");
const ghost = document.querySelector(".ghost");
const loginFail = document.querySelector(".loginFail");
const loginHtml = `
    <div class="loginHeader"></div>
    <div class="loginTitle">登入會員帳號</div>
    <input id="loginEmail" class="loginEmail" type="text" placeholder="請輸入電子信箱" name="loginEmail"/>
    <input id="loginPassword" class="loginPassword" type="password" placeholder="輸入密碼" name="loginPassword"/>
    <button id="loginBtn" class="loginBtn">登入帳號</button>
    <div class="loginFail"></div>
    <div class="registerNow">還沒有帳戶？點此註冊</div>    
`
const registerHtml = `
    <div class="loginHeader"></div>
    <div class="loginTitle">註冊會員帳號</div>
    <input id="registerName" class="loginEmail" type="text" placeholder="輸入姓名" name="registerName"/>
    <input id="registerEmail" class="loginEmail" type="text" placeholder="請輸入電子信箱" name="registerEmail"/>
    <input id="registerPassword" class="loginPassword" type="password" placeholder="輸入密碼" name="registerPassword"/>
    <button id="registerBtn" class="loginBtn">註冊新帳戶</button>
    <div class="registerFail"></div>
    <div class="loginNow">還沒有帳戶？點此註冊</div>
`
refresh();
getRegisterLogin.addEventListener("click", ()=>{
    loginForm();
});
logout.addEventListener("click", ()=>{
    logoutAccount();
});
bookingBtn.addEventListener("click", ()=>{
    bookingPage();
});
memberPage.addEventListener("click", ()=>{
    userSystem.style.display = "block";
    ghost.style.display = "block";
});
window.addEventListener("click", (event)=>{
    if (event.target===ghost){
        userSystem.style.display = "none";
        ghost.style.display = "none";
    }
});
orderBtn.addEventListener("click", ()=>{
    window.location.href = "/order"
});
leave.addEventListener("click", ()=>{
    popup.style.display = "none";
    popupContent.innerHTML = ""
});
function loginForm(){
    popupContent.innerHTML = "";
    popup.style.display = "flex";
    popupContent.insertAdjacentHTML('beforeend', loginHtml);
    const registerNow = document.querySelector(".registerNow");
    const loginEmail = document.getElementById("loginEmail");
    const loginPassword = document.getElementById("loginPassword");
    const loginBtn = document.getElementById("loginBtn");
    const loginFail = document.querySelector(".loginFail");
    loginBtn.addEventListener("click", ()=>{
        if (loginEmail && loginPassword){
            const data = {
                "email": loginEmail.value,
                "password": loginPassword.value
            };
            loginAccount(data)
        }else{
            loginFail.textContent = "請輸入帳號及密碼";
        }
    });
    registerNow.addEventListener("click", ()=>{
        registerForm();
    });
}
function registerForm(){
    popupContent.innerHTML = "";
    popup.style.display = "flex";
    popupContent.insertAdjacentHTML('beforeend', registerHtml);
    const loginNow = document.querySelector(".loginNow");
    const registerName = document.getElementById("registerName");
    const registerEmail = document.getElementById("registerEmail");
    const registerPassword = document.getElementById("registerPassword");
    const registerFail = document.querySelector(".registerFail");
    const registerBtn = document.getElementById("registerBtn");
    registerBtn.addEventListener("click", ()=>{
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
    });
    loginNow.addEventListener("click", ()=>{
        loginForm();
    });
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
            popupContent.innerHTML = "";
            const registerSuccessHtml= `
                <div class="popupDiv">
                    <div>
                        <div class="popupMessage">註冊成功！</div>
                        <div class="popupSubMessage">稍後為您跳轉登入頁面</div>
                    </div>
                </div>
            `
            popupContent.insertAdjacentHTML('beforeend', registerSuccessHtml);
            setTimeout(()=>{
                loginForm();
            }, 2000);
        }else if(response.status===400){
            const registerFail = document.querySelector(".registerFail");
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
            popupContent.innerHTML = "";
            const loginSuccessHtml= `
                <div class="popupDiv">
                    <div>
                        <div class="popupMessage">登入成功！</div>
                        <div class="popupSubMessage">稍後為您跳轉</div>
                    </div>
                </div>
            `
            popupContent.insertAdjacentHTML('beforeend', loginSuccessHtml);
            setTimeout(()=>{
                window.location.reload();
            }, 2000);
        }else if(response.status===400){
            const loginFail = document.querySelector(".loginFail");
            loginFail.textContent = "帳號或密碼有誤";
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
            memberPage.style.display = "block";
            getRegisterLogin.style.display = "none"
        }else{
            memberPage.style.display = "none";
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
            window.location.reload();
        }else{
            return false;
        }
    }catch(error){
        console.log({"error": error});
    }
}
async function bookingPage(){
    try{
        const isLogin = await fetch("/refresh")
        if (isLogin.status !== 200){
            loginForm();
        }else{
            window.location.href="/booking"
        }
    }catch(error){
        console.log({"error":error});
    }
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