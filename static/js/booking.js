const helloItems = document.querySelector(".helloItems")
const bookingItems = document.querySelector(".bookingItems");
const contactItems = document.querySelector(".contactItems");
const creditItems = document.querySelector(".creditItems");
const totalPrice = document.querySelector(".totalPrice");
let bookingData;
let userData;
let userName;
let email;
let attractionId;
let attractionName;
let attractionImage;
let attractionAddress;
let bookingDate;
let bookingTime;
let bookingPrice;
let bookingId;
let totalCost = 0;
let checkTrip = [];
let contactName;
let contactEmail;
let contactNumber;
let creditNumber;
let creditExpire;
let verifyCode;
let checkError;
document.title = "預定行程"

getData()

async function getData(){
    try{
        const options = {
            method: "GET",
        };
        let isLoginResponse = await fetch("/refresh", options);
        if (isLoginResponse.status !== 200){
            window.location.href = "/"
        }
        let bookingResponse = await fetch("/api/booking", options);
        let userResponse = await fetch("/api/user/auth", options);
        bookingResult = await bookingResponse.json();
        userData = await userResponse.json();
        bookingData = bookingResult.data
        userName = userData.name;
        email = userData.email;
        if (typeof bookingData==="undefined"){
            const noneBookingHtml = `
                <div class="bookingInformation">
                    <div class="bookingHello">您好，${userName}，待預定的行程如下：</div>
                    <div class="bookingNone">目前沒有任何預定的行程</div>
                </div>
            `
            bookingItems.insertAdjacentHTML("beforeend", noneBookingHtml);
        }else{
            const helloHtml = `
                <div class="helloWidth"+>
                    <div class="bookingHello">您好，${userName}，待預定的行程如下：</div>
                </div>
            `
            const contactHtml = `
                <div class="contactBoxInside">
                    <div class="contactBoxPosition">
                        <div class="contactInformation">
                            <div class="contactTitle">您的聯絡資訊</div>
                            <div class="contactDetail">
                                <div class="contactName">聯絡姓名：</div>
                                <input id="contactName" class="contactInput" type="text" placeholder="姓名"/>
                            </div>
                            <div class="contactDetail">
                                <div class="contactName">聯絡信箱：</div>
                                <input id="contactEmail" class="contactInput" type="text" placeholder="信箱"/>
                            </div>
                            <div class="contactDetail">
                                <div class="contactName">手機號碼：</div>
                                <input id="contactNumber" class="contactInput" type="text" placeholder="手機號碼"/>
                            </div>
                            <div class="notification">請保持手機暢通，準時到達，導覽人員將用手機與您聯繫，務必留下正確的聯絡方式。</div>
                        </div>
                    </div>
                    <hr style="border: 1px solid #E8E8E8; height: 0px">
                </div>
            `
            const creditHtml = `
                <div class="contactBoxInside">
                    <div class="contactBoxPosition">
                        <div class="contactInformation">
                            <div class="contactTitle">信用卡聯絡資訊</div>
                            <div class="contactDetail">
                                <div class="contactName">卡片號碼：</div>
                                <input id="creditNumber" class="contactInput" type="text" placeholder="**** **** **** ****"/>
                            </div>
                            <div class="contactDetail">
                                <div class="contactName">過期時間：</div>
                                <input id="creditExpire" class="contactInput" type="text" placeholder="MM/YY"/>
                            </div>
                            <div class="contactDetail">
                                <div class="contactName">驗證密碼：</div>
                                <input id="verifyCode" class="contactInput" type="password" placeholder="CVV"/>
                            </div>
                        </div>
                    </div>
                    <hr style="border: 1px solid #E8E8E8; height: 0px">
                </div>
            `
            helloItems.insertAdjacentHTML("beforeend", helloHtml);
            contactItems.insertAdjacentHTML("beforeend", contactHtml);
            creditItems.insertAdjacentHTML("beforeend", creditHtml);
            contactName = document.getElementById("contactName");
            contactEmail = document.getElementById("contactEmail");
            contactNumber = document.getElementById("contactNumber");
            creditNumber = document.getElementById("creditNumber");
            creditExpire = document.getElementById("creditExpire");
            verifyCode = document.getElementById("verifyCode");
            for (let i=0; i<bookingData.length; i++){
                attractionId = bookingData[i].attraction.id;
                attractionName = bookingData[i].attraction.name;
                attractionImage = bookingData[i].attraction.image;
                attractionAddress = bookingData[i].attraction.address;
                bookingDate = bookingData[i].date;
                bookingTime = bookingData[i].time;
                bookingPrice = bookingData[i].price;
                bookingId = bookingData[i].id;
                totalCost = totalCost + bookingPrice;
                let trip = {
                    "attraction": {
                        "id": attractionId,
                        "name": attractionName,
                        "address": attractionAddress,
                        "image": attractionImage
                    },
                    "date": bookingDate,
                    "time": bookingTime
                }
                checkTrip.push(trip);
                const bookingHtml = `
                    <div class="contactBoxInside">
                        <div class="contactBoxPosition">
                            <div class="bookingInformation">
                                <div class="bookingDetail">
                                    <img class="bookingAttractionImage" src=${attractionImage} alt=""/>
                                    <div class="informationBox">
                                        <div class="bookingName">台北一日遊：${attractionName}</div>
                                        <div class="bookingTitle">日期：<span class="bookingContent">${bookingDate}</span></div>
                                        <div class="bookingTitle">時間：<span class="bookingContent">${bookingTime}</span></div>
                                        <div class="bookingTitle">費用：<span class="bookingContent">新台幣${bookingPrice}</span></div>
                                        <div class="bookingTitle">地點：<span class="bookingContent">${attractionAddress}</span></div>
                                        <div class="bookingTitle">訂單編號：<span class="bookingContent">${bookingId}</span></div>
                                    </div>
                                    <div class="deleteDiv">
                                        <img class="bookingDelete" onclick="deleteThis(this)" src="/static/image/icon_delete.png" alt=""/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr style="border: 1px solid #E8E8E8; height: 0px">
                    </div>
                `
                bookingItems.insertAdjacentHTML("beforeend", bookingHtml);
            }
            const priceHtml = `
                <div class="finalPrice">
                    <div class="verifyPosition">
                        <div class="priceTotal">總價：新台幣 ${totalCost} 元</div>
                    </div>
                    <div class="verifyPosition">
                        <button id="checkAndPay" class="checkBtn" onclick="checkAndPay()">確認訂購並付款</button>
                    </div>
                    <div class="verifyPosition">
                        <div class="checkError"></div>
                    </div>
                </div>
            `
            totalPrice.insertAdjacentHTML("beforeend", priceHtml);
            checkError = document.querySelector(".checkError")
            // credit number format
            const creditNumberInput = document.getElementById('creditNumber');
            creditNumberInput.addEventListener("keydown", (event) => {
                const input = event.target.value;
                const digitsOnly = input.replace(/\D/g, ""); 
                if (event.key.length === 1 && digitsOnly.length > 15) {
                    event.preventDefault();
                }
            });
            creditNumberInput.addEventListener("keyup", (event) => {
                const input = event.target.value;
                const formattedInput = input.replace(/\D/g, "").replace(/(\d{4})/g, "$1 ").trim();
                creditNumberInput.value = formattedInput;
            });
            // expire month format
            const creditExpireInput = document.getElementById("creditExpire");
            creditExpireInput.addEventListener("keydown", (event) => {
                const input = event.target.value;
                const digitsOnly = input.replace(/\D/g, "");
                if (event.key.length === 1 && digitsOnly.length > 3) {
                    event.preventDefault();
                }
            });
            creditExpireInput.addEventListener("keyup", (event) => {
                const input = event.target.value;
                const formattedInput = input.replace(/\D/g, "").replace(/^(\d{2})(\d{2})$/g, '$1/$2');                
                creditExpireInput.value = formattedInput;
            });
            // CCV format
            const verifyCodeInput = document.getElementById("verifyCode");
            verifyCodeInput.addEventListener("keydown", (event) => {
                const input = event.target.value;
                const digitsOnly = input.replace(/\D/g, "");
                if (event.key.length === 1 && digitsOnly.length > 2) {
                    event.preventDefault();
                }
            });
            verifyCodeInput.addEventListener("input", (event) => {
                const input = event.target.value;
                const digitsOnly = input.replace(/\D/g, ''); 
                verifyCodeInput.value = digitsOnly;
            });
        }
    }catch(error){
        console.log({"error": error});
    }
}
function checkAndPay(){
    checkInformation();
}
async function deleteBooking(data){
    try{
        const isLogin = await fetch("/refresh")
        if (isLogin.status !== 200){
            alert("請登入");
            window.location.href = "/"
        }else{
            let response = await fetch("/api/booking", {
                method: "DELETE",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": getCookie("csrf_access_token")
                }
            });
            if (response.status === 200){
                window.location.reload();
            }
        }
    }catch(error){
        console.log({"error":error});
    }
}
async function checkInformation(data){
    try{
        const isLogin = await fetch("/refresh")
        if (isLogin.status !== 200){
            alert("請登入");
            window.location.href = "/"
        }else{
            if (!contactName.value || !contactEmail.value || !contactNumber.value){
                checkError.textContent = "請輸入聯絡資訊";
                return false;
            }else{
                const output = {
                    "prime": "前端從第三方金流 TopPay 取得的交易碼",
                    "order": {
                        "price": totalCost,
                        "trip": checkTrip
                    },
                    "contact": {
                        "name": contactName.value,
                        "email": contactEmail.value,
                        "phone": contactNumber.value
                    }
                };
                postOrder(output);
            }
        }
    }catch(error){
        console.log({"error":error});
    }
}
async function postOrder(data){
    try{
        let response = await fetch("/api/orders", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": getCookie("csrf_access_token")
            }
        });
        let result = await response.json();
        if (response.status === 200){
            console.log(result);
            checkError.textContent = "完成訂單"
        }
    }catch(error){
        console.log({"error":error})
    }
}
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
function deleteThis(element){
    itemNumber = element.offsetParent.innerText.split("：").slice(-1)[0];
    deleteBooking({"deleteId": itemNumber});
}


