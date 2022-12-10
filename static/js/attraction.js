let image;
let Name;
let category;
let mrt;
let description;
let address;
let transport;
let id = window.location.href.split("/").slice(-1)[0];
const url = "/api/attractions/" + id;
const attractionBox = document.querySelector(".attractionBox");
let errorBooking
let attractionImage;
let chooseMorning;
let chooseAfternoon;
let chooseDate;
let fee;
let imgRadio;

function rightPic(){
    imageIndex = image.indexOf(attractionImage.src);
    imgRadio[imageIndex].checked = false;
    if (imageIndex===image.length-1){
        attractionImage.src = image[0];
        imgRadio[0].checked = true;
    }else{
        attractionImage.src = image[imageIndex + 1];
        imgRadio[imageIndex+1].checked = true;
    }
}
function leftPic(){
    imageIndex = image.indexOf(attractionImage.src)
    imgRadio[imageIndex].checked = false;
    if (imageIndex===0){
        attractionImage.src = image[image.length - 1]
        imgRadio[image.length-1].checked = true;
    }else{
        attractionImage.src = image[imageIndex - 1]
        imgRadio[imageIndex-1].checked = true;
    }
}
function selectMorning(){
    if (chooseAfternoon.checked){
        chooseAfternoon.checked = false;
    }
    fee.textContent = "新台幣2000元"
} 
function selectAfternoon(){
    if (chooseMorning.checked){
        chooseMorning.checked = false;
    }
    fee.textContent = "新台幣2500元"
} 
function booking(){
    let time;
    let price;
    if (!chooseDate.value){
        errorBooking.textContent = "請選日期";
        return false;
    }
    if (chooseMorning.checked){
        time = "morning";
        price = 2000;
    }else if(chooseAfternoon.checked){
        time = "afternoon";
        price = 2500;
    }else{
        errorBooking.textContent = "請選時間";
        return false
    }
    output = {
        "attractionId": id,
        "date": chooseDate.value,
        "time": time,
        "price": price
    }
    bookAttraction(output);
}
async function bookAttraction(data){
    try{
        const isLogin = await fetch("/refresh")
        if (isLogin.status !== 200){
            errorBooking.textContent = "請登入";
            return false;
        }else{
            const options = {
                method: "POST",
                body: JSON.stringify(data),
                credentials: "same-origin",
                headers: {
                    "Content-type": "application/json",
                    "X-CSRF-TOKEN": getCookie("csrf_access_token"),
                },
            };
            const response = await fetch("/api/booking", options);
            if (response.status === 200){
                errorBooking.textContent = "預定成功";
            }
        }
    }catch(error){
        console.log({"error": error})
    }
}
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

fetch(url).then((res)=>{
    return res.json();
}).then((result)=>{
    let data = result.data;
    image = data.image;
    Name = data.name;
    category = data.category;
    mrt = data.mrt;
    description = data.description;
    address = data.address;
    transport = data.transport;
    document.title = Name;
    function imgInput(){
        let inputRadio = "<input type='radio' class='radio'/>";
        for (let i=0; i<image.length-1; i++){
            inputRadio = inputRadio + "<input type='radio' class='radio'/>";
        }
        return inputRadio;
    }

    const html =`
        <div class="attractionBoxInside">
            <div class="attractionTop">
                <div class="attractionTopLeft">
                    <img class="attractionImage" src=${image[0]} alt=""/>
                    <div class="imgArrow">
                        <div class="arrow">
                            <img class="leftArrow" src="/static/image/btn_leftArrow.png" onclick="leftPic()"/>
                            <img class="rightArrow" src="/static/image/btn_rightArrow.png" onclick="rightPic()"/>
                        </div>
                    </div>
                    <div class="imgRadio">
                        <div class="radioInput">
                            ${imgInput()}
                        </div>
                    </div>
                </div>
                <div class="attractionTopRight">
                    <div class="attractionName">${Name}</div>
                    <div class="attractionMrtCat">${category} at ${mrt}</div>
                    <div class="attractionBooking">
                        <div class="attractionBookingBox">
                            <div class="attractionBookingTitle">訂購導覽行程</div>
                            <div class="attractionBookingContent">以此景點為中心的一日行程。帶您探索城市角落故事</div>
                            <div class="attractionBookingDate">
                                <div class="attractionDateTitle">選擇日期：</div>
                                <input class="chooseDate" type="date"/>
                            </div>
                            <div class="attractionBookingTime">
                                <div class="timeTitle">選擇時間：</div>
                                <div class="chooseTime">
                                    <input class="chooseMorning" type="radio" value="morning" onclick="selectMorning()"/>
                                    <div style="line-height:22px">上半天</div>
                                    <input class="chooseAfternoon" type="radio" value="afternoon" onclick="selectAfternoon()"/>
                                    <div style="line-height:22px">下半天</div>
                                </div>
                            </div>
                            <div class="attractionBookingFee">
                                <div class="feeTitle">導覽費用：</div>
                                <div class="fee"></div>
                            </div>
                            <div class="bookingSubmitBox">
                                <button class="bookingSubmit" type="submit" onclick="booking()">開始預約行程</button>
                                <div class="errorBooking"> </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr style="border: 1px solid #E8E8E8; height: 0px">
            <div class="attractionBottom">
                <div class="attractionDescription">${description}</div>
                <div class="AddressTitle">景點地址：</div>
                <div class="attractionAddress">${address}</div>
                <div class="transportTitle">交通方式</div>
                <div class="attractionTransport">${transport}</div>
            </div>
        </div>
    `
    attractionBox.insertAdjacentHTML('beforeend', html);
    
    attractionImage = document.querySelector(".attractionImage"); 
    chooseDate = document.querySelector(".chooseDate");
    chooseMorning = document.querySelector(".chooseMorning");
    chooseAfternoon = document.querySelector(".chooseAfternoon");
    fee = document.querySelector(".fee");
    imgRadio = document.querySelectorAll(".radio");
    imgRadio[0].checked = true;
    errorBooking = document.querySelector(".errorBooking")
})


