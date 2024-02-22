export class CreateUserDto {
    constructor(user) {
        this.fullName = `${user.first_name} ${user.last_name}`;
        this.firstName = user.first_name;
        this.lastName = user.last_name;
        this.email = user.email;
        this.password = user.password;
       
    }
}

export class GetUserDto {
    constructor(user) {
        this.fullName = `${user.first_name} ${user.last_name}`;
        this.firstName = user.first_name;
        this.lastName = user.last_name;
        this.email = user.email;
        this.role = user.role;
     
    }
}