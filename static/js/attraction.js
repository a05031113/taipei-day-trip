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
let attractionImage;
let chooseMorning;
let chooseAfternoon;
let chooseDate;
let fee;

function rightPic(){
    imageIndex = image.indexOf(attractionImage.src)
    if (imageIndex===image.length-1){
        attractionImage.src = image[0]
    }else{
        attractionImage.src = image[imageIndex + 1]
    }
}
function leftPic(){
    imageIndex = image.indexOf(attractionImage.src)
    if (imageIndex===0){
        attractionImage.src = image[image.length - 1]
    }else{
        attractionImage.src = image[imageIndex - 1]
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
        return false;
    }
    if (chooseMorning.checked){
        time = "morning";
        price = 2000;
    }else if(chooseAfternoon.checked){
        time = "afternoon";
        price = 2500;
    }else{
        return false;
    }
    output = {
        "data":{
            "attraction":{
                "id": id,
                "name": Name,
                "address": address,
                "image": image
            },
            "date": chooseDate.value,
            "time": time,
            "price": price
        }
    }
    console.log(output)
}

fetch(url).then((res)=>{
    return res.json();
}).then((result)=>{
    let data = result["data"];
    image = data["image"];
    Name = data["name"];
    category = data["category"];
    mrt = data["mrt"];
    description = data["description"];
    address = data["address"];
    transport = data["transport"];

    const html =`
        <div class="attractionBoxInside">
            <div class="attractionTop">
                <div class="attractionTopLeft">
                    <img class="attractionImage" src=${image[0]} alt=""/>
                    <img class="leftArrow" src="/static/image/btn_leftArrow.png" onclick="leftPic()"/>
                    <img class="rightArrow" src="/static/image/btn_rightArrow.png" onclick="rightPic()"/>
                </div>
                <div class="attractionTopRight">
                    <div class="attractionName">${Name}</div>
                    <div class="attractionMrtCat">${category} at ${mrt}</div>
                    <div class="attractionBooking">
                        <div class="bookingBox">
                            <div class="bookingTitle">訂購導覽行程</div>
                            <div class="bookingContent">以此景點為中心的一日行程。帶您探索城市角落故事</div>
                            <div class="bookingDate">
                                <div class="dateTitle">選擇日期：</div>
                                <input class="chooseDate" type="date"/>
                            </div>
                            <div class="bookingTime">
                                <div class="timeTitle">選擇時間：</div>
                                <div class="chooseTime">
                                    <input class="chooseMorning" type="radio" value="morning" onclick="selectMorning()"/>
                                    <div style="line-height:22px">上半天</div>
                                    <input class="chooseAfternoon" type="radio" value="afternoon" onclick="selectAfternoon()"/>
                                    <div style="line-height:22px">下半天</div>
                                </div>
                            </div>
                            <div class="bookingFee">
                                <div class="feeTitle">導覽費用：</div>
                                <div class="fee"></div>
                            </div>
                            <button class="bookingSubmit" type="submit" onclick="booking()">開始預約行程</button>
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
})