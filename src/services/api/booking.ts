import axios from "axios";
import { getToken } from "./authentication";

interface BookedItem {
    item: string;
    quantity: number;
}

export async function createNewBooking(items: BookedItem[], orderId : string){
    const token = getToken();
    console.log(orderId)
    const data = {
        items : items,
        orderId : orderId
    }
    try{
        const res = await axios.post("http://localhost:5000/booking/create",data,{
            headers:{
                token : token
            }
        })
        console.log(res)
        return true
        
    }catch(err){
        console.error(err);
        return false;
    }
}