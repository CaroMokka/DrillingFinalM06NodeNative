import http from "http";
import url from "url";
import { deleteAnimes, getAnimes, setAnimes, updateAnimes } from "./api/main.js";

const port = 3000;

// Prueba de servidor funcionando (falta)
http
  .createServer((request, response) => {
    const method = request.method;
    const urlParsed = url.parse(request.url, true);
    const pathName = urlParsed.pathname;
    const id_anime = urlParsed.query.id;

    if (pathName == "/animes" && method == "GET") {
      getAnimes(id_anime, response);
    }

    if (pathName == "/registrar-anime" && method == "POST") {
      setAnimes(request, response);
    }

    if (pathName == "/editar-animes" && method == "PUT") {
        updateAnimes(id_anime, request, response)
    }
    if (pathName == "/eliminar-anime" && method == "DELETE") {
      deleteAnimes(id_anime, response)
    }
  })
  .listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
  });
