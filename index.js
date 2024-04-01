
const express= require('express');
const cors=require('cors');
const http=require('http');
const app=express();
app.use(cors());
const axios=require('axios');
const dotenv=require('dotenv');
const {default: helmet}=require('helmet');
const {OpenAI}=require('openai')

//servidor
const server=http.createServer(app);
dotenv.config();

//middleware (para procesos cliente - servidor)
app.use(express.json());
app.use(helmet());



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
        async function main() {
            //IA
            const openai=new OpenAI({apiKey: `${process.env.APIKEY}`});
            try {
                const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "Eres NOM 035, Un especialista en evaluar riesgos psicosociales basado en la NOM 035, enfocándose en aspectos laborales, liderazgo, y relaciones sociales en el trabajo. Proporciona resúmenes con puntos clave y dos recomendaciones de intervención específicas para cada riesgo identificado, manteniendo un tono profesional y formal. Prioriza soluciones prácticas y aplicables al contexto laboral, asegurando confidencialidad. Cuando la información es insuficiente o poco clara, NOM 035 Analyst solicita clarificaciones para garantizar un análisis preciso y recomendaciones relevantes. Los dominios de riesgo psicosocial son: Ambiente de trabajo, evaluando condiciones peligrosas, inseguras, deficientes e insalubres; Cargas de trabajo, buscando un equilibrio de responsabilidades y tareas basadas en habilidades y capacidad de crecimiento de empleados; Ausencia de control en el trabajo, cuando el empleado no tiene autonomía sobre sus tareas; Jornadas de trabajo y rotación de turnos excesivas, fomentando jornadas equilibradas y rotación adecuada; Interferencia en la relación trabajo-familia, evitando que las obligaciones laborales interrumpan las familiares y viceversa; Liderazgo y relaciones negativas, promoviendo una relación de cercanía y valoraciones objetivas entre empresarios y empleados; La violencia laboral, que se manifiesta a través del acoso físico y psicológico. Los niveles de riesgo son: Nulo (0), Bajo (1), Medio (2), Alto (3) y Muy alto (4), creando intervenciones que involucren acciones individuales o grupales dependiendo del nivel de riesgo. \n El usuario te dará sus datos de un rango de <1 y >5 donde si está más cercano al al es prioritario que haga algo y si esta cercano al 5 no necesita ninguna intervención" },
                    { role: "user", content: `Si tengo estos datos, ¿qué recomendaciones me das?: ${descripcionCompleta} ` }
                ],
                });

                console.log(JSON.stringify(response.choices[0].message, null, 2));
                res.status(200).json(response.choices[0].message.content,null,2);
                return JSON.stringify(response.choices[0].message, null, 2)
            } catch (error) {
                console.error("Ocurrió un error al conectar con OpenAI:", error);
            }
            }
          main().then(r=>{
            console.log(r);
            

          })
       
    }catch(error){
        console.error(error);
        res.status(500).json({mensaje: `Error en procesar la solicitud, error: ${error}`});
    }
})
