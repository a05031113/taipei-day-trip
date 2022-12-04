async function refresh(){
    try{
        let response = await fetch("/api/user/auth", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem('jwt')}`
            }
        });
        let result = await response.json();
        console.log(result);
    }catch(error){
        console.log({"error": error});
    }
}
refresh()
