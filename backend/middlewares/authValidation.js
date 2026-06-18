let validateUser=(data)=>{
    console.log(data)
    if(!/^[a-zA-Z ]+$/.test(data.fullName)){
        return {status:false,message:"Name does not contains numbers or special Symbols"}
    }
    console.log(/^[a-zA-Z][a-zA-Z0-9_]{4,19}$/.test(data.username));
    if(! /^[a-zA-Z][a-zA-Z0-9_]{4,19}$/.test(data.username)){
        return{status:false,message:"username doesn't meet with standard guidelines"}
    }
    if(!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(data.password)){
        return{status:false,message:"username doesn't meet with standard guidelines"}
    }
    let arr=data.fullName.split(" ")
    if(arr.length!==3){
        return{status:false,message:"Full name doesn't meet with Gov guidelines mention names with spaces as shown in fields."}
    }
    return{status:true,message:""}
}
module.exports={validateUser};