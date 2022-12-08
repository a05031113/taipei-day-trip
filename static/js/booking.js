const bookingBox = document.querySelector(".bookingBox");
let bookingData;
let userData;
let Name;
let email;


async function getData(){
    try{
        const options = {
            method: "GET",
        };
        let bookingResponse = await fetch("/api/booking", options);
        let userResponse = await fetch("/api/user/auth", options);
        bookingData = await bookingResponse.json();
        userData = await userResponse.json();
        Name = userData.name;
        email = userData.email;

        if (!bookingData.data){
            const noneBookingHtml = `
                <div class="bookingBoxInside">
                    <div class="bookingHello">您好，${Name}，待預定的行程如下：</div>
                    <div class="bookingNone">目前沒有任何預定的行程</div>
                </div>
            `
            bookingBox.insertAdjacentHTML("beforeend", noneBookingHtml);
        }else{
            console.log(bookingData)
            const bookingHtml = `

            `
            bookingBox.insertAdjacentHTML("beforeend", bookingHtml);
        }
    }catch(error){
        console.log({"error": error});
    }
}
getData()
