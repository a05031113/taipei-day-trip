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
const loading = document.querySelector(".loading");
let bookingImg;
let errorBooking;
let isBooking = false;
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
        ${imgInput()}
        <div class="imgArrow">
            <div class="arrow">
                <img class="leftArrow" src="/static/image/btn_leftArrow.png"/>
                <img class="rightArrow" src="/static/image/btn_rightArrow.png"/>
            </div>
        </div>
        <div class="imgRadio">
            <div class="radioInput">
                ${radioInput()}
            </div>
        </div>
    `
    attractionTopLeft.insertAdjacentHTML('beforeend', topLeftHtml);
    const attractionImage = document.querySelectorAll(".attractionImage");
    const leftArrow = document.querySelector(".leftArrow");
    const rightArrow = document.querySelector(".rightArrow");
    const imgRadio = document.querySelectorAll(".radio");
    attractionImage[0].style.display = "block";
    imgRadio[0].checked = true;
    loading.style.display = "none";
    rightArrow.addEventListener("click", ()=>{
        for (let i = 0; i<image.length; i++){
            if (imgRadio[i].checked){
                imageIndex = i;
                break;
            }
        }
        attractionImage[imageIndex].style.display = "none";
        imgRadio[imageIndex].checked = false;
        if (imageIndex===image.length-1){
            attractionImage[0].style.display = "block";
            imgRadio[0].checked = true;
        }else{
            attractionImage[imageIndex + 1].style.display = "block";
            imgRadio[imageIndex+1].checked = true;
        }
    });
    leftArrow.addEventListener("click", ()=>{
        for (let i = 0; i<image.length; i++){
            if (imgRadio[i].checked){
                imageIndex = i;
                break;
            }
        }
        attractionImage[imageIndex].style.display = "none";
        imgRadio[imageIndex].checked = false;
        if (imageIndex===0){
            attractionImage[image.length - 1].style.display = "block";
            imgRadio[image.length-1].checked = true;
        }else{
            attractionImage[imageIndex - 1].style.display = "block";
            imgRadio[imageIndex-1].checked = true;
        }
    });
    function radioInput(){
        let inputRadio = `<input type='radio' class='radio'/>`;
        for (let i=0; i<image.length-1; i++){
            inputRadio = inputRadio + `<input type='radio' class='radio'/>`;
        }
        return inputRadio;
    }
    function imgInput(){
        let imgAttraction = `<img class="attractionImage" src=${image[0]} style="display:none;" alt=""/>`
        for (let i=1; i<image.length; i++){
            imgAttraction = imgAttraction + `<img class="attractionImage" src=${image[i]} style="display:none;" alt=""/>`
        }
        return imgAttraction;
    }
}
function topRightRender(){
    const topRightHtml = `
        <div class="attractionName">${Name}</div>
        <div class="attractionMrtCat">${category} at ${mrt}</div>
        <div class="attractionBooking">
            <div class="attractionBookingBox">
                <div class="attractionBookingTitle">??????????????????</div>
                <div class="attractionBookingContent">?????????????????????????????????????????????????????????????????????</div>
                <div class="attractionBookingDate">
                    <div class="attractionDateTitle">???????????????</div>
                    <input class="chooseDate" type="date"/>
                </div>
                <div class="attractionBookingTime">
                    <div class="timeTitle">???????????????</div>
                    <div class="chooseTime">
                        <input class="chooseMorning" type="radio" value="morning"/>
                        <div style="line-height:22px">?????????</div>
                        <input class="chooseAfternoon" type="radio" value="afternoon"/>
                        <div style="line-height:22px">?????????</div>
                    </div>
                </div>
                <div class="attractionBookingFee">
                    <div class="feeTitle">???????????????</div>
                    <div class="fee"></div>
                </div>
                <div class="bookingSubmitBox">
                    <button class="bookingSubmit" type="submit">??????????????????</button>
                    <img class="bookingImg" src="/static/image/trading.gif" alt=""/>
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
    bookingImg = document.querySelector(".bookingImg");
    errorBooking = document.querySelector(".errorBooking");
    chooseMorning.addEventListener("click", ()=>{
        if (chooseAfternoon.checked){
            chooseAfternoon.checked = false;
        }
        fee.textContent = "?????????2000???"
    });
    chooseAfternoon.addEventListener("click", ()=>{
        if (chooseMorning.checked){
            chooseMorning.checked = false;
        }
        fee.textContent = "?????????2500???"
    });
    bookingSubmit.addEventListener("click", ()=>{
        if (!isBooking){
            isBooking = true;
            bookingImg.style.display = "block"
            let time;
            let price;
            if (!chooseDate.value){
                errorBooking.textContent = "????????????";
                isBooking = false;
                bookingImg.style.display = "none";
                return false;
            }
            if (!chooseMorning.checked && !chooseAfternoon.checked){
                errorBooking.textContent = "????????????";
                bookingImg.style.display = "none";
                isBooking = false;
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
        }
    });
}
function bottomRender(){
    const bottomHtml = `
        <div class="attractionDescription">${description}</div>
        <div class="AddressTitle">???????????????</div>
        <div class="attractionAddress">${address}</div>
        <div class="transportTitle">????????????</div>
        <div class="attractionTransport">${transport}</div>
    `
    attractionBottom.insertAdjacentHTML("beforeend", bottomHtml)
}
async function bookAttraction(data){
    try{
        const isLogin = await fetch("/refresh")
        if (isLogin.status !== 200){
            loginForm();
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
                popupContent.innerHTML = "";
                popup.style.display = "flex"
                const loginSuccessHtml= `
                    <div class="popupDiv">
                        <div>
                            <div class="popupMessage">???????????????</div>
                            <div class="popupSubMessage">?????????????????????????????????</div>
                        </div>
                    </div>
                `
                popupContent.insertAdjacentHTML('beforeend', loginSuccessHtml);
                bookingImg.style.display = "none";
                setTimeout(()=>{
                    window.location.href = "/booking";
                }, 2000);
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



