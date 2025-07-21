import { createHotelController, deleteHotelController, getAllHotelController, getAllHotelsWithoutPaginationController, getHotelByIdController, updateHotelController } from "@/controllers/hotelController";
import { Express } from "express";

import multer from "multer"


const storage = multer.memoryStorage()
const upload = multer({ 
    storage: storage,
    limits:{
        fileSize: 5 * 1024 * 1024
    }

})



export const hotelRoute = (app:Express)=>{
    // Place specific routes before parameterized routes to avoid conflicts
    app.route("/hotels/all").get(
        async (req,res,next) => {
           try {
            await getAllHotelsWithoutPaginationController(req,res);
            
           } catch (error) {
            next(error);
            
           }
            
        }
    )
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
    app.route("/hotels").post(
          upload.single("image"),
        async (req,res,next) => {
            try {
              await createHotelController(req,res);
            } catch (error) {
                next(error);
                
            }
            
        }
    )
    app.route("/hotels/:id").put(
        async (req,res,next) => {
            try {
                await updateHotelController(req,res);
                
            } catch (error) {
                next(error);
                
            }
            
        }
    )
    app.route("/hotels/:id").delete(
        async (req,res,next) => {
            try {
                await deleteHotelController(req,res);
                
            } catch (error) {
                next(error);
                
            }
            
        }
    )

}