"use strict";
// KARDEX · ET505 S9. Parte 1: reglas (sin document). Parte 2: pantalla. Depende de kardex.html (ids kx-*). No usa app.js.
const KX_CLAVE="et505_s9_kardex";
function kxInicial(){return {sigMat:4,sigMov:1,materiales:[["m1","Libros de cuentos"],["m2","Cuadernos de trabajo"],["m3","Marcadores"]].map(([id,nombre],i)=>({id,codigo:"MAT-00"+(i+1),nombre,activo:true})),movimientos:[]};}
function kxCargar(almacen){try{const e=JSON.parse(almacen.getItem(KX_CLAVE));if(e&&Array.isArray(e.materiales)&&Array.isArray(e.movimientos))return e;}catch(x){}return kxInicial();}
function kxGuardar(almacen,e){try{almacen.setItem(KX_CLAVE,JSON.stringify(e));return true;}catch(x){return false;}}
const kxOk=m=>({ok:true,mensaje:m}),kxErr=m=>({ok:false,mensaje:"ERROR: "+m});
function kxEntero(texto){const t=String(texto).trim();return /^[1-9]\d{0,5}$/.test(t)?Number(t):null;} // rechaza 0, negativos y decimales
function kxMaterial(e,id){return e.materiales.find(m=>m.id===id)||null;}
function kxMovs(e,id){return e.movimientos.filter(v=>v.materialId===id);}
function kxExistencia(e,id){return kxMovs(e,id).reduce((s,v)=>s+(v.tipo==="entrada"?v.cantidad:-v.cantidad),0);}
function kxBuscar(e,texto){const t=String(texto).trim().toLowerCase();return t?e.materiales.filter(m=>m.nombre.toLowerCase().includes(t)||m.codigo.toLowerCase().includes(t)):e.materiales.slice();}
function kxNombreValido(n){const t=String(n).trim();return t.length>=3&&t.length<=60?t:null;}
function kxAgregar(e,nombre){const t=kxNombreValido(nombre);if(!t)return kxErr("el nombre debe tener de 3 a 60 caracteres.");
const n=e.sigMat++;e.materiales.push({id:"m"+n,codigo:"MAT-"+String(n).padStart(3,"0"),nombre:t,activo:true});return kxOk("Material agregado: "+t+".");}
function kxRenombrar(e,id,nombre){const m=kxMaterial(e,id);if(!m)return kxErr("seleccione un material.");const t=kxNombreValido(nombre);if(!t)return kxErr("el nombre debe tener de 3 a 60 caracteres.");m.nombre=t;return kxOk("Nombre cambiado a "+t+" ("+m.codigo+").");}
function kxMovimiento(e,id,tipo,texto){const m=kxMaterial(e,id);if(!m)return kxErr("seleccione un material.");
if(!m.activo)return kxErr("el material está inactivo; reactívelo para registrar movimientos.");
const c=kxEntero(texto);if(c===null)return kxErr("la cantidad debe ser un entero positivo (sin decimales, cero ni negativos).");
const saldo=kxExistencia(e,id);if(tipo==="salida"&&c>saldo)return kxErr("salida de "+c+" mayor a la existencia ("+saldo+"). No se registró.");
e.movimientos.push({id:"x"+e.sigMov++,materialId:id,tipo,cantidad:c,fecha:new Date().toISOString()});
return kxOk("Registrado: "+tipo+" de "+c+". Existencia: "+kxExistencia(e,id)+".");}
function kxAlternar(e,id){const m=kxMaterial(e,id);if(!m)return kxErr("seleccione un material.");m.activo=!m.activo;
return kxOk(m.nombre+(m.activo?" reactivado.":" inactivado. Su historial ("+kxMovs(e,id).length+" movimientos) se conserva."));}
function kxEliminar(e,id,confirmar){const m=kxMaterial(e,id);if(!m)return kxErr("seleccione un material.");
if(kxMovs(e,id).length)return kxErr(m.nombre+" tiene movimientos; no se elimina. Use Inactivar para conservar su historial.");
if(!confirmar("¿Eliminar "+m.nombre+" ("+m.codigo+")? No se puede deshacer."))return kxOk("Eliminación cancelada. No hubo cambios.");
e.materiales=e.materiales.filter(x=>x.id!==id);return kxOk("Material eliminado.");}
function kxCelda(t){let s=String(t);if(/^[=+\-@]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}
function kxCsv(e){const f=iso=>{const d=new Date(iso),p=n=>String(n).padStart(2,"0");return d.getFullYear()+"-"+p(d.getMonth()+1)+"-"+p(d.getDate())+" "+p(d.getHours())+":"+p(d.getMinutes());};
const filas=e.movimientos.map(v=>{const m=kxMaterial(e,v.materialId)||{codigo:"?",nombre:"?"};return [f(v.fecha),m.codigo,m.nombre,v.tipo,v.cantidad].map(kxCelda).join(",");});
return "\uFEFF"+["Fecha,Codigo,Material,Tipo,Cantidad"].concat(filas).join("\r\n")+"\r\n";}
if(typeof module!=="undefined")module.exports={kxInicial,kxCargar,kxGuardar,kxEntero,kxExistencia,kxBuscar,kxAgregar,kxRenombrar,kxMovimiento,kxAlternar,kxEliminar,kxCsv,kxMovs};
// PANTALLA
if(typeof document!=="undefined"&&document.getElementById("kx-lista")){(function(){
const g=id=>document.getElementById(id);const kx=kxCargar(localStorage);let sel=null;
function aviso(r){const el=g("kx-mensaje");el.textContent=r.mensaje;el.className=r.ok?"exito":"error";if(!r.ok)el.focus();if(!kxGuardar(localStorage,kx))el.textContent+="\nAviso: no se pudo guardar en este navegador.";}
function celda(tr,txt){const td=document.createElement("td");td.textContent=txt;tr.appendChild(td);return td;}
function pintar(){const lista=kxBuscar(kx,g("kx-buscar").value);if(sel&&!lista.some(m=>m.id===sel))sel=null; // sin coincidencia: se olvida la selección
const tb=g("kx-lista");tb.textContent="";g("kx-sin-resultados").hidden=lista.length>0;
lista.forEach(m=>{const tr=document.createElement("tr");if(m.id===sel){tr.className="elegido";tr.setAttribute("aria-current","true");}
celda(tr,m.codigo);celda(tr,m.nombre);celda(tr,m.activo?"Activo":"Inactivo");celda(tr,String(kxExistencia(kx,m.id)));
const b=document.createElement("button");b.type="button";b.textContent=m.id===sel?"✓ Seleccionado":"Seleccionar";b.dataset.id=m.id;celda(tr,"").appendChild(b);tb.appendChild(tr);});
const m=sel&&kxMaterial(kx,sel);g("kx-seleccion").textContent=m?m.nombre+" ("+m.codigo+")":"ninguno";
const h=g("kx-historial");h.textContent="";(m?kxMovs(kx,sel):[]).forEach(v=>{const tr=document.createElement("tr");celda(tr,new Date(v.fecha).toLocaleString("es-PE"));celda(tr,v.tipo);celda(tr,String(v.cantidad));h.appendChild(tr);});}
function hacer(r){aviso(r);pintar();}
g("kx-buscador").addEventListener("submit",e=>e.preventDefault());
g("kx-buscar").addEventListener("input",pintar);
g("kx-lista").addEventListener("click",e=>{const b=e.target.closest("button[data-id]");if(b){sel=b.dataset.id;pintar();}});
g("kx-entrada").addEventListener("click",()=>{const r=kxMovimiento(kx,sel,"entrada",g("kx-cantidad").value);if(r.ok)g("kx-cantidad").value="";hacer(r);});
g("kx-salida").addEventListener("click",()=>{const r=kxMovimiento(kx,sel,"salida",g("kx-cantidad").value);if(r.ok)g("kx-cantidad").value="";hacer(r);});
g("kx-renombrar").addEventListener("click",()=>hacer(kxRenombrar(kx,sel,g("kx-nombre").value)));
g("kx-agregar").addEventListener("click",()=>{const r=kxAgregar(kx,g("kx-nombre").value);if(r.ok)g("kx-nombre").value="";hacer(r);});
g("kx-estado").addEventListener("click",()=>hacer(kxAlternar(kx,sel)));
g("kx-eliminar").addEventListener("click",()=>{const r=kxEliminar(kx,sel,t=>window.confirm(t));if(r.ok&&!kxMaterial(kx,sel))sel=null;hacer(r);});
g("kx-csv").addEventListener("click",()=>{const url=URL.createObjectURL(new Blob([kxCsv(kx)],{type:"text/csv;charset=utf-8"}));const a=document.createElement("a");a.href=url;a.download="kardex-movimientos.csv";document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);aviso(kxOk("CSV exportado ("+kx.movimientos.length+" movimientos). Es una copia, no una sincronización."));});
pintar();})();}
