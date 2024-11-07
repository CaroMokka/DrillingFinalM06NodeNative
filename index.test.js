import { expect } from 'chai';
import { server, port } from "./index.js"

describe("Prueba de servidor y puerto", () => {
    it("Creación del servidor", () => {
        expect(server).to.be.a('object')
    })
    it("Definición y validación de puerto", () => {
        expect(port).to.be.a('number')
    })
})