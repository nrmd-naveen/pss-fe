import axios from "axios";
import { getToken } from "./authentication";
import { ordersClosed, ordersToClose } from "@/config/ordersToClose";

export async function getMenuItems(){
    const token = getToken();
    console.log("ordersToClose", ordersToClose)
     try{
        const res = await axios.get("http://localhost:5000/order/items",{
            headers:{
                token : token,
                toClose : ordersToClose
            }
        })
        // console.log(res.data.items)
        // ordersClosed(); // setting empty array for toClose
        return res.data.items
        
    }catch(err){
        console.error(err);
        return [];
    }
}

export async function getLiveOrders(){
    const token = getToken();
    const toCloseArr = ordersToClose
    console.log("llll", toCloseArr)
    try{
        const res = await axios.get("http://localhost:5000/order/liveOrders",{
            headers:{
                token : token,
                toClose : toCloseArr
            }
        })
        // ordersClosed(); 
        if(toCloseArr.length === ordersToClose.length) ordersClosed();
        console.log(res.data.orders)
        return res.data.orders
        
    }catch(err){
        console.error(err);
        return [];
    }
}

export async function createNewOrder(userLimit: number, hourLimit: number){
    const token = getToken();
    console.log(token)
    const data = {
        userLimit : userLimit,
        hourLimit : hourLimit
    }
    try{
        console.log("close -> ",ordersToClose)
        const res = await axios.post("http://localhost:5000/order/create",data,{
            headers:{
                token : token,
                toClose : ordersToClose
            }
        })
        ordersClosed(); 
        console.log(res)
        return true
        
    }catch(err){
        console.error(err);
        return false;
    }
}

export async function closeAnOrder(orderId : string){
    const token = getToken();
    console.log(token)
    const data = {
        orderId : orderId
    }
    try{
        const res = await axios.post("http://localhost:5000/order/close",data,{
            headers:{
                token : token,
                toClose : ordersToClose
            }
        })
        ordersClosed(); 
        console.log("FE Closed",res)
        return true
         
    }catch(err){
        console.log("Error in FE Closing",err)
        return false;
    }
}