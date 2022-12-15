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
const attractionTopLeft = document.querySelector(".attractionTopLeft");
const attractionTopRight = document.querySelector(".attractionTopRight");
const attractionBottom = document.querySelector(".attractionBottom");
let errorBooking;
getAttractions(url)
async function getAttractions(url){
    try{
        const options = {
            method: "GET"
        };
        response = await fetch(url, options);
        result = await response.json();
        let data = result.data;
        image = data.image;
        Name = data.name;
        category = data.category;
        mrt = data.mrt;
        description = data.description;
        address = data.address;
        transport = data.transport;
        document.title = Name;
        topLeftRender();
        topRightRender();
        bottomRender();
    }catch(error){
        console.log({"error": error})
    }
}
function topLeftRender(){
    const topLeftHtml = `
        <img class="attractionImage" src=${image[0]} alt=""/>
        <div class="imgArrow">
            <div class="arrow">
                <img class="leftArrow" src="/static/image/btn_leftArrow.png"/>
                <img class="rightArrow" src="/static/image/btn_rightArrow.png"/>
            </div>
        </div>
        <div class="imgRadio">
            <div class="radioInput">
                ${imgInput()}
            </div>
        </div>
    `
    attractionTopLeft.insertAdjacentHTML('beforeend', topLeftHtml);
    const attractionImage = document.querySelector(".attractionImage");
    const leftArrow = document.querySelector(".leftArrow");
    const rightArrow = document.querySelector(".rightArrow");
    const imgRadio = document.querySelectorAll(".radio");
    imgRadio[0].checked = true;
    rightArrow.addEventListener("click", ()=>{
        imageIndex = image.indexOf(attractionImage.src);
        imgRadio[imageIndex].checked = false;
        if (imageIndex===image.length-1){
            attractionImage.src = image[0];
            imgRadio[0].checked = true;
        }else{
            attractionImage.src = image[imageIndex + 1];
            imgRadio[imageIndex+1].checked = true;
        }
    });
    leftArrow.addEventListener("click", ()=>{
        imageIndex = image.indexOf(attractionImage.src)
        imgRadio[imageIndex].checked = false;
        if (imageIndex===0){
            attractionImage.src = image[image.length - 1]
            imgRadio[image.length-1].checked = true;
        }else{
            attractionImage.src = image[imageIndex - 1]
            imgRadio[imageIndex-1].checked = true;
        }
    });
    function imgInput(){
        let inputRadio = `<input type='radio' class='radio'/>`;
        for (let i=0; i<image.length-1; i++){
            inputRadio = inputRadio + `<input type='radio' class='radio'/>`;
        }
        return inputRadio;
    }
}
function topRightRender(){
    const topRightHtml = `
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
                        <input class="chooseMorning" type="radio" value="morning"/>
                        <div style="line-height:22px">上半天</div>
                        <input class="chooseAfternoon" type="radio" value="afternoon"/>
                        <div style="line-height:22px">下半天</div>
                    </div>
                </div>
                <div class="attractionBookingFee">
                    <div class="feeTitle">導覽費用：</div>
                    <div class="fee"></div>
                </div>
                <div class="bookingSubmitBox">
                    <button class="bookingSubmit" type="submit">開始預約行程</button>
                    <div class="errorBooking"></div>
                </div>
            </div>
        </div>
    `
    attractionTopRight.insertAdjacentHTML("beforeend", topRightHtml);
    const chooseDate = document.querySelector(".chooseDate");
    const chooseMorning = document.querySelector(".chooseMorning");
    const chooseAfternoon = document.querySelector(".chooseAfternoon");
    const bookingSubmit = document.querySelector(".bookingSubmit");
    const fee = document.querySelector(".fee");
    errorBooking = document.querySelector(".errorBooking");
    chooseMorning.addEventListener("click", ()=>{
        if (chooseAfternoon.checked){
            chooseAfternoon.checked = false;
        }
        fee.textContent = "新台幣2000元"
    });
    chooseAfternoon.addEventListener("click", ()=>{
        if (chooseMorning.checked){
            chooseMorning.checked = false;
        }
        fee.textContent = "新台幣2500元"
    });
    bookingSubmit.addEventListener("click", ()=>{
        let time;
        let price;
        if (!chooseDate.value){
            errorBooking.textContent = "請選日期";
            return false;
        }
        if (!chooseMorning.checked && !chooseAfternoon.checked){
            errorBooking.textContent = "請選時間";
            return false
        }else{
            if (chooseMorning.checked){
                time = "morning";
                price = 2000;
            }else if(chooseAfternoon.checked){
                time = "afternoon";
                price = 2500;
            }
        }
        output = {
            "attractionId": id,
            "date": chooseDate.value,
            "time": time,
            "price": price
        }
        bookAttraction(output);
    });
}
function bottomRender(){
    const bottomHtml = `
        <div class="attractionDescription">${description}</div>
        <div class="AddressTitle">景點地址：</div>
        <div class="attractionAddress">${address}</div>
        <div class="transportTitle">交通方式</div>
        <div class="attractionTransport">${transport}</div>
    `
    attractionBottom.insertAdjacentHTML("beforeend", bottomHtml)
}
async function bookAttraction(data){
    try{
        const isLogin = await fetch("/refresh")
        if (isLogin.status !== 200){
            login.style.display = "flex";
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



