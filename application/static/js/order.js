document.title = "歷史訂單";
const loading = document.querySelector(".loading");
const helloItems = document.querySelector(".helloItems");
const bookingItems = document.querySelector(".bookingItems");
let userName;
let orderData;

getOrderData()

async function getOrderData(){
    try{
        const options = {
            method: "GET",
        };
        const isLogin = await fetch("/refresh")
        if (isLogin.status !== 200){
            window.location.href = "/";
        }else{
            const orderResponse = await fetch("/api/orders", options);
            const userResponse = await fetch("/api/user/auth", options);
            const orderResult = await orderResponse.json();
            const userData = await userResponse.json();
            orderData = orderResult.data;
            console.log(orderData)
            userName = userData.name;
            if (orderData[0] === undefined){
                noneOrderRender();
            }else{
                helloRender();
                orderRender();
            }
        }
    }catch(error){
        console.log({"error": error});
    }
}
function noneOrderRender(){
    const noneBookingHtml = `
        <div class="helloWidth">
            <div class="bookingHello">您好，${userName}，您已訂購的行程如下：</div>
            <div class="bookingNone">目前沒有訂購任何行程</div>
        </div>
    `
    helloItems.insertAdjacentHTML("beforeend", noneBookingHtml);
    loading.style.display = "none";
}
function helloRender(){
    const helloHtml = `
        <div class="helloWidth"+>
            <div class="bookingHello">您好，${userName}，您已訂購的行程如下：</div>
        </div>
    `
    helloItems.insertAdjacentHTML("beforeend", helloHtml);
}
function orderRender(){
    for (let i=0; orderData.length; i++){
        const trip = orderData[i].trip
        const orderNumber = orderData[i].number;
        const contactName = orderData[i].contact.name;
        const contactEmail = orderData[i].contact.email;
        const contactPhone = orderData[i].contact.phone;
        const price = orderData[i].price;
        let orderStatus;
        if (orderData[i].status===1){
            orderStatus = "已付款";
        }else{
            orderStatus = `<span>未付款(重新付款)</span>`;
        }
        const orderHtml = `
            <div class="orderBox">
                <div class="orderInformation">
                    <div class="bookingTitle">訂單編號：<span class="bookingContent">${orderNumber}</span></div>
                    <div class="bookingTitle">聯絡姓名：<span class="bookingContent">${contactName}</span></div>
                    <div class="bookingTitle">聯絡信箱：<span class="bookingContent">${contactEmail}</span></div>
                    <div class="bookingTitle">手機號碼：<span class="bookingContent">${contactPhone}</span></div>
                    <div class="bookingTitle">訂單價格：<span class="bookingContent">新台幣${price}</span></div>
                    <div class="bookingTitle">付款狀態：<span class="bookingContent">${orderStatus}</span></div>
                </div>
            </div>
            ${attractionOrder(trip)}
            <hr style="border: 1px solid #E8E8E8; height: 0px">
        `
        bookingItems.insertAdjacentHTML("beforeend", orderHtml);
        loading.style.display = "none";
    }
}
function attractionOrder(trip){
    let attractionHtml = ``;
    for (let i=0; i<trip.length; i++){
        const attractionImage = trip[i].attraction.image;
        const attractionName = trip[i].attraction.name;
        const bookingDate = trip[i].date;
        const bookingTime = trip[i].time;
        const attractionAddress = trip[i].attraction.address;
        const addHtml = `
            <div class="contactBoxInside">
                <div class="contactBoxPosition">
                    <div class="bookingInformation">
                        <div class="bookingDetail">
                            <img class="bookingAttractionImage" src=${attractionImage} alt=""/>
                            <div class="informationBox">
                                <div class="bookingName">台北一日遊：${attractionName}</div>
                                <div class="bookingTitle">日期：<span class="bookingContent">${bookingDate}</span></div>
                                <div class="bookingTitle">時間：<span class="bookingContent">${bookingTime}</span></div>
                                <div class="bookingTitle">地點：<span class="bookingContent">${attractionAddress}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
        attractionHtml = attractionHtml + addHtml;
    }
    return attractionHtml;
}