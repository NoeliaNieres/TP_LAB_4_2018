export class Vehiculo {
    public id: any;
    public usuario_id: any;
    public patente: any;
    public marca: any;
    public categoria: any;
    public ocupantes: any;
    public habilitado: any;
  
    constructor(patente, marca, categoria, ocupantes, usuario_id) {
        this.patente = patente;
        this.marca = marca;
        this.categoria = categoria;
        this.ocupantes = ocupantes;
        this.usuario_id = usuario_id;
        this.habilitado = 0;
     }
  }