let searchSearchDiv = document.querySelector(".searchInput");
let attractionsDiv = document.querySelector(".attractionsBox");
let nextPage;
let keyword;
// index
let url = "/api/attractions?page=0";
let page = 0;
getAttractions(url);
// search with keyword
keywordDiv = document.querySelector(".searchInput")
let searchBtn = document.querySelector(".searchButton");
searchBtn.onclick=function(){
    url = "/api/attractions?page=0&keyword="+keywordDiv.value;
    keyword = keywordDiv.value
    attractionsDiv.innerHTML="";
    page = 0;
    getAttractions(url);
}
// roll and roll and roll
const listEnd = document.querySelector(".downLayout");
const callback = (entries, observer) => {
    for (const entry of entries) {
        console.log(entry);
        // Load more articles;
        if (entry.isIntersecting) {
            if (nextPage){
                setTimeout(()=>{
                    if (keyword){
                        url = "/api/attractions?page="+nextPage+"&keyword="+keyword;
                        getAttractions(url);
                    }else{
                        url = "/api/attractions?page="+nextPage;
                        getAttractions(url);
                    }
                }, 300)
            } else {
                observer.observe(End);
            }
        }
    }
}
// Observe the end of the list
const observer = new IntersectionObserver(callback, {
    threshold: 1,
});
observer.observe(listEnd);
// const observer = new IntersectionObserver(function(entries, observer){
//     entries.forEach(entry => {
//         console.log("touch")
        // setTimeout(()=>{
        //     console.log("touch")
            // if (nextPage){
            //     console.log(page)
            //     if (keyword){
            //         url = "/api/attractions?page="+nextPage+"&keyword="+keyword;
            //         getAttractions(url, page, keyword);
            //     }else{
            //         url = "/api/attractions?page="+nextPage;
            //         getAttractions(url);
            //     }
            // } else {
            //     observer.observe(End);
            // }
        // }, 1000)
//     })
// }, {
//     "threshold": 1,
// });
// observer.observe(End);

// categories bar
let urlCat = "/api/categories";
fetch(urlCat).then((res)=>{
    return res.json();
}).then((result)=>{
    let categoriesData = result["data"];
    for (let i=0; i<categoriesData.length;i++){
        const categories = document.createElement("div");
        categories.className = "searchCategories";
        categories.setAttribute("onclick", "chooseCat(this)");
        const text = document.createTextNode(categoriesData[i]);
        categories.appendChild(text);
        categoriesDiv.appendChild(categories);
    }
})
// hide and seed
let categoriesDiv = document.querySelector(".categories");
let ghostSearch = document.querySelector(".ghostSearch");
searchSearchDiv.onclick=function(){
    ghostSearch.style.display="block";
    categoriesDiv.style.display="flex";
}
window.onclick=function(){
    if (event.target===ghostSearch){
        categoriesDiv.style.display="none";
        ghostSearch.style.display="none"
    }
}
async function getAttractions(url){
    try {
        let response = await fetch(url);
        let result = await response.json();
        let attractionsData = result["data"];
        nextPage = result["nextPage"];
        // add attraction's div
        for (let i=0; i<attractionsData.length; i++){
            addDiv("attrBox", "", attractionsDiv);
        }
        let attrBox = document.querySelectorAll(".attrBox");
        for (let i=0; i<attractionsData.length; i++){
            // add image, name
            addImg("attractionImg", attractionsData[i]["image"][0], attrBox[page*12+i]);;
            addDiv("attractionNameDiv", "", attrBox[page*12+i]);
            // add mrt and categories div
            addDiv("mrtAndCat", "", attrBox[page*12+i]);
        }
        let attractionNameDiv = document.querySelectorAll(".attractionNameDiv");
        for (let i=0; i<attractionsData.length;i++){
            addDiv("attractionName", attractionsData[i]["name"], attractionNameDiv[page*12+i]);
        }
        let divMrtAndCat = document.querySelectorAll(".mrtAndCat");
        for (let i=0; i<attractionsData.length; i++){
            // add mrt and category
            addDiv("attractionMrt", attractionsData[i]["mrt"], divMrtAndCat[page*12+i]);
            addDiv("attractionCat", attractionsData[i]["category"], divMrtAndCat[page*12+i]);
        }
        page++;
    }catch(error){
        console.log({"error": error});
    }
}
// select category
function chooseCat(element){
    keywordDiv.value = element.textContent
}
// createElement function div and img
function addDiv(className, insideContent, insert){
    const addDiv = document.createElement("div");
    addDiv.className = className;
    const text = document.createTextNode(insideContent);
    addDiv.appendChild(text);
    insert.appendChild(addDiv);
}
function addImg(className, imgUrl, insert){
    const attractionImg = document.createElement("img");
    attractionImg.className = className;
    attractionImg.src = imgUrl;
    insert.appendChild(attractionImg);
}