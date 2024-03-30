import OpenAI from 'openai';
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

//IA
const openai=require("openai");



//Puerto
const PORT=process.env.PORT || 9000;
server.listen(PORT,()=>{
    console.log(`Corriendo en el puerto: ${PORT}`);
})

//Funciones HTTP
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
    let textoLimpio = datosPW.map(item=> `dominio: ${item.Dominio}, valor ${item.valor}`);
    let descripcionCompleta=textoLimpio.join('\n');
    try{
        //console.log(consulta);
        console.log(descripcionCompleta);
        //res.status(200).json({mensaje: "Datos limpios", descripcionCompleta});

        //IA
        const api_url = "https://api.openai.com/v1/engines/g-zqhE73Pwg-nom-035/completions";
        const headers = {
            'Authorization': process.env.APIKEY,
            'Content-Type': 'application/json'
        };

        const data = {
            prompt: `Dame las recomendaciones que debo tomar si tengo estos datos: ${descripcionCompleta}`,
            max_tokens: 500
        };

        axios.post(api_url, data, { headers: headers })
            .then(response => {
                res.status(200).json({response});
                console.log(response.data);
            })
            .catch(error => {
                console.error("There was an error!", error);
            });


        
    }catch(error){
        console.error(error);
        res.status(500).json({mensaje: `Error en procesar la solicitud, error: ${error}`});
    }
})
