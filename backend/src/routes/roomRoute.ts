
import { createRoomController, deleteRoomController, getAllRoomsController, getAllRoomsWithoutPaginationController, getRoomByIdController, updateRoomController } from "@/controllers/roomController";
import { Express } from "express";

import multer from "multer"

const storage = multer.memoryStorage()
const upload = multer({
    storage: storage,
    limits:{
        fileSize: 5 * 1024 * 1024
    }
})

export const roomRoute = (app: Express) => {

    app.route("/rooms/all").get(
        async (req, res, next) => {
            try {
                await getAllRoomsWithoutPaginationController(req, res);
            } catch (error) {
                next(error);
            }
        }
    )

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
    app.route("/rooms").post(
        upload.array("images", 3),
        async (req, res, next) => {
            try {
                await createRoomController(req, res);
            } catch (error) {
                next(error);
            }
        }
    )
    app.route("/rooms/:id").put(
        async (req, res, next) => {
            try {
                await updateRoomController(req, res);
            } catch (error) {
                next(error);
            }
        }
    )
    app.route("/rooms/:id").delete(
        async (req, res, next) => {
            try {
                await deleteRoomController(req, res);
            } catch (error) {
                next(error);
            }
        }
    )

}