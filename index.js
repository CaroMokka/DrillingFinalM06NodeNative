import http from "http";
import url from "url";
import { readFileSync } from "fs";

const port = 3000;

http
  .createServer((request, response) => {
    const method = request.method;
    const urlParsed = url.parse(request.url, true);
    const pathName = urlParsed.pathname;

    // Petición GET - Todos animes && Anime por Id
    if (pathName == "/animes" && method == "GET") {
      const id_anime = urlParsed.query.id;

      if (!id_anime) {
        try {
          const data = readFileSync("./data/animes.json", "utf-8");
          const animesData = JSON.parse(data);
          response.writeHead(200, { "Content-Type": "application/json" });
          response.end(
            JSON.stringify({
              message: "Lista actual de animes",
              data: animesData,
            })
          );
        } catch (err) {
          response.writeHead(500, { "Content-Type": "application/json" });
          response.end(
            JSON.stringify({ message: "Error al cargar datos de animes" })
          );
          console.log(err);
        }
      } else {
        try {
          const data = readFileSync("./data/animes.json", "utf-8");
          const animesData = JSON.parse(data);

          if (animesData[id_anime]) {
            response.writeHead(200, { "Content-Type": "application/json" });
            response.end(
              JSON.stringify({
                message: "Obtención de anime éxitosa",
                data: animesData[id_anime],
              })
            );
          } else {
            response.writeHead(404, { "Content-Type": "application/json" });
            response.end(JSON.stringify({ message: "Anime no encontrado" }));
          }
        } catch (err) {
          console.log(err);
        }
      }
    }

    if (pathName == "/registrar-anime" && method == "POST") {
      try {
        let body = "";
        request.on("data", (chunk) => {
          body += chunk.toString();
        });

        request.on("end", () => {
          body = JSON.parse(body);

          const contentJson = fs.readFileSync("./data/animes.json", "utf-8");
          const contentJS = JSON.parse(contentJson);

          const newAnime = {
            nombre: body.nombre,
            genero: body.genero,
            año: body.año,
            autor: body.autor,
          };

          //clave unica dinamica para objeto .json
          const ultimoId = Math.max(...Object.keys(contentJS).map(Number));
          const nuevoId = (ultimoId + 1).toString();

          contentJS[nuevoId] = newAnime;
          fs.writeFileSync(
            "./data/animes.json",
            JSON.stringify(contentJS, null, 2),
            "utf-8"
          );
        });
      } catch (err) {
        console.error("Hubo un error en la solicitud", err);
      }
      response.end("Registro éxitoso");
    }
    if (pathName == "/editar-animes" && method == "PUT") {
      response.end("Editar animes");
    }
    if (pathName == "/eliminar-anime" && method == "DELETE") {
      response.end("Eliminar anime");
    }
  })
  .listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
  });
