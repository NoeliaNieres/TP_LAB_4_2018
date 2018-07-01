export class User {
    public id: number;
    public username: string;
    public email: string;
    public rol: string;
    public password: string;
    public token: string;

    constructor(id, username, email, rol, password) {
        this.username = username;
        this.email = email;
        this.rol = rol;
        this.password = password;
        this.id = id;
    }
}