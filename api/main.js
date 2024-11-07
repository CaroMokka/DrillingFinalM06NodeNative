import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "../data/animes.json");

const readFileData = async () => {
  const data = await readFile(filePath, "utf-8");
  const animesData = JSON.parse(data);
  return animesData;
};

export const getAnimes = async (id, res) => {
  try {
    const listaAnimes = await readFileData();
    const updateAnimesData = { ...listaAnimes };
    if (!id) {
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({
          message: "Lista actual de animes",
          data: updateAnimesData,
        })
      );
    } else {
      if (updateAnimesData[id]) {
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(
          JSON.stringify({
            message: "Obtención de anime éxitosa",
            data: updateAnimesData[id],
          })
        );
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "ID no encontrado" }));
      }
    }
  } catch (err) {
    console.log(err);
  }
};
export const setAnimes = (req, res) => {
  try {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      body = JSON.parse(body);

      const listaAnimes = await readFileData();
      const updateAnimesData = { ...listaAnimes };

      const newAnime = {
        nombre: body.nombre,
        genero: body.genero,
        año: body.año,
        autor: body.autor,
      };

      //clave unica dinamica para cada objeto
      const ultimoId = Math.max(...Object.keys(updateAnimesData).map(Number));
      const nuevoId = (ultimoId + 1).toString();

      updateAnimesData[nuevoId] = newAnime;
      await writeFile(
        filePath,
        JSON.stringify(updateAnimesData, null, 2),
        "utf-8" 
      );
      res.writeHead(201, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({ message: "Registro éxitoso", data: newAnime })
      );
    });
  } catch (err) {
    console.error("Hubo un error en la solicitud", err);
  }
};

export const updateAnimes = (id, req, res) => {
  try {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      body = JSON.parse(body);

      const listaAnimes = await readFileData();
      const updateAnimesData = { ...listaAnimes };

      const idAnimeContent = Object.keys(updateAnimesData).map(Number);
      const busqueda = idAnimeContent.find((anime) => anime == id);

      if (busqueda) {
        //validación de llave - valor del objeto actualizado
        body = Object.fromEntries(
          Object.entries(body).filter(
            ([keyValue]) => keyValue in updateAnimesData[busqueda]
          )
        );

        //validación en modificación (falta)

        updateAnimesData[busqueda] = { ...updateAnimesData[busqueda], ...body };
        await writeFile(
          filePath,
          JSON.stringify(updateAnimesData, null, 2),
          "utf-8"
        );
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(
          JSON.stringify({ message: "Anime modificado", updateAnimesData })
        );
      } else {
        res.writeHead(409, { "Content-Type": "application/json" });
        return res.end(
          JSON.stringify({ message: "Id no encontrado para mdificación" })
        );
      }
    });
  } catch (err) {
    console.log(err);
  }
};

export const deleteAnimes = async (id, res) => {
  try {
    const listaAnimes = await readFileData();
    const updateAnimesData = { ...listaAnimes };
    delete updateAnimesData[id];

    const newAnimesData = Object.values(updateAnimesData).reduce(
      (acc, item, index) => {
        acc[index + 1] = item;
        return acc;
      },
      {}
    );

    await writeFile(filePath, JSON.stringify(newAnimesData, null, 2), "utf-8");
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(
      JSON.stringify({ message: "Anime eliminado ", newAnimesData })
    );
  } catch (err) {
    console.log(err);
  }
};
