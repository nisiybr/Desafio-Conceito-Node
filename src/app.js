const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());
app.use(requestLog);

const repositories = [];

function requestLog(request,response,next) {
  const {method,url} = request;
  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.time(logLabel);
  next();
  console.timeEnd(logLabel);

}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {

  const {title, url, techs} = request.body;

  const data = {
    id: uuid(),
    title,
    url,
    techs,
    likes:0,
  }

  repositories.push(data);


  return response.json(data);
  
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json({error: "Repository does not exists"});
  }

  const {likes} = repositories[repositoryIndex];
  
  const data = {
    id,
    title,
    url,
    techs,
    likes,
  }

  repositories[repositoryIndex] = data;

  return response.json(data);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  if(repositoryIndex < 0) {
    return response.status(400).json({error: "Repository does not exists"});
  }  
  repositories.splice(repositoryIndex,1)

  return response.status(204).send();


});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;
  
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  if(repositoryIndex < 0) {
    return response.status(400).json({error: "Repository does not exists"});
  } 

  const {title, url, techs, likes} = repositories[repositoryIndex];


  const data = {
    id,
    title,
    url,
    techs,
    likes: (likes+1),
  }

  repositories[repositoryIndex] = data;

  return response.json(data);

});

module.exports = app;
