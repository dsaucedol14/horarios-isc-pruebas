(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function a(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(n){if(n.ep)return;n.ep=!0;const r=a(n);fetch(n.href,r)}})();const B=/^G(\d+)([MV])SIS(\d+)$/,U=/^GFSIS(\d+)$/;function R(t){return t===1||t===3?`${t}er`:`${t}º`}function y(t){let e=B.exec(t);return e?{clave:t,semestre:Number(e[3]),numero:Number(e[1]),turno:e[2]==="M"?"Matutino":"Vespertino",finDeSemana:!1}:(e=U.exec(t),e?{clave:t,semestre:Number(e[1]),numero:null,turno:"Fin de semana",finDeSemana:!0}:null)}function D(t){const e=y(t);if(!e)return t;const a=[`${R(e.semestre)} semestre`];return e.numero!==null&&a.push(`Grupo ${e.numero}`),a.push(e.turno),a.join(" · ")}function V(t,e){const a=y(t),s=y(e);return!a||!s?t.localeCompare(e):a.semestre-s.semestre||Number(a.finDeSemana)-Number(s.finDeSemana)||a.turno.localeCompare(s.turno)||(a.numero??0)-(s.numero??0)}function A(t){return t.tipo==="asesoria_virtual"?"Asesoría virtual":t.salon}function z(t){return t.tipo==="asesoria_virtual"?"en asesoría virtual":`en ${t.salon}`}const X=new Set(["i","ii","iii","iv","v","vi"]);function E(t){return t.toLowerCase().split(/\s+/).map((a,s)=>X.has(a)&&s>0?a.toUpperCase():s===0?a[0].toUpperCase()+a.slice(1):a).join(" ")}function N(t){return[...new Set(t.maestros.flatMap(a=>a.bloques.map(s=>s.grupo)))].sort(V)}function Z(t,e){return t.maestros.flatMap(a=>a.bloques.filter(s=>s.grupo===e).map(s=>({...s,maestro:a.nombre,maestroId:a.id})))}function J(t,e){return t.maestros.find(a=>a.id===e)??null}function k(t){var a;const e=new Map;for(const s of N(t)){const n=((a=y(s))==null?void 0:a.semestre)??0;e.has(n)||e.set(n,[]),e.get(n).push(s)}return[...e.entries()].map(([s,n])=>({semestre:s,grupos:n}))}function O(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase()}function K(t,e){const a=O(e).split(/\s+/).filter(Boolean);if(!a.length)return[];const s=o=>a.every(l=>O(o).includes(l)),n=t.maestros.filter(o=>s(o.nombre)).map(o=>({tipo:"maestro",id:o.id,titulo:o.nombre})),r=N(t).filter(o=>s(`${o} ${D(o)}`)).map(o=>({tipo:"grupo",id:o,titulo:D(o),detalle:o}));return[...n,...r]}function u(t){return String(t??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}function Q(t,e){const a=k(e).map(({semestre:o,grupos:l})=>`
      <div class="semestre">
        <h3>${o?`${R(o)} semestre`:"Otros"}</h3>
        <div class="chips">
          ${l.map(f=>{const i=y(f),c=i?i.finDeSemana?"Fin de semana":`Grupo ${i.numero} · ${i.turno}`:f;return`<a class="chip" href="#/grupo/${u(f)}">${u(c)}<small>${u(f)}</small></a>`}).join("")}
        </div>
      </div>`).join(""),s=[...e.maestros].sort((o,l)=>T(o.nombre).localeCompare(T(l.nombre),"es")).map(o=>`<li><a href="#/maestro/${u(o.id)}">${u(o.nombre)}</a></li>`).join("");t.innerHTML=`
    <section class="buscador" role="search">
      <label for="q">Busca un maestro o un grupo</label>
      <input id="q" type="search" autocomplete="off" placeholder="Ej. garcía, 5 fin de semana, G1MSIS03" />
      <ul id="resultados" class="resultados" aria-live="polite"></ul>
    </section>
    <section>
      <h2>Grupos</h2>
      ${a}
    </section>
    <section>
      <h2>Maestros</h2>
      <ul class="lista-maestros">${s}</ul>
    </section>`;const n=t.querySelector("#q"),r=t.querySelector("#resultados");n.addEventListener("input",()=>{const o=K(e,n.value);r.innerHTML=n.value.trim()&&!o.length?`<li class="resultados__vacio">Sin resultados para “${u(n.value)}”.</li>`:o.map(l=>`
          <li><a href="#/${l.tipo}/${u(l.id)}">
            <span class="etiqueta">${l.tipo==="maestro"?"Maestro":"Grupo"}</span>
            ${u(l.titulo)}${l.detalle?` <small>${u(l.detalle)}</small>`:""}
          </a></li>`).join("")}),n.addEventListener("keydown",o=>{const l=r.querySelector("a");o.key==="Enter"&&l&&(location.hash=l.getAttribute("href"))})}function T(t){return t.replace(/^\S+\.\s+/,"")}const I=["LUNES","MARTES","MIERCOLES","JUEVES","VIERNES","SABADO","DOMINGO"],C={LUNES:"Lunes",MARTES:"Martes",MIERCOLES:"Miércoles",JUEVES:"Jueves",VIERNES:"Viernes",SABADO:"Sábado",DOMINGO:"Domingo"},W="America/Mexico_City";function m(t){const[e,a]=t.split(":").map(Number);return e*60+a}function j(t=new Date){const e=Object.fromEntries(new Intl.DateTimeFormat("en-CA",{timeZone:W,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23",weekday:"short"}).formatToParts(t).map(s=>[s.type,s.value])),a={Mon:0,Tue:1,Wed:2,Thu:3,Fri:4,Sat:5,Sun:6}[e.weekday];return{fecha:`${e.year}-${e.month}-${e.day}`,dia:I[a],minutos:Number(e.hour)*60+Number(e.minute)}}function L(t,e){return t>=e.segunda?2:1}function w(t,e){return t.fase===null||t.fase===e}function Y(t,e){const a=new Date(`${t}T12:00:00Z`);return a.setUTCDate(a.getUTCDate()+e),a.toISOString().slice(0,10)}function ee(t,e,a){const s=L(e.fecha,a),n=t.filter(o=>o.dia===e.dia&&w(o,s)&&m(o.inicio)<=e.minutos&&e.minutos<m(o.fin)),r=I.indexOf(e.dia);for(let o=0;o<=7;o++){const l=I[(r+o)%7],f=Y(e.fecha,o),i=L(f,a),c=t.filter(p=>p.dia===l&&w(p,i)).filter(p=>o>0||m(p.inicio)>e.minutos).sort((p,S)=>m(p.inicio)-m(S.inicio));if(c.length)return{actuales:n,siguiente:{bloque:c[0],dia:l,fecha:f}}}return{actuales:n,siguiente:null}}const _=78;function x(t,e,a){const{fases:s}=e,n=a.bloques.some(i=>i.fase!==null),r={fase:L(j().fecha,s),dia:null};t.innerHTML=`
    <nav class="migas"><a href="#/">← Inicio</a></nav>
    <header class="titulo">
      <p class="titulo__sub">${u(a.subtitulo)}</p>
      <h1>${u(a.titulo)}</h1>
    </header>
    <section id="ahora" class="ahora" aria-live="polite"></section>
    ${n?te(s):""}
    <section id="horario" aria-label="Horario semanal"></section>`;const o=()=>{const i=j(),c=L(i.fecha,s),{actuales:p,siguiente:S}=ee(a.bloques,i,s);t.querySelector("#ahora").innerHTML=oe(a.tipo,p,S,i);const v=a.bloques.filter($=>w($,r.fase)),M=r.fase===c?new Set(p):new Set,d=ae(a.bloques);r.dia||(r.dia=d.includes(i.dia)?i.dia:d[0]),t.querySelector("#horario").innerHTML=v.length?ne(a.tipo,v,d,M,i.dia)+ie(a.tipo,v,d,M,r.dia,i.dia):`<p class="aviso">No hay clases registradas${n?" en esta fase":""}.</p>`,t.querySelectorAll("[data-fase]").forEach($=>{$.setAttribute("aria-pressed",String(Number($.dataset.fase)===r.fase)),$.classList.toggle("vigente",Number($.dataset.fase)===c)})},l=i=>{const c=i.target.closest("[data-fase]");c&&(r.fase=Number(c.dataset.fase),o());const p=i.target.closest("[data-dia]");p&&(r.dia=p.dataset.dia,o())};t.addEventListener("click",l),o();const f=setInterval(o,6e4);return()=>{clearInterval(f),t.removeEventListener("click",l)}}function te(t){const e=(s,n)=>new Date(`${s}T12:00:00`).toLocaleDateString("es-MX",{day:"numeric",month:"short"}),a=new Date(`${t.segunda}T12:00:00`);return a.setDate(a.getDate()-1),`
    <div class="fases" role="group" aria-label="Fase del semestre (grupos de fin de semana)">
      <button type="button" data-fase="1">Primera fase <small>${e(t.primera)} – ${a.toLocaleDateString("es-MX",{day:"numeric",month:"short"})}</small></button>
      <button type="button" data-fase="2">Segunda fase <small>desde ${e(t.segunda)}</small></button>
    </div>`}function ae(t){const e=new Set(t.map(a=>a.dia));return I.filter((a,s)=>s<5||e.has(a))}function oe(t,e,a,s){if(e.length)return e.map(o=>`
      <p class="ahora__estado ahora__estado--si">Ahora</p>
      <p class="ahora__lugar${o.tipo==="asesoria_virtual"?" ahora__lugar--virtual":""}">${u(A(o))}</p>
      ${o.tipo==="asesoria_virtual"?'<p class="ahora__nota">No está en un salón en este horario.</p>':""}
      <p>${u(E(o.materia))} · ${u(H(t,o))}, hasta las ${o.fin}</p>`).join("<hr>");const n=t==="maestro"?"Sin actividad registrada en este momento.":"Sin clase en este momento.";if(!a)return`<p class="ahora__estado">${n}</p>`;const r=a.bloque;return`
    <p class="ahora__estado">${n}</p>
    <p>Siguiente: <strong>${se(a,s)} a las ${r.inicio}</strong>
      <strong>${u(z(r))}</strong> · ${u(E(r.materia))} · ${u(H(t,r))}</p>`}function se({dia:t,fecha:e},a){if(e===a.fecha)return"hoy";const s=new Date(`${a.fecha}T12:00:00`);if(s.setDate(s.getDate()+1),e===s.toISOString().slice(0,10))return"mañana";const n=new Date(`${e}T12:00:00`);return`${C[t].toLowerCase()} ${n.getDate()} de ${n.toLocaleDateString("es-MX",{month:"long"})}`}function H(t,e){return t==="maestro"?D(e.grupo):e.maestro}function ne(t,e,a,s,n){const r=Math.floor(Math.min(...e.map(c=>m(c.inicio)))/60),o=Math.ceil(Math.max(...e.map(c=>m(c.fin)))/60),l=(o-r)*_,f=[];for(let c=r;c<o;c++)f.push(`<div class="semana__hora" style="top:${(c-r)*_}px">${String(c).padStart(2,"0")}:00</div>`);const i=a.map(c=>{const p=e.filter(d=>d.dia===c),{carriles:S,total:v}=re(p),M=p.map(d=>{const $=(m(d.inicio)-r*60)/60*_,P=(m(d.fin)-m(d.inicio))/60*_,q=100/v;return`
        <div class="bloque ${F(d,s)}" style="top:${$}px;height:${P-3}px;left:${S.get(d)*q}%;width:calc(${q}% - 3px)">
          <strong>${u(A(d))}</strong>
          <span>${u(E(d.materia))}</span>
          <span class="bloque__quien">${d.inicio}–${d.fin} · ${u(t==="maestro"?d.grupo:d.maestro)}</span>
        </div>`}).join("");return`
      <div class="semana__dia${c===n?" semana__dia--hoy":""}">
        <div class="semana__nombre">${C[c]}</div>
        <div class="semana__cuerpo" style="height:${l}px">${M}</div>
      </div>`}).join("");return`
    <div class="semana" style="--dias:${a.length};--hora:${_}px">
      <div class="semana__horas"><div class="semana__nombre"></div><div class="semana__cuerpo" style="height:${l}px">${f.join("")}</div></div>
      ${i}
    </div>`}function re(t){const e=new Map,a=[];for(const s of[...t].sort((n,r)=>m(n.inicio)-m(r.inicio))){let n=a.findIndex(r=>r<=m(s.inicio));n===-1&&(n=a.length,a.push(0)),a[n]=m(s.fin),e.set(s,n)}return{carriles:e,total:Math.max(1,a.length)}}function F(t,e){return[e.has(t)?"bloque--ahora":"",t.tipo==="asesoria_virtual"?"bloque--virtual":""].join(" ")}function ie(t,e,a,s,n,r){const o=a.map(i=>`
    <button type="button" data-dia="${i}" aria-pressed="${i===n}">
      ${C[i].slice(0,3)}${i===r?"<i aria-label='hoy'>•</i>":""}
    </button>`).join(""),l=e.filter(i=>i.dia===n).sort((i,c)=>m(i.inicio)-m(c.inicio)),f=l.length?l.map(i=>`
        <li class="${F(i,s)}">
          <span class="dia__hora">${i.inicio}<br>${i.fin}</span>
          <span class="dia__info">
            <strong>${u(A(i))}</strong>
            ${u(E(i.materia))}
            <small>${u(t==="maestro"?D(i.grupo):i.maestro)}</small>
          </span>
        </li>`).join(""):'<li class="dia__vacio">Sin clases este día.</li>';return`
    <div class="dia">
      <div class="dia__pestanas">${o}</div>
      <ul class="dia__lista">${f}</ul>
    </div>`}const g=document.getElementById("app");let h=null,b=()=>{};function G(){b(),b=()=>{};const[,t,e]=decodeURIComponent(location.hash.slice(1)).split("/");if(t==="maestro"){const a=J(h,e);if(a){b=x(g,h,{tipo:"maestro",titulo:a.nombre,subtitulo:"Maestro",bloques:a.bloques}),document.title=`${a.nombre} · Horarios ISC`;return}}else if(t==="grupo"&&N(h).includes(e)){b=x(g,h,{tipo:"grupo",titulo:D(e),subtitulo:`Grupo ${e}`,bloques:Z(h,e)}),document.title=`${e} · Horarios ISC`;return}else if(!t){Q(g,h),document.title="Horarios ISC · ITSH";return}g.innerHTML='<p class="aviso">No se encontró ese horario. <a href="#/">Volver al inicio</a></p>'}async function le(){try{const e=await fetch("data/horarios.json",{cache:"no-cache"});if(!e.ok)throw new Error(`HTTP ${e.status}`);h=await e.json()}catch(e){g.innerHTML=`<p class="aviso">No se pudieron cargar los horarios (${e.message}). Intenta de nuevo más tarde.</p>`;return}const t=h.periodo.toLowerCase().replace(/(^|\s)\S/g,e=>e.toUpperCase());document.getElementById("periodo").textContent=t.replace(" - ","–"),document.getElementById("actualizado").textContent=`Actualizado el ${new Date(h.generado).toLocaleDateString("es-MX",{day:"numeric",month:"long",year:"numeric"})}.`,window.addEventListener("hashchange",()=>{G(),window.scrollTo(0,0),g.focus({preventScroll:!0})}),G()}le();
