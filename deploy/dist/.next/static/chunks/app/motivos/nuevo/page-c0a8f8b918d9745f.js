(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[8296],{3646:(e,r,s)=>{Promise.resolve().then(s.bind(s,5899))},5899:(e,r,s)=>{"use strict";s.r(r),s.d(r,{default:()=>d});var o=s(5155),n=s(2115),t=s(5695),i=s(6874),a=s.n(i),l=s(1061);function d(){let e=(0,t.useRouter)(),r=(0,t.useSearchParams)().get("configuracionId"),[s,i]=(0,n.useState)(""),[d,c]=(0,n.useState)(null),[u,m]=(0,n.useState)(!1),f=async o=>{if(o.preventDefault(),!s.trim()){c("El nombre del motivo es obligatorio");return}if(!r){c("No se ha especificado la configuraci\xf3n");return}m(!0),c(null);try{console.log("Enviando datos para crear motivo:",{nombre:s,configuracion_id:Number(r)}),await l.E.create({nombre:s,estado:"Activa",configuracion_id:Number(r)}),e.push("/motivos?configuracionId=".concat(r))}catch(e){console.error("Error al crear motivo:",e),c(e.message||"Error al crear el motivo")}finally{m(!1)}};return(0,o.jsx)("div",{className:"min-h-screen bg-[#f4f6fb]",children:(0,o.jsxs)("div",{className:"p-6",children:[(0,o.jsxs)(a(),{href:"/motivos".concat(r?"?configuracionId=".concat(r):""),className:"inline-flex items-center text-[#303e65] mb-6",children:[(0,o.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",className:"mr-2",children:(0,o.jsx)("path",{d:"M19 12H5M12 19l-7-7 7-7"})}),"Regresar"]}),(0,o.jsx)("h1",{className:"text-2xl font-bold text-gray-800 mb-1",children:"Nuevo registro"}),(0,o.jsx)("p",{className:"text-gray-600 mb-8",children:"Crea y registra nuevos motivos."}),(0,o.jsxs)("div",{className:"bg-white rounded-lg p-8 shadow-sm",children:[d&&(0,o.jsx)("div",{className:"mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md",children:d}),(0,o.jsxs)("form",{onSubmit:f,children:[(0,o.jsx)("div",{className:"mb-6",children:(0,o.jsx)("input",{type:"text",id:"nombre",value:s,onChange:e=>i(e.target.value),className:"w-full p-3 bg-[#f4f6fb] border-0 rounded-md focus:ring-2 focus:ring-[#303e65]",placeholder:"Nombre del Motivo"})}),(0,o.jsx)("div",{className:"flex justify-end",children:(0,o.jsx)("button",{type:"submit",disabled:u,className:"flex items-center justify-center bg-[#f5d433] text-[#303e65] font-medium px-4 py-2 rounded-full hover:bg-[#f7dc5c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f5d433] disabled:opacity-70",children:u?(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("div",{className:"w-4 h-4 border-2 border-[#303e65] border-t-transparent rounded-full animate-spin mr-2"}),"Guardando..."]}):(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",className:"mr-2",children:[(0,o.jsx)("path",{d:"M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"}),(0,o.jsx)("polyline",{points:"17 21 17 13 7 13 7 21"}),(0,o.jsx)("polyline",{points:"7 3 7 8 15 8"})]}),"Guardar"]})})})]})]})]})})}}},e=>{var r=r=>e(e.s=r);e.O(0,[6874,5111,8441,1684,7358],()=>r(3646)),_N_E=e.O()}]);