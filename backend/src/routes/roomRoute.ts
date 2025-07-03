
import { getAllRoomsController, getRoomByIdController } from "@/controllers/roomController";
import { Express } from "express";

export const roomRoute = (app: Express) => {

    app.route("/rooms").get(
        async (req, res, next) => {
            try {
                
                await getAllRoomsController(req, res);
            } catch (error) {
                next(error);
            }
        }
    )
    app.route("/rooms/:id").get(
        async (req, res, next) => {
            try {
                await getRoomByIdController(req, res);
            } catch (error) {
                next(error);
            }
        }
    )

}