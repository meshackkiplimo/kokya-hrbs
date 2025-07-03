import { getAllHotelController, getHotelByIdController } from "@/controllers/hotelController";
import { Express } from "express";



export const hotelRoute = (app:Express)=>{
    app.route("/hotels").get(
        async (req,res,next) => {
           try {
            await getAllHotelController(req,res);
            
           } catch (error) {
            next(error);
            
           }
            
        }
    )
    app.route("/hotels/:id").get(
        async (req,res,next) => {
            try {
                await getHotelByIdController(req,res);
                
            } catch (error) {
                next(error);
                
            }
            
        }
    )

}