import express from "express";
import addressShipController from "../controllers/addressShipController.js";

const addressShipRouter = express.Router();

addressShipRouter.get('/get-address-ship', addressShipController.getAllAddressShip)
addressShipRouter.post('/create-address-ship', addressShipController.createAddressShip)
addressShipRouter.put('/update-address-ship', addressShipController.updateAddressShip)
addressShipRouter.delete('/delete-address-ship/:id', addressShipController.deleteAddressShip)

export default addressShipRouter