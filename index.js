const express= require('express');
const cors=require('cors');
const http=require('http');
const app=express();
app.use(cors());
const axios=require('axios');
const dotenv=require('dotenv');
const {default: helmet}=require('helmet');

//servidor
const server=http.createServer(app);
dotenv.config();
//middleware (para procesos cliente - servidor)
app.use(express.json());
app.use(helmet());

const PORT=process.env.PORT || 9000;
server.listen(PORT,()=>{
    console.log(`Corriendo en el puerto: ${PORT}`);
})

//
app.get("/",async(req,res)=>{
    try {
        console.log(":D");
        res.status(200).json("API_NOM");
    } catch (error) {
        res.status(500);
    }
})

app.post("/",async(req,res)=>{
    const datosPW=req.body;
    const consulta= `Aquí una descripción basada en los datos: ${JSON.stringify(datosPW)}`;
    try{
        console.log(consulta);

        res.status(200).json({mensaje: "Datos recibidos con exito", datosPW})
        
    }catch(error){
        console.error(error);
        res.status(500).json({mensaje: "Error en procesar la solicitud"});
    }
})
