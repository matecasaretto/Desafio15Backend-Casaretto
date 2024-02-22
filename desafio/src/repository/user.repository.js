import { CreateUserDto, GetUserDto } from "../dao/dto/user.dto.js";

export class UserRepository {
    constructor(userDao) {
        this.userDao = userDao;
    }

    async getUsers() {
        const users = await this.userDao.get();
        const usersDto = users.map(user => new GetUserDto(user));
        return usersDto;
    }

    async createUser(userData) {
        const createUserDto = new CreateUserDto(userData);
        const createdUser = await this.userDao.create(createUserDto);
        const createdUserDto = new GetUserDto(createdUser);
        return createdUserDto;
    }
}
