// @ts-nocheck 
// import { axios } from 'axios'
import axios from 'axios';

const setToken = (token) =>{
    if(localStorage.getItem('token') != token){
        localStorage.setItem('token', token)
    }
}
export const userSignup = async (data) =>{
    try{
        const res = await axios.post('http://localhost:5000/user/signup', {
            name : data.name,
            email : data.email,
            password : data.password
        })
        if(res.data.token){
            setToken(res.data.token)
            console.log("token set !")
        }

    }catch(err){
        console.log("FE error",err)
    }
}   

export const userLogin = (data) =>{
    try{
        console.log("in Login")
        axios.post('http://localhost:5000/user/login', {
            email : data.email,
            password : data.password
        })
        .then( (res) =>{
            if(res.data.token){
                setToken(res.data.token)
                console.log("token set !")
            }
            console.log("In Login------",res)
        }).catch((err)=>{
            if(err.response.data.code == "INV_CRED"){
                //handle this
                alert("Invalid Credentials")
            }
            console.error("Error in Login ", err)
        })


    }catch(err){
        console.log("FE error",err)
    }
}   

export const isAuthenticated = () =>{
    console.log("isAuth",localStorage.getItem("token"));
    if(localStorage.getItem("token")){
        return true
    }
    return false;
}

export const getToken = () =>{
    return localStorage.getItem("token");
}