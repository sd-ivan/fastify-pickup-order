import './core/env.js';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import ejs from 'ejs';
import config from './core/config.js';
import {service,jsonSchema} from './core/service.js';
import {requireAdmin,responseHeaders} from './core/security.js';
import {handle,failResponse} from './core/http.js';
import {formFields,detailsHtml,rowsHtml} from './core/views.js';
import Fastify from 'fastify';
import formbody from '@fastify/formbody';
function webRequest(req){const headers=new Headers();for(const [key,value] of Object.entries(req.headers)){if(value!==undefined)headers.set(key,Array.isArray(value)?value.join(','):String(value))}const method=req.method;const body=['GET','HEAD'].includes(method)?undefined:JSON.stringify(req.body||{});if(body!==undefined){headers.set('content-type','application/json');headers.delete('content-length')}return new Request((process.env.APP_URL||'http://localhost:3000')+(req.url||'/'),{method,headers,body})}
async function rootPage(req){try{if(config.adminOnly)requireAdmin(new Headers(req.headers));return new Response(await ejs.renderFile(resolve('views/index.ejs'),{config,model:service().publicView(),formFields,detailsHtml,rowsHtml}),{headers:responseHeaders({'content-type':'text/html; charset=utf-8'})})}catch(error){return failResponse(error)}}
export async function createServer(){
 const app=Fastify({logger:false,bodyLimit:16000,trustProxy:false});await app.register(formbody);
 const send=async(reply,response)=>{reply.code(response.status);response.headers.forEach((value,key)=>reply.header(key,value));return reply.send(Buffer.from(await response.arrayBuffer()))};
 app.get('/',async(req,reply)=>send(reply,await rootPage(req)));
 app.get('/style.css',async(req,reply)=>reply.type('text/css').send(await readFile(resolve('public/style.css'),'utf8')));
 app.get('/favicon.svg',async(req,reply)=>reply.type('image/svg+xml').send(await readFile(resolve('public/favicon.svg'),'utf8')));
 await app.register(async function submissionRoutes(routes){
  const successSchema={type:'object',required:['ok','message'],properties:{ok:{type:'boolean'},message:{type:'string'},id:{anyOf:[{type:'string'},{type:'null'}]}}};
  routes.post('/api/submit',{schema:{body:jsonSchema,response:{200:successSchema}}},async(req,reply)=>send(reply,await handle(webRequest(req),req.ip)));
 });
 app.route({method:['GET','POST'],url:'/admin',handler:async(req,reply)=>send(reply,await handle(webRequest(req),req.ip))});
 for(const route of ['/api/admin','/api/redeem'])app.post(route,async(req,reply)=>send(reply,await handle(webRequest(req),req.ip)));
 for(const route of ['/access/:token','/health'])app.get(route,async(req,reply)=>send(reply,await handle(webRequest(req),req.ip)));
 app.setErrorHandler((error,request,reply)=>reply.code(error.statusCode||500).send({ok:false,message:error.validation?'Please complete all fields with valid values.':'The request could not be processed.'}));
 return app;
}
async function start(app){await app.listen({port:Number(process.env.PORT||3000),host:process.env.HOST||'127.0.0.1'});console.log(`Ready at ${app.listeningOrigin}`)}

if(process.argv[1] && import.meta.url===pathToFileURL(resolve(process.argv[1])).href){const app=await createServer();await start(app);}
