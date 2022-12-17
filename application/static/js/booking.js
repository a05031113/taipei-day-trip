document.title = "預定行程"
const helloItems = document.querySelector(".helloItems");
const bookingItems = document.querySelector(".bookingItems");
const contactItems = document.querySelector(".contactItems");
const creditItems = document.querySelector(".creditItems");
const priceItems = document.querySelector(".priceItems");
const total = document.getElementById("total");
const loading = document.querySelector(".loading");
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
const contactName = document.getElementById("contactName");
const contactEmail = document.getElementById("contactEmail");
const contactNumber = document.getElementById("contactNumber");
// const creditNumber = document.getElementById("card-number");
// const creditExpire = document.getElementById("card-expiration-date");
// const verifyCode = document.getElementById("card-ccv");
const checkError = document.querySelector(".checkError");
const checkAndPay = document.getElementById("checkAndPay");
getData();

TPDirect.setupSDK(
    126838, 
    'app_b4aKLpBYbjJFFoe5Yg277LDwRU8dczg2Ll0r262iWxWusoPD5vq0nOs1rw3p', 
    'sandbox'
);
TPDirect.card.setup({
    fields: {
        number: {
            element: "#card-number",
            placeholder: '**** **** **** ****'
        },
        expirationDate: {
            element: "#card-expiration-date",
            placeholder: 'MM / YY'
        },
        ccv: {
            element: "#card-ccv",
            placeholder: 'CCV'
        }
    },
    styles: {
        'input': {
            'color': 'gray',
            'font-size': '16px'
        },
        'input.number':{
            'font-size': '16px'
        },
        'input.expirationDate':{
            'font-size': '16px'
        },
        'input.ccv': {
            'font-size': '16px'
        },
        ':focus': {
            'color': 'black'
        },
        '.valid': {
            'color': 'green'
        },
        '.invalid': {
            'color': 'red'
        },
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'orange'
            }
        }
    },
    isMaskCreditCardNumber: true,
    maskCreditCardNumberRange: {
        beginIndex: 6, 
        endIndex: 11
    }
});
checkAndPay.addEventListener("click", ()=>{
    TPDirect.card.getPrime(function (result) {
        if (!contactName.value || !contactEmail.value || !contactNumber.value){
            checkError.textContent = "請輸入聯絡資訊";
            return false;
        }
        if (result.status !==0){
            checkError.textContent = "請輸入信用卡資訊";
            return false;
        }
        let primeCode = result.card.prime;
        const output = {
            "prime": primeCode,
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
        checkInformation(output);
    });
});
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
            helloItems.innerHTML = "";
            bookingItems.innerHTML = "";
            contactItems.innerHTML = "";
            creditItems.innerHTML = "";
            priceItems.innerHTML = "";    
            noneBookingRender();            
        }else{
            helloRender();
            bookingRender();
        }
    }catch(error){
        console.log({"error": error});
    }
}
function noneBookingRender(){
    const noneBookingHtml = `
        <div class="helloWidth">
            <div class="bookingHello">您好，${userName}，待預定的行程如下：</div>
            <div class="bookingNone">目前沒有任何預定的行程</div>
        </div>
    `
    helloItems.insertAdjacentHTML("beforeend", noneBookingHtml);
}
function helloRender(){
    const helloHtml = `
        <div class="helloWidth"+>
            <div class="bookingHello">您好，${userName}，待預定的行程如下：</div>
        </div>
    `
    helloItems.insertAdjacentHTML("beforeend", helloHtml);
}
function bookingRender(){
    for (let i=0; i<bookingData.length; i++){
        attractionId = bookingData[i].attraction.id;
        attractionName = bookingData[i].attraction.name;
        attractionImage = bookingData[i].attraction.image;
        attractionAddress = bookingData[i].attraction.address;
        bookingDate = bookingData[i].date;
        bookingTime = bookingData[i].time;
        bookingPrice = bookingData[i].price;
        bookingId = bookingData[i].id;
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
        contactName.value = userName;
        contactEmail.value = email;
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
    }
    const priceHtml = `
        <div class="priceTotal">總價：新台幣 ${totalCost} 元</div>
    `
    total.insertAdjacentHTML("beforeend", priceHtml);
    loading.style.display = "none";
}
async function checkInformation(output){
    try{
        const isLogin = await fetch("/refresh")
        if (isLogin.status !== 200){
            window.location.href = "/"
        }else{
            postOrder(output);    
        }
    }catch(error){
        console.log({"error":error});
    }
}
function deleteThis(element){
    const itemNumber = element.offsetParent.innerText.split("：").slice(-1)[0];
    element.offsetParent.parentElement.parentElement.parentElement.innerHTML="";
    deleteBooking({"deleteId": itemNumber});
    const deleteBtn = document.querySelector(".bookingDelete");
    if (!deleteBtn){
        helloItems.innerHTML = "";
        bookingItems.innerHTML = "";
        contactItems.innerHTML = "";
        creditItems.innerHTML = "";
        priceItems.innerHTML = "";
        noneBookingRender();
    }
}
async function deleteBooking(data){
    try{
        const isLogin = await fetch("/refresh")
        if (isLogin.status !== 200){
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
                return true;
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



