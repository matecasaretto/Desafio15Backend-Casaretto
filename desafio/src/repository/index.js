import { DbCartRepository } from "./dbCart.repository.js";
import { DbProductRepository } from "./dbProduct.repository.js";
import DbTicketRepository from "./DbTicketRepository.js";

import { UserRepository } from "./user.repository.js";

import { DbCartManager } from "../dao/managers/dbCartManager.js";
import { DbProductManager } from "../dao/managers/dbProductManager.js";

import { connectDB } from "../config/dbConnection.js";

connectDB();

export const dbCartService = new DbCartRepository(DbCartManager);

export const dbProductService = new DbProductRepository(DbProductManager);

export const dbUserService = new UserRepository()

export const dbTicketService = new DbTicketRepository()
