/* ============================================================
   Sabor & Cia — app.js
   ============================================================
   Este é o JavaScript principal do site.

   O que este arquivo controla:
   1. Funções auxiliares (buscar elementos, tratar textos e avisos).
   2. Cadastro, login e sessão do usuário.
   3. Favoritos, comentários e receitas salvas no navegador.
   4. Carregamento das receitas do arquivo recipes-data.js.
   5. Timer da receita e avaliação por estrelas.
   6. Busca, filtros e "o que tenho em casa".
   7. Tradução, acessibilidade, tema e tamanho da fonte.
   8. Recursos de comunidade, perfil e moderação.

   IMPORTANTE:
   - Os comentários explicativos servem apenas para explicar o código.
     para explicar o código. Eles NÃO aparecem no site.
   - Não apague nomes como data-favorite, data-comment-form, etc.
     sem também alterar o HTML correspondente, porque o JavaScript
     usa esses nomes para encontrar os botões e formulários.
   ============================================================ */

// Atalhos para procurar elementos no HTML.
// $(...) pega o primeiro elemento; $$(...) pega todos os elementos.
const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];
// Chaves usadas no localStorage/sessionStorage. Elas guardam sessão, favoritos, receitas e comentários.
const AUTH_TOKEN_KEY = 'sabor-auth-token-v1';
const AUTH_USER_KEY = 'sabor-auth-user-v1';
const LOCAL_USERS_KEY = 'sabor-local-users-v2';
const LOCAL_FAVORITES_KEY = 'sabor-local-favorites-v2';
const LOCAL_RECIPES_KEY = 'sabor-local-recipes-v2';
const LOCAL_COMMENTS_KEY = 'sabor-local-comments-v2';
const GESTURE_ENABLED_KEY = 'sabor-gesture-enabled-v1';
const GESTURE_CLICK_MS = 700; // 0,70 s: 0,10 s a mais que a versão anterior.
let speechToken = 0;

// Normaliza textos: deixa minúsculo, remove acentos e espaços extras. Muito usado nas buscas.
function norm(value){return String(value||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();}
function escapeHtml(value){return String(value??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function escapeAttr(value){return escapeHtml(value);}
function initials(name){const p=String(name||'Usuário').trim().split(/\s+/);return ((p[0]?.[0]||'U')+(p.length>1?p.at(-1)[0]:'')).toUpperCase();}
// Mostra uma mensagem pequena na tela por alguns segundos.
function toast(message){let t=$('[data-toast]');if(!t){t=document.createElement('div');t.className='toast';t.dataset.toast='';t.setAttribute('role','status');document.body.appendChild(t)}t.textContent=message;t.classList.add('show');clearTimeout(t._timer);t._timer=setTimeout(()=>t.classList.remove('show'),3000)}
// ===== CONTA E LOGIN =====
// Lê o token e os dados do usuário que está conectado.
function authToken(){return localStorage.getItem(AUTH_TOKEN_KEY)||sessionStorage.getItem(AUTH_TOKEN_KEY)||'';}
function authUser(){try{return JSON.parse(localStorage.getItem(AUTH_USER_KEY)||sessionStorage.getItem(AUTH_USER_KEY)||'null')}catch{return null}}
function setAuth(data,remember=true){const store=remember?localStorage:sessionStorage;store.setItem(AUTH_TOKEN_KEY,data.token||('local-'+Date.now()));store.setItem(AUTH_USER_KEY,JSON.stringify(data.user));if(remember){sessionStorage.removeItem(AUTH_TOKEN_KEY);sessionStorage.removeItem(AUTH_USER_KEY)}else{localStorage.removeItem(AUTH_TOKEN_KEY);localStorage.removeItem(AUTH_USER_KEY)}}
function clearAuth(){localStorage.removeItem(AUTH_TOKEN_KEY);localStorage.removeItem(AUTH_USER_KEY);sessionStorage.removeItem(AUTH_TOKEN_KEY);sessionStorage.removeItem(AUTH_USER_KEY)}
function readStore(key,fallback=[]){try{const value=JSON.parse(localStorage.getItem(key)||'null');return value??fallback}catch{return fallback}}
function writeStore(key,value){localStorage.setItem(key,JSON.stringify(value));return value}
function apiError(message,status=400,code='LOCAL_ERROR'){const e=new Error(message);e.status=status;e.code=code;throw e}
async function localPassword(value){const raw=String(value||'');try{if(globalThis.crypto?.subtle){const buf=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(raw));return [...new Uint8Array(buf)].map(x=>x.toString(16).padStart(2,'0')).join('')}}catch{}return 'local-'+encodeURIComponent(raw)}
function currentAccountKey(){return norm(authUser()?.email||'visitante')||'visitante'}
function allFavorites(){const all=readStore(LOCAL_FAVORITES_KEY,{});return (all&&typeof all==='object')?all:{}}
function currentFavorites(){return allFavorites()[currentAccountKey()]||[]}
function saveCurrentFavorites(items){const all=allFavorites();all[currentAccountKey()]=items;writeStore(LOCAL_FAVORITES_KEY,all);return items}
function recipeMetaFromPage(key){const btn=$(`[data-favorite][data-recipe="${CSS.escape(key)}"]`);const card=btn?.closest('.recipe-card');return {key,title:$('h3',card)?.textContent?.trim()||'Nome da receita',image:$('img',card)?.src||'',cover:$('img',card)?.src||''}}

// ===== RECEITAS =====
// Procura uma receita cadastrada em recipes-data.js usando o id/slug da receita.
function getBuiltinRecipe(id){
  const aliases=window.SABOR_RECIPE_ALIASES||{};
  const key=aliases[id]||id;
  return {key,recipe:(window.SABOR_BUILTIN_RECIPES||{})[key]||null};
}
function formatQuantity(value){
  if(value===null||value===undefined||value==='')return '';
  const n=Number(value);if(!Number.isFinite(n))return String(value);
  const rounded=Math.round(n*100)/100, whole=Math.floor(rounded), frac=Math.round((rounded-whole)*100)/100;
  const fractions=[[.25,'¼'],[.33,'⅓'],[.5,'½'],[.67,'⅔'],[.75,'¾']];
  const found=fractions.find(([x])=>Math.abs(frac-x)<.035);
  if(found)return (whole?whole+' ':'')+found[1];
  return Number.isInteger(rounded)?String(rounded):String(rounded).replace('.',',');
}
function humanTimer(seconds){
  const s=Number(seconds||0);if(s<60)return `${s}s`;const m=Math.round(s/60);return m<60?`${m} min`:`${Math.floor(m/60)}h${m%60?String(m%60).padStart(2,'0'):''}`;
}
function recipePlaceholderMarkup(recipe,detail=false){
  const isKids=(recipe?.categories||[]).includes('infantis')||recipe?.kids===true;
  const category=escapeHtml(recipe?.category||'Receita');
  const title=escapeHtml(recipe?.title||'Receita Sabor & Cia');
  return `<div class="recipe-photo-placeholder${isKids?' kids-photo-placeholder':''}${detail?' detail-placeholder':''}" aria-label="${title} — sem foto"><span class="placeholder-icon" aria-hidden="true">${isKids?'🌈':'🍴'}</span><small>${isKids?'RECEITA INFANTIL':category.toUpperCase()}</small><strong>${title}</strong></div>`;
}
// Monta a página completa de uma receita usando os dados do catálogo.
// Aqui aparecem foto, ingredientes, tempo, modo de preparo, timer e comentários.
function renderBuiltinRecipe(key,recipe){
  const main=$('.recipe-detail');if(!main||!recipe)return;
  const isKids=(recipe.categories||[]).includes('infantis')||recipe.kids===true;
  main.classList.toggle('kids-recipe-detail',isKids);
  document.title=recipe.title+' — Sabor & Cia';
  const ingredients=recipe.ingredients.map((ing,i)=>`<label class="check recipe-ingredient"><input type="checkbox"><span>${ing.q==null?'':`<b data-ingredient-qty data-base-qty="${ing.q}">${formatQuantity(ing.q)}</b> `}${ing.u?`<span class="ingredient-unit">${escapeHtml(ing.u)}</span> `:''}<span>${escapeHtml(ing.i)}</span></span></label>`).join('');
  const steps=recipe.steps.map((step,i)=>`<article class="step"><span>${String(i+1).padStart(2,'0')}</span><div><h3>${escapeHtml(step.t)}</h3><p>${escapeHtml(step.d)}</p><div class="step-actions"><button class="step-done" type="button">✓ Concluir etapa</button></div></div></article>`).join('');
  main.innerHTML=`
    <div class="breadcrumb"><a href="receitas.html">Receitas</a><span>/</span><span>${escapeHtml(recipe.category)}</span></div>
    <section class="detail-hero"><div class="detail-photo">${recipe.image?`<img alt="${escapeAttr(recipe.title)}" src="${escapeAttr(recipe.image)}">`:recipePlaceholderMarkup(recipe,true)}</div><div class="detail-intro"><span class="eyebrow">${isKids?'RECEITA INFANTIL 🌈':'RECEITA COMPLETA'}</span><h1>${escapeHtml(recipe.title)}</h1><p class="lead">${escapeHtml(recipe.description)}</p>${isKids?'<div class="kids-safety-note">🧑‍🍳 <strong>Cozinha em equipe:</strong> criança pode ajudar nas etapas simples; fogo, forno, facas e eletrodomésticos ficam com um adulto.</div>':''}<div class="detail-rating"><b>${escapeHtml(recipe.rating||'4,8')}</b><span>★★★★★</span><small>${Number(recipe.reviews||0)} avaliações</small></div><div class="detail-actions"><button class="btn btn-primary" data-favorite data-recipe="${escapeAttr(key)}" type="button">♡ Salvar</button><button class="outline-btn" data-share type="button">↗ Compartilhar receita</button></div></div></section>
    <section class="detail-info"><div><span>◷</span><strong>${Number(recipe.minutes)} min</strong><small>tempo total</small></div><div><span>●</span><strong>${escapeHtml(recipe.difficulty)}</strong><small>dificuldade</small></div><div><span>♨</span><strong data-servings-summary>${Number(recipe.servings)} porções</strong><small>rendimento ajustável</small></div><div><span>✓</span><strong>${recipe.steps.length} etapas</strong><small>passo a passo</small></div></section>
    <section class="cook-layout"><div class="ingredients"><span class="eyebrow">PARA COMEÇAR</span><h2>Ingredientes</h2><p class="helper">Escolha para quantas pessoas você vai cozinhar. As quantidades mudam automaticamente.</p>
      <div class="servings-control" data-servings-controls data-base-servings="${Number(recipe.servings)}" data-current-servings="${Number(recipe.servings)}"><button type="button" data-servings-minus aria-label="Diminuir porções">−</button><div><small>PORÇÕES</small><strong data-servings-value>${Number(recipe.servings)}</strong></div><button type="button" data-servings-plus aria-label="Aumentar porções">+</button></div>
      ${ingredients}
      <div class="timer-box live-recipe-timer" data-recipe-live-timer data-recipe-seconds="${Number(recipe.minutes)*60}"><span class="eyebrow">TIMER DA RECEITA</span><strong data-live-timer-display>${String(Number(recipe.minutes)).padStart(2,'0')}:00</strong><small data-live-timer-label>Tempo da receita: ${Number(recipe.minutes)} minutos.</small><div><button class="btn btn-primary btn-small" data-live-timer-start type="button">Iniciar</button></div></div>
    </div><div class="steps"><div class="steps-head"><div><span class="eyebrow">AGORA, MÃO NA MASSA</span><h2>Modo de preparo</h2><p class="helper">Marque o que já concluiu.</p></div><div aria-label="Progresso" class="progress"><span style="width:0%"></span></div></div>${steps}</div></section>
    <section class="comment-box"><span class="eyebrow">CONTA PRA GENTE</span><h2>Você fez? <em>Conta como ficou.</em></h2><p>Seu comentário fica nesta receita e também aparece na comunidade.</p><form data-comment-form data-recipe="${escapeAttr(key)}" data-recipe-title="${escapeAttr(recipe.title)}"><fieldset class="star-rating" data-star-rating><legend>Sua avaliação</legend><input type="hidden" name="rating" value="0"><div class="star-rating-buttons" role="radiogroup" aria-label="Sua avaliação"><button type="button" data-star-value="1" aria-label="1 estrela">★</button><button type="button" data-star-value="2" aria-label="2 estrelas">★</button><button type="button" data-star-value="3" aria-label="3 estrelas">★</button><button type="button" data-star-value="4" aria-label="4 estrelas">★</button><button type="button" data-star-value="5" aria-label="5 estrelas">★</button></div></fieldset><label for="comment-text">Seu comentário</label><textarea id="comment-text" maxlength="500" placeholder="Escreva sua experiência com essa receita..." required></textarea><div class="comment-form-footer"><small>Até 500 caracteres.</small><button class="btn btn-primary" type="submit">Publicar comentário</button></div></form></section>
    <section class="recipe-comments"><span class="eyebrow">O QUE A COMUNIDADE DISSE</span><h2>Comentários de quem <em>já fez.</em> <span data-comments-count>(0)</span></h2><div class="comments-list" data-comments-list aria-live="polite"></div></section>`;
}
function setupServingsScaler(){
  const box=$('[data-servings-controls]');if(!box)return;
  const base=Math.max(1,Number(box.dataset.baseServings||1)),value=$('[data-servings-value]',box),summary=$('[data-servings-summary]');
  const apply=next=>{const current=Math.max(1,Math.min(30,Number(next)||base));box.dataset.currentServings=String(current);if(value)value.textContent=String(current);if(summary)summary.textContent=`${current} ${current===1?'porção':'porções'}`;$$('[data-ingredient-qty]').forEach(el=>{const q=Number(el.dataset.baseQty);if(Number.isFinite(q))el.textContent=formatQuantity(q*current/base)})};
  $('[data-servings-minus]',box)?.addEventListener('click',()=>apply(Number(box.dataset.currentServings)-1));
  $('[data-servings-plus]',box)?.addEventListener('click',()=>apply(Number(box.dataset.currentServings)+1));apply(base);
}
function setupStepTimers(){
  const box=$('[data-recipe-live-timer]');if(!box)return;
  const display=$('[data-live-timer-display]',box),label=$('[data-live-timer-label]',box),start=$('[data-live-timer-start]',box);
  const total=Math.max(0,Number(box.dataset.recipeSeconds||0));
  let remaining=total,timer=null;
  const render=()=>{const m=Math.floor(remaining/60),sec=remaining%60;if(display)display.textContent=String(m).padStart(2,'0')+':'+String(sec).padStart(2,'0')};
  start?.addEventListener('click',()=>{
    if(timer)return;
    if(remaining<=0)remaining=total;
    if(remaining<=0){toast('Esta receita ainda não tem um tempo definido.');return}
    start.disabled=true;start.textContent='Em andamento…';
    timer=setInterval(()=>{
      remaining--;render();
      if(remaining<=0){clearInterval(timer);timer=null;start.disabled=false;start.textContent='Iniciar novamente';toast('Tempo da receita finalizado!')}
    },1000);
  });
  if(label&&total>0)label.textContent=`Tempo da receita: ${Math.round(total/60)} minutos.`;
  render();
}

function setupStarRatings(){
  // Compatibilidade com versões antigas que ainda tenham o menu "1 a 5 estrelas".
  $$('select[name="rating"]').forEach(select=>{
    if(select.closest('[data-star-rating]'))return;
    const field=document.createElement('fieldset');field.className='star-rating';field.dataset.starRating='';
    field.innerHTML='<legend>Sua avaliação</legend><input type="hidden" name="rating" value="0"><div class="star-rating-buttons" role="radiogroup" aria-label="Sua avaliação"><button type="button" data-star-value="1" aria-label="1 estrela" aria-checked="false">★</button><button type="button" data-star-value="2" aria-label="2 estrelas" aria-checked="false">★</button><button type="button" data-star-value="3" aria-label="3 estrelas" aria-checked="false">★</button><button type="button" data-star-value="4" aria-label="4 estrelas" aria-checked="false">★</button><button type="button" data-star-value="5" aria-label="5 estrelas" aria-checked="false">★</button></div>';
    select.replaceWith(field);
  });
  $$('[data-star-rating]').forEach(group=>{
    if(group.dataset.starBound)return;group.dataset.starBound='1';
    const input=$('input[name="rating"]',group),buttons=$$('[data-star-value]',group);
    const paint=value=>buttons.forEach(btn=>{const active=Number(value)>0&&Number(btn.dataset.starValue)<=Number(value);btn.classList.toggle('selected',active);btn.setAttribute('aria-checked',btn.dataset.starValue==value?'true':'false')});
    buttons.forEach(btn=>btn.addEventListener('click',()=>{input.value=btn.dataset.starValue;paint(input.value)}));
    paint(Number(input?.value||0));
  });
}

// API local temporária: mantém cadastro, login, favoritos, comentários e receitas no navegador.
// Assim o projeto funciona sem MySQL enquanto o banco definitivo não é recolocado.
async function api(path,options={}){
  const method=String(options.method||'GET').toUpperCase();
  let body={};try{body=typeof options.body==='string'?JSON.parse(options.body||'{}'):(options.body||{})}catch{}
  await Promise.resolve();
  if(path==='/health') return {ok:true,mode:'local'};
  if(path==='/auth/register'&&method==='POST'){
    const name=String(body.name||'').trim(),email=String(body.email||'').trim().toLowerCase(),password=String(body.password||'');
    if(!name||!email||!password) apiError('Preencha nome, e-mail e senha.',400,'INVALID_DATA');
    const users=readStore(LOCAL_USERS_KEY,[]);
    if(users.some(u=>u.email===email)) apiError('Já existe uma conta com este e-mail. Entre na sua conta.',409,'EMAIL_EXISTS');
    const user={id:'u-'+Date.now(),name,email,emailConsent:!!body.emailConsent,createdAt:new Date().toISOString()};
    users.push({...user,passwordHash:await localPassword(password)});writeStore(LOCAL_USERS_KEY,users);
    return {token:'local-'+Date.now(),user};
  }
  if(path==='/auth/login'&&method==='POST'){
    const email=String(body.email||'').trim().toLowerCase(),password=String(body.password||'');
    const users=readStore(LOCAL_USERS_KEY,[]),found=users.find(u=>u.email===email);
    if(!found) apiError('Não encontramos uma conta com este e-mail. Cadastre-se primeiro.',404,'ACCOUNT_NOT_FOUND');
    if(found.passwordHash!==await localPassword(password)) apiError('Senha incorreta.',401,'INVALID_CREDENTIALS');
    const {passwordHash,...user}=found;return {token:'local-'+Date.now(),user};
  }
  if(path==='/auth/me'){
    const user=authUser();if(!user)apiError('Você precisa entrar na sua conta.',401,'UNAUTHORIZED');return {user};
  }
  if(path==='/favorites'&&method==='GET') return currentFavorites();
  if(path.startsWith('/favorites/')){
    if(!authUser())apiError('Cadastre-se ou entre para usar os favoritos.',401,'UNAUTHORIZED');
    const key=decodeURIComponent(path.slice('/favorites/'.length));let favs=currentFavorites();
    if(method==='GET')return {saved:favs.some(x=>x.key===key)};
    if(method==='POST'){if(!favs.some(x=>x.key===key))favs.push(recipeMetaFromPage(key));saveCurrentFavorites(favs);return {saved:true}}
    if(method==='DELETE'){favs=favs.filter(x=>x.key!==key);saveCurrentFavorites(favs);return {saved:false}}
  }
  if(path==='/recipes'&&method==='GET') return readStore(LOCAL_RECIPES_KEY,[]);
  if(path==='/recipes/mine'&&method==='GET'){
    const email=authUser()?.email;return readStore(LOCAL_RECIPES_KEY,[]).filter(r=>r.authorEmail===email);
  }
  if(path==='/recipes'&&method==='POST'){
    if(!authUser())apiError('Cadastre-se ou entre para publicar.',401,'UNAUTHORIZED');
    const list=readStore(LOCAL_RECIPES_KEY,[]),title=String(body.title||'Nome da receita').trim();
    const key=(norm(title).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'receita')+'-'+Date.now().toString().slice(-6);
    const recipe={...body,key,id:key,author:authUser().name,authorEmail:authUser().email,status:'aprovada',createdAt:new Date().toISOString()};
    list.unshift(recipe);writeStore(LOCAL_RECIPES_KEY,list);return recipe;
  }
  const commentsMatch=path.match(/^\/recipes\/([^/]+)\/comments$/);
  if(commentsMatch){
    const recipeId=decodeURIComponent(commentsMatch[1]),all=readStore(LOCAL_COMMENTS_KEY,[]);
    if(method==='GET')return all.filter(c=>c.recipeId===recipeId).map(c=>({...c,owner:c.ownerEmail===authUser()?.email}));
    if(method==='POST'){
      if(!authUser())apiError('Cadastre-se ou entre para comentar.',401,'UNAUTHORIZED');
      const c={id:'c-'+Date.now(),recipeId,recipeTitle:body.recipeTitle||'Nome da receita',name:authUser().name,ownerEmail:authUser().email,date:new Date().toLocaleDateString('pt-BR'),rating:Number(body.rating||5),text:String(body.text||''),likes:0};
      all.unshift(c);writeStore(LOCAL_COMMENTS_KEY,all);return c;
    }
  }
  const likeMatch=path.match(/^\/comments\/([^/]+)\/like$/);
  if(likeMatch&&method==='POST'){
    const all=readStore(LOCAL_COMMENTS_KEY,[]),c=all.find(x=>x.id===likeMatch[1]);if(!c)apiError('Comentário não encontrado.',404);c.likes=Number(c.likes||0)+1;writeStore(LOCAL_COMMENTS_KEY,all);return {likes:c.likes};
  }
  const deleteMatch=path.match(/^\/comments\/([^/]+)$/);
  if(deleteMatch&&method==='DELETE'){
    const all=readStore(LOCAL_COMMENTS_KEY,[]),next=all.filter(c=>!(c.id===deleteMatch[1]&&c.ownerEmail===authUser()?.email));writeStore(LOCAL_COMMENTS_KEY,next);return {ok:true};
  }
  if(path==='/community'&&method==='GET') return readStore(LOCAL_COMMENTS_KEY,[]).slice(0,40);
  const recipeMatch=path.match(/^\/recipes\/([^/]+)$/);
  if(recipeMatch&&method==='GET'){
    const id=decodeURIComponent(recipeMatch[1]);const found=readStore(LOCAL_RECIPES_KEY,[]).find(r=>r.key===id||r.id===id);return found||{builtIn:true,key:id};
  }
  apiError('Este recurso ainda não está disponível no modo local.',404,'NOT_IMPLEMENTED');
}
function goLogin(message){if(message)sessionStorage.setItem('sabor-login-message',message);sessionStorage.setItem('sabor-after-login',location.href);const hasUsers=readStore(LOCAL_USERS_KEY,[]).length>0;const target=hasUsers?'login.html':'cadastro.html';location.href=location.pathname.includes('/pages/')?target:'pages/'+target;}
function requireAuth(){if(!authUser()){goLogin('Para continuar, crie sua conta ou entre na conta já cadastrada.');return false}return true;}

function setupTheme(){const saved=localStorage.getItem('sabor-theme')||'light';document.body.classList.toggle('dark',saved==='dark');$$('[data-theme]').forEach(b=>b.addEventListener('click',()=>{const dark=document.body.classList.toggle('dark');localStorage.setItem('sabor-theme',dark?'dark':'light');toast(dark?'Modo escuro ativado.':'Modo claro ativado.')}))}
function setupMenu(){$$('[data-menu]').forEach(b=>b.addEventListener('click',()=>{const nav=$('.main-nav');if(!nav)return;const open=nav.classList.toggle('open');b.setAttribute('aria-expanded',String(open))}))}

function buildAccessibilityPanel(){if($('[data-panel]'))return;const panel=document.createElement('aside');panel.className='access-panel';panel.dataset.panel='';panel.setAttribute('aria-hidden','true');panel.innerHTML=`<div class="panel-head"><div><span class="eyebrow">ACESSIBILIDADE</span><h2>Seu jeito de navegar.</h2></div><button type="button" data-close-panel aria-label="Fechar">×</button></div><div class="access-options"><button type="button" data-font="down"><span>A−</span><div><strong>Diminuir fonte</strong><small>Reduzir tamanho do texto</small></div></button><button type="button" data-font="reset"><span>A</span><div><strong>Fonte padrão</strong><small>Voltar ao tamanho normal</small></div></button><button type="button" data-font="up"><span>A+</span><div><strong>Aumentar fonte</strong><small>Ampliar tamanho do texto</small></div></button><button type="button" data-contrast><span>◐</span><div><strong>Alto contraste</strong><small>Mais contraste entre elementos</small></div><i></i></button><button type="button" data-reduced-motion><span>≈</span><div><strong>Reduzir animações</strong><small>Menos movimento</small></div><i></i></button><button type="button" data-highlight-links><span>↗</span><div><strong>Destacar links</strong><small>Links mais visíveis</small></div><i></i></button><button type="button" data-spacing><span>↔</span><div><strong>Aumentar espaçamento</strong><small>Mais espaço entre linhas e letras</small></div><i></i></button><button type="button" data-read><span>▶</span><div><strong>Ouvir conteúdo</strong><small>Leitura guiada por partes</small></div></button><button type="button" data-speak-toggle><span>🔊</span><div><strong>Falar ao clicar</strong><small>Leia exatamente o texto escolhido</small></div><i></i></button><button type="button" data-libras><span>🤟</span><div><strong>Libras</strong><small>Abrir tradutor VLibras</small></div></button><button type="button" data-gesture-toggle><span>✋</span><div><strong>Controle por gestos</strong><small>Câmera lateral + rolagem da página</small></div></button></div><div class="access-language"><span class="eyebrow">IDIOMA</span><strong>Traduzir o site</strong><small>Troque rapidamente entre português, inglês e espanhol ou abra o Google Tradutor para mais idiomas.</small><select data-access-language aria-label="Idioma do site"><option value="pt">Português</option><option value="en">English</option><option value="es">Español</option></select><button type="button" class="outline-btn" data-google-translate-toggle>🌐 Google Tradutor — mais idiomas</button><div class="google-translate-box" data-google-translate-box hidden><div id="google_translate_element"></div><small>O tradutor do Google precisa de internet para carregar.</small></div></div><div class="access-note">A janela pode ser fechada sem interromper a página.</div>`;document.body.appendChild(panel)}
function setupAccessibility(){buildAccessibilityPanel();const panel=$('[data-panel]');$$('[data-accessibility]').forEach(b=>b.addEventListener('click',()=>{panel.classList.add('open');panel.setAttribute('aria-hidden','false')}));$$('[data-footer-accessibility]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();panel.classList.add('open');panel.setAttribute('aria-hidden','false')}));$('[data-close-panel]',panel)?.addEventListener('click',()=>{panel.classList.remove('open');panel.setAttribute('aria-hidden','true')});let font=Number(localStorage.getItem('sabor-font')||16);const applyFont=()=>{font=Math.max(14,Math.min(24,font));const scale=font/16;document.documentElement.style.fontSize=font+'px';document.documentElement.style.setProperty('--sabor-font-scale',String(scale));document.querySelectorAll('body *').forEach(el=>{if(el.matches('script,style,svg,svg *')||el.closest('.goog-te-menu-frame'))return;if(!el.dataset.saborBaseFont){const size=parseFloat(getComputedStyle(el).fontSize);if(Number.isFinite(size)&&size>0)el.dataset.saborBaseFont=String(size/scale)}const base=Number(el.dataset.saborBaseFont);if(Number.isFinite(base)&&base>0)el.style.fontSize=(base*scale)+'px'});localStorage.setItem('sabor-font',String(font))};applyFont();const fontObserver=new MutationObserver(m=>{if(!m.some(x=>x.addedNodes.length))return;requestAnimationFrame(applyFont)});fontObserver.observe(document.body,{childList:true,subtree:true});$('[data-font="down"]',panel)?.addEventListener('click',()=>{font--;applyFont();toast(`Fonte: ${font}px`)});$('[data-font="reset"]',panel)?.addEventListener('click',()=>{font=16;applyFont();toast('Fonte padrão restaurada.')});$('[data-font="up"]',panel)?.addEventListener('click',()=>{font++;applyFont();toast(`Fonte: ${font}px`)});const toggle=(key,cls,sel,onMsg,offMsg)=>{const btn=$(sel,panel);const apply=on=>{document.body.classList.toggle(cls,on);localStorage.setItem(key,on?'1':'0');btn?.classList.toggle('active',on);btn?.setAttribute('aria-pressed',String(on))};apply(localStorage.getItem(key)==='1');btn?.addEventListener('click',()=>{const on=!document.body.classList.contains(cls);apply(on);toast(on?onMsg:offMsg)})};toggle('sabor-contrast','high-contrast','[data-contrast]','Alto contraste ativado.','Alto contraste desativado.');toggle('sabor-motion','reduce-motion','[data-reduced-motion]','Animações reduzidas.','Animações normais restauradas.');toggle('sabor-links','highlight-links','[data-highlight-links]','Links destacados.','Destaque desativado.');toggle('sabor-spacing','wide-spacing','[data-spacing]','Espaçamento ampliado.','Espaçamento normal restaurado.');$('[data-read]',panel)?.addEventListener('click',()=>{panel.classList.remove('open');startGuidedReader()});setupClickToSpeak();setupLibras(panel);setupGestures(panel);setupAccessibilityLanguage(panel)}

function setupAccessibilityLanguage(panel){
  const select=$('[data-access-language]',panel),toggle=$('[data-google-translate-toggle]',panel),box=$('[data-google-translate-box]',panel);
  if(select){select.value=localStorage.getItem('sabor-language-v1')||'pt';select.addEventListener('change',()=>{localStorage.setItem('sabor-language-v1',select.value);const header=$('[data-language-select]');if(header){header.value=select.value;header.dispatchEvent(new Event('change'))}else location.reload()})}
  const loadGoogle=()=>{
    if(window.google?.translate?.TranslateElement){window.googleTranslateElementInit?.();return}
    if(document.querySelector('script[data-google-translate-script]'))return;
    window.googleTranslateElementInit=()=>{const host=document.getElementById('google_translate_element');if(!host||host.dataset.ready)return;host.dataset.ready='1';new google.translate.TranslateElement({pageLanguage:'pt',autoDisplay:false},'google_translate_element')};
    const script=document.createElement('script');script.dataset.googleTranslateScript='1';script.src='https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';script.async=true;document.head.appendChild(script);
  };
  toggle?.addEventListener('click',()=>{const opening=box?.hasAttribute('hidden');if(!box)return;if(opening){box.removeAttribute('hidden');loadGoogle();toggle.textContent='🌐 Fechar Google Tradutor'}else{box.setAttribute('hidden','');toggle.textContent='🌐 Google Tradutor — mais idiomas'}});
}
function speakText(text,onStart,onEnd){const token=++speechToken;const value=String(text||'').replace(/\s+/g,' ').trim();if(!value)return;if(!('speechSynthesis' in window)){toast('A leitura por voz não está disponível neste navegador.');return}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(value);u.lang='pt-BR';u.rate=.95;u.onstart=()=>{if(token===speechToken)onStart?.()};u.onend=()=>{if(token===speechToken)onEnd?.()};u.onerror=()=>{if(token===speechToken)onEnd?.()};speechSynthesis.speak(u)}
function setupClickToSpeak(){const on=localStorage.getItem('sabor-click-speak')==='1';document.body.classList.toggle('access-mode-active',on);$$('[data-speak-toggle]').forEach(b=>{b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));b.addEventListener('click',()=>{const next=!document.body.classList.contains('access-mode-active');document.body.classList.toggle('access-mode-active',next);localStorage.setItem('sabor-click-speak',next?'1':'0');$$('[data-speak-toggle]').forEach(x=>{x.classList.toggle('active',next);x.setAttribute('aria-pressed',String(next))});toast(next?'Falar ao clicar ativado. Clique em um texto da página.':'Falar ao clicar desativado.')})});document.addEventListener('click',e=>{if(!document.body.classList.contains('access-mode-active'))return;if(e.target.closest('.access-panel,.site-header,.footer,button,input,textarea,select,a,video'))return;const target=e.target.closest('main h1,main h2,main h3,main h4,main p,main li,main figcaption,main .eyebrow,.comment-text,.lead');if(!target||!target.closest('main'))return;e.preventDefault();e.stopPropagation();$$('.speak-focus').forEach(x=>x.classList.remove('speak-focus'));target.classList.add('speak-focus');speakText(target.innerText,null,()=>target.classList.remove('speak-focus'))},true)}
function readerBlocks(){return $$('main h1,main h2,main h3,main p,main li,main figcaption,main .eyebrow').filter(el=>el.offsetParent!==null&&norm(el.innerText).length>2).filter((el,i,arr)=>!arr.slice(0,i).some(prev=>prev.contains(el)||el.contains(prev)))}
function startGuidedReader(){const blocks=readerBlocks();if(!blocks.length){toast('Não encontrei conteúdo para ler nesta página.');return}let index=0,bar=$('[data-reader-bar]');if(!bar){bar=document.createElement('div');bar.className='reader-bar';bar.dataset.readerBar='';bar.innerHTML='<strong data-reader-status>Leitura</strong><button type="button" data-reader-prev aria-label="Anterior">‹</button><button type="button" data-reader-play aria-label="Pausar leitura">❚❚</button><button type="button" data-reader-next aria-label="Próximo">›</button><button type="button" data-reader-close aria-label="Fechar leitor">×</button>';document.body.appendChild(bar)}const status=$('[data-reader-status]',bar),play=$('[data-reader-play]',bar),clear=()=>blocks.forEach(x=>x.classList.remove('speak-focus'));const read=()=>{clear();const el=blocks[index];if(!el)return;el.classList.add('speak-focus');el.scrollIntoView({behavior:document.body.classList.contains('reduce-motion')?'auto':'smooth',block:'center'});status.textContent=`Lendo ${index+1}/${blocks.length}: ${el.innerText.slice(0,90)}`;speakText(el.innerText,null,()=>{el.classList.remove('speak-focus');if(index<blocks.length-1){index++;read()}})};$('[data-reader-prev]',bar).onclick=()=>{index=Math.max(0,index-1);read()};play.onclick=()=>{if(speechSynthesis.speaking&&!speechSynthesis.paused){speechSynthesis.pause();play.textContent='▶';play.setAttribute('aria-label','Continuar leitura')}else if(speechSynthesis.paused){speechSynthesis.resume();play.textContent='❚❚';play.setAttribute('aria-label','Pausar leitura')}else read()};$('[data-reader-next]',bar).onclick=()=>{speechToken++;speechSynthesis.cancel();index=Math.min(blocks.length-1,index+1);read()};$('[data-reader-close]',bar).onclick=()=>{speechToken++;speechSynthesis.cancel();clear();bar.remove()};bar.classList.add('show');read()}
function setupLibras(panel){const b=$('[data-libras]',panel);if(!b)return;b.onclick=()=>{let widget=document.querySelector('[vw]');if(widget){widget.classList.toggle('active');toast(widget.classList.contains('active')?'VLibras aberto.':'VLibras minimizado.');return}widget=document.createElement('div');widget.setAttribute('vw','');widget.className='enabled';widget.innerHTML='<div vw-access-button class="active"></div><div vw-plugin-wrapper><div class="vw-plugin-top-wrapper"></div></div>';document.body.appendChild(widget);const s=document.createElement('script');s.src='https://vlibras.gov.br/app/vlibras-plugin.js';s.onload=()=>{try{new window.VLibras.Widget('https://vlibras.gov.br/app');toast('VLibras ativado. Use o botão que apareceu na lateral.')}catch{toast('Não foi possível iniciar o VLibras.')}};s.onerror=()=>toast('O VLibras precisa de internet para funcionar.');document.body.appendChild(s)}}
function setupGestures(panel){
  const b=$('[data-gesture-toggle]',panel);if(!b)return;
  const setButtonState=on=>{b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on))};
  const deactivate=()=>{
    localStorage.setItem(GESTURE_ENABLED_KEY,'0');
    const box=$('[data-gesture-box]');
    box?._gestureCleanup?.();
    box?.remove();
    document.body.classList.remove('gesture-mode-active');
    setButtonState(false);
    toast('Controle por gestos desativado.');
  };
  const activate=({announce=true}={})=>{
    let box=$('[data-gesture-box]');
    localStorage.setItem(GESTURE_ENABLED_KEY,'1');
    setButtonState(true);
    if(box)return;
    box=document.createElement('aside');
    box.className='gesture-box';box.dataset.gestureBox='';box.setAttribute('aria-label','Controle por gestos');
    box.innerHTML='<div class="gesture-card"><button type="button" data-gesture-close aria-label="Desativar controle por gestos">×</button><span class="eyebrow">ACESSIBILIDADE</span><strong>Controle por gestos</strong><p>A câmera fica na lateral e continuará ativa quando você entrar em outras páginas do Sabor & Cia. Feche no × ou aperte novamente em Controle por gestos para desativar.</p><video autoplay muted playsinline data-gesture-video aria-label="Imagem da câmera para controle por gestos"></video><div class="gesture-status-badge"><span class="gesture-dot"></span><small data-gesture-status>Inicializando câmera…</small></div><div class="gesture-help"><div><strong>✋</strong><span>Mão aberta<br>descer a página</span></div><div><strong>✊</strong><span>Mão fechada<br>subir a página</span></div><div><strong>☝️</strong><span>Um dedo<br>apontar e clicar nas abas</span></div></div><div class="gesture-actions"><button type="button" class="outline-btn" data-gesture-up>↑ Subir</button><button type="button" class="outline-btn" data-gesture-down>↓ Descer</button></div></div>';
    document.body.appendChild(box);
    panel.classList.remove('open');panel.setAttribute('aria-hidden','true');
    document.body.classList.add('gesture-mode-active');
    $('[data-gesture-close]',box).onclick=deactivate;
    $('[data-gesture-up]',box).onclick=()=>window.scrollBy({top:-Math.max(500,innerHeight*.75),behavior:'smooth'});
    $('[data-gesture-down]',box).onclick=()=>window.scrollBy({top:Math.max(500,innerHeight*.75),behavior:'smooth'});
    startGestureRecognition(box);
    if(announce)toast('Controle por gestos ativado. Ele continuará nas outras páginas até você desativar.');
  };
  setButtonState(localStorage.getItem(GESTURE_ENABLED_KEY)==='1');
  b.onclick=()=>localStorage.getItem(GESTURE_ENABLED_KEY)==='1'?deactivate():activate();
  // Se o usuário navegou para outra página com o modo ativo, recria a câmera lateral automaticamente.
  if(localStorage.getItem(GESTURE_ENABLED_KEY)==='1') setTimeout(()=>activate({announce:false}),120);
}
async function startGestureRecognition(box){
  const video=$('[data-gesture-video]',box),status=$('[data-gesture-status]',box);
  if(!navigator.mediaDevices?.getUserMedia){status.textContent='Seu navegador não permite acesso à câmera.';return}
  let pointer=null,pointTarget=null,pointStarted=0,pointClicked=false;
  const clearPointTarget=()=>{pointTarget?.classList.remove('gesture-target');pointTarget=null;pointStarted=0;pointClicked=false};
  try{
    const load=src=>new Promise((resolve,reject)=>{const old=[...document.scripts].find(s=>s.src===src);if(old){if(old.dataset.loaded==='1'||window.Hands){resolve();return}old.addEventListener('load',resolve,{once:true});old.addEventListener('error',reject,{once:true});return}const s=document.createElement('script');s.src=src;s.crossOrigin='anonymous';s.onload=()=>{s.dataset.loaded='1';resolve()};s.onerror=reject;document.head.appendChild(s)});
    status.textContent='Carregando reconhecimento das mãos…';
    await load('https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js');
    await load('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js');
    const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:640},height:{ideal:480}},audio:false});
    video.srcObject=stream; await video.play().catch(()=>{});
    pointer=document.createElement('div');pointer.className='gesture-pointer';pointer.setAttribute('aria-hidden','true');document.body.appendChild(pointer);
    const hands=new window.Hands({locateFile:file=>`https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`});
    hands.setOptions({maxNumHands:1,modelComplexity:1,minDetectionConfidence:.55,minTrackingConfidence:.55});

    const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z||0);
    const angle=(a,b,c)=>{const ab={x:a.x-b.x,y:a.y-b.y},cb={x:c.x-b.x,y:c.y-b.y};const dot=ab.x*cb.x+ab.y*cb.y;const den=Math.hypot(ab.x,ab.y)*Math.hypot(cb.x,cb.y)||1;return Math.acos(Math.max(-1,Math.min(1,dot/den)))*180/Math.PI};
    const extendedFinger=(h,mcp,pip,dip,tip)=>{
      const straight=angle(h[mcp],h[pip],h[dip])>135 && angle(h[pip],h[dip],h[tip])>130;
      const farther=dist(h[tip],h[0])>dist(h[pip],h[0])*1.08;
      return straight&&farther;
    };
    const curledFinger=(h,pip,tip)=>dist(h[tip],h[0])<dist(h[pip],h[0])*1.13;
    const headerTargets=()=>$$('.site-header .main-nav a,.site-header .header-actions a,.site-header .header-actions button').filter(el=>{
      const r=el.getBoundingClientRect();return r.width>0&&r.height>0&&!el.hidden&&getComputedStyle(el).visibility!=='hidden';
    });
    const nearestHeaderTarget=x=>{
      const targets=headerTargets();
      if(!targets.length)return null;
      let best=null,bestD=Infinity;
      for(const el of targets){const r=el.getBoundingClientRect();const cx=r.left+r.width/2;const d=Math.abs(cx-x);if(d<bestD){bestD=d;best=el}}
      return best;
    };

    let pending='neutral',stableFrames=0,lastAction=0,lastAnnounced='neutral';
    hands.onResults(results=>{
      const h=results.multiHandLandmarks?.[0];
      if(!h){status.textContent='Mostre uma mão inteira para a câmera.';if(pointer)pointer.hidden=true;clearPointTarget();pending='neutral';stableFrames=0;return}

      const ext=[
        extendedFinger(h,5,6,7,8),
        extendedFinger(h,9,10,11,12),
        extendedFinger(h,13,14,15,16),
        extendedFinger(h,17,18,19,20)
      ];
      const curled=[curledFinger(h,6,8),curledFinger(h,10,12),curledFinger(h,14,16),curledFinger(h,18,20)];
      const indexOnly=ext[0] && curled.slice(1).filter(Boolean).length>=2;
      const openPalm=ext.filter(Boolean).length>=3;
      const palmWidth=dist(h[5],h[17])||.12;
      const compactTips=[8,12,16,20].filter(i=>dist(h[i],h[0])<palmWidth*2.35).length;
      const closedFist=(curled.filter(Boolean).length>=2 || compactTips>=3) && ext.filter(Boolean).length<=1 && !indexOnly;
      const gesture=indexOnly?'point':openPalm?'open':closedFist?'fist':'neutral';

      if(gesture===pending)stableFrames++;else{pending=gesture;stableFrames=1}

      if(gesture==='point'&&stableFrames>=2){
        const now=Date.now();
        // A posição horizontal do indicador seleciona a aba. O ponteiro encaixa na barra superior,
        // evitando que seja necessário manter o dedo exatamente no alto da imagem da câmera.
        const rawX=Math.max(0,Math.min(window.innerWidth-1,(1-h[8].x)*window.innerWidth));
        const target=nearestHeaderTarget(rawX);
        if(target){
          const r=target.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2;
          pointer.hidden=false;pointer.style.left=x+'px';pointer.style.top=y+'px';
          if(target!==pointTarget){clearPointTarget();pointTarget=target;pointTarget.classList.add('gesture-target');pointStarted=now;pointClicked=false}
          const elapsed=now-pointStarted,pct=Math.min(100,Math.round(elapsed/GESTURE_CLICK_MS*100));
          const label=(pointTarget.textContent||pointTarget.getAttribute('aria-label')||'aba').trim().replace(/\s+/g,' ');
          pointer.style.setProperty('--gesture-progress',pct+'%');
          status.textContent=`☝️ ${label}: mantenha por um instante para clicar (${pct}%).`;
          if(elapsed>=GESTURE_CLICK_MS&&!pointClicked){
            pointClicked=true;status.textContent=`✓ Clique em ${label}.`;
            const destination=pointTarget;
            setTimeout(()=>destination.click(),80);
          }
        }else{
          pointer.hidden=false;pointer.style.left=rawX+'px';pointer.style.top='46px';pointer.style.setProperty('--gesture-progress','0%');
          clearPointTarget();status.textContent='☝️ Mova o dedo para a esquerda ou direita até a aba ficar destacada.';
        }
        return;
      }

      if(pointer){pointer.hidden=true;pointer.style.setProperty('--gesture-progress','0%')}
      clearPointTarget();
      if(stableFrames<3){status.textContent='Reconhecendo o gesto…';return}

      if(gesture!==lastAnnounced){
        lastAnnounced=gesture;
        status.textContent=gesture==='open'?'✋ Mão aberta detectada — descendo.':gesture==='fist'?'✊ Mão fechada detectada — subindo.':'Abra a mão, feche o punho ou deixe apenas o indicador levantado.';
      }
      const now=Date.now();
      if(now-lastAction<850)return;
      const amount=Math.max(420,window.innerHeight*.68);
      if(gesture==='open'){
        window.scrollBy({top:amount,behavior:document.body.classList.contains('reduce-motion')?'auto':'smooth'});
        lastAction=now;status.textContent='✓ ✋ Mão aberta: página desceu.';
      }else if(gesture==='fist'){
        window.scrollBy({top:-amount,behavior:document.body.classList.contains('reduce-motion')?'auto':'smooth'});
        lastAction=now;status.textContent='✓ ✊ Mão fechada: página subiu.';
      }
    });
    const camera=new window.Camera(video,{onFrame:async()=>{if(video.readyState>=2)await hands.send({image:video})},width:640,height:480});
    await camera.start();
    box._gestureCleanup=()=>{clearPointTarget();pointer?.remove();try{camera.stop()}catch{}try{hands.close()}catch{}stream.getTracks().forEach(t=>t.stop());video.srcObject=null;document.body.classList.remove('gesture-mode-active')};
    status.textContent='● Câmera ativa. ✋ desce • ✊ sobe • ☝️ escolhe e clica nas abas.';
  }catch(error){pointer?.remove();clearPointTarget();console.error(error);status.textContent='Câmera não iniciou. Permita o uso da câmera e confirme que há internet para carregar o reconhecimento de mãos.'}
}


function copyText(text){if(navigator.clipboard?.writeText&&window.isSecureContext)return navigator.clipboard.writeText(text);const area=document.createElement('textarea');area.value=text;area.style.position='fixed';area.style.left='-9999px';document.body.appendChild(area);area.select();const ok=document.execCommand('copy');area.remove();return ok?Promise.resolve():Promise.reject(new Error('copy failed'))}
function setupShare(){$$('[data-share]').forEach(b=>b.addEventListener('click',async()=>{const url=location.href;try{if(navigator.share){await navigator.share({title:document.title,text:'Confira esta receita no Sabor & Cia!',url});toast('Compartilhamento aberto.');return}}catch(e){if(e?.name==='AbortError')return}try{await copyText(url);toast('Link da receita copiado!')}catch{toast('Não foi possível copiar automaticamente. Selecione o endereço da página e copie.')}}))}

function commentCard(c,form){const card=document.createElement('article');card.className='comment-card';card.innerHTML=`<div class="comment-head"><div class="comment-user"><div class="comment-avatar" aria-hidden="true">${escapeHtml(initials(c.name))}</div><div><strong>${escapeHtml(c.name)}</strong><small>${escapeHtml(c.date)}</small></div></div><div class="comment-rating" aria-label="${c.rating} de 5 estrelas">${'★'.repeat(c.rating||5)}${'☆'.repeat(5-(c.rating||5))}</div></div><button class="comment-text-button" type="button" data-comment-open aria-label="Abrir comentário de ${escapeAttr(c.name)}"><span class="comment-text">${escapeHtml(c.text)}</span><span class="comment-read-more">Clique para abrir o comentário →</span></button><div class="comment-actions"><button type="button" class="comment-action" data-like>♡ Curtir <span>${Number(c.likes||0)}</span></button><button type="button" class="comment-action" data-reply>↩ Responder</button>${c.owner?'<button type="button" class="comment-action" data-delete>Excluir</button>':''}</div>`;$('[data-comment-open]',card).onclick=()=>openCommentModal(c);$('[data-reply]',card).onclick=()=>{if(!requireAuth())return;const ta=$('textarea',form);if(ta){ta.value='@'+c.name+' ';ta.focus()}};$('[data-like]',card).onclick=async()=>{if(!requireAuth())return;try{const d=await api('/comments/'+c.id+'/like',{method:'POST'});$('[data-like] span',card).textContent=d.likes}catch(e){toast(e.message)}};$('[data-delete]',card)?.addEventListener('click',async()=>{if(!confirm('Excluir este comentário?'))return;try{await api('/comments/'+c.id,{method:'DELETE'});toast('Comentário excluído.');setupComments()}catch(e){toast(e.message)}});return card}
function openCommentModal(c){let modal=$('[data-comment-modal]');if(!modal){modal=document.createElement('div');modal.className='comment-modal';modal.dataset.commentModal='';modal.innerHTML='<div class="comment-modal-overlay" data-comment-close></div><div class="comment-modal-card" role="dialog" aria-modal="true"><button class="comment-modal-close" type="button" data-comment-close aria-label="Fechar">×</button><div class="comment-user"><div class="comment-avatar" data-modal-avatar></div><div><strong data-modal-author></strong><small data-modal-date></small></div></div><div class="comment-rating" data-modal-rating></div><h2>Comentário</h2><p class="comment-modal-text" data-modal-text></p><button class="btn btn-primary" type="button" data-comment-close>Fechar</button></div>';document.body.appendChild(modal);$$('[data-comment-close]',modal).forEach(x=>x.onclick=()=>{modal.classList.remove('open');modal.hidden=true})}$('[data-modal-avatar]',modal).textContent=initials(c.name);$('[data-modal-author]',modal).textContent=c.name;$('[data-modal-date]',modal).textContent=c.date;$('[data-modal-rating]',modal).textContent='★'.repeat(c.rating||5);$('[data-modal-text]',modal).textContent=c.text;modal.hidden=false;modal.classList.add('open')}
async function setupComments(){const form=$('[data-comment-form]'),list=$('[data-comments-list]');if(!form||!list)return;const key=form.dataset.recipe;const render=async()=>{try{const comments=await api('/recipes/'+encodeURIComponent(key)+'/comments');list.innerHTML='';comments.forEach(c=>list.appendChild(commentCard(c,form)));$('[data-comments-count]')?.replaceChildren(document.createTextNode('('+comments.length+')'))}catch(e){list.innerHTML='<div class="empty-state"><p>'+escapeHtml(e.message)+'</p></div>'}};await render();if(form.dataset.bound)return;form.dataset.bound='1';form.addEventListener('submit',async e=>{e.preventDefault();if(!requireAuth())return;const ta=$('textarea',form),text=ta?.value.trim()||'',rating=Number($('[name=rating]',form)?.value||0);if(rating<1||rating>5){toast('Escolha de 1 a 5 estrelas para avaliar a receita.');$('[data-star-rating]',form)?.scrollIntoView({behavior:'smooth',block:'center'});return}if(!text){toast('Escreva seu comentário antes de publicar.');ta?.focus();return}if(text.length>500){toast('O comentário deve ter no máximo 500 caracteres.');return}const btn=$('button[type=submit]',form);btn.disabled=true;try{await api('/recipes/'+encodeURIComponent(key)+'/comments',{method:'POST',body:JSON.stringify({text,rating,recipeTitle:form.dataset.recipeTitle||document.title})});ta.value='';toast('Comentário publicado! Ele já está na comunidade.');await render();window.dispatchEvent(new CustomEvent('sabor:comments-updated'))}catch(err){toast(err.message)}finally{btn.disabled=false}})}
async function setupCommunity(){const list=$('[data-community-comments]'),recipeList=$('[data-community-recipes]');if(list){try{const comments=await api('/community');list.innerHTML='';if(!comments.length)list.innerHTML='<div class="empty-state"><div>♡</div><h2>A comunidade está esperando sua primeira história.</h2><p>Faça um comentário em uma receita e ele aparecerá aqui.</p></div>';else comments.forEach(c=>{const item=document.createElement('article');item.className='community-comment';item.innerHTML=`<div class="post-user"><span class="avatar-sm">${escapeHtml(initials(c.name))}</span><div><strong>${escapeHtml(c.name)}</strong><small>${escapeHtml(c.date)} · comentou em ${escapeHtml(c.recipeTitle)}</small></div></div><div class="comment-rating" aria-label="${c.rating} de 5 estrelas">${'★'.repeat(c.rating)}${'☆'.repeat(5-c.rating)}</div><p>${escapeHtml(c.text)}</p><div class="post-actions"><span>♡ ${c.likes||0}</span><a href="receita.html?id=${encodeURIComponent(c.recipeId)}">Ver receita →</a></div>`;list.appendChild(item)})}catch(e){list.innerHTML='<div class="empty-state"><p><strong>O servidor do Sabor & Cia não está disponível.</strong><br>Abra <strong>INICIAR-SABOR-CIA.bat</strong>, espere aparecer “Sabor & Cia em http://localhost:3000” e depois atualize esta página.</p></div>'}}if(recipeList){try{const recipes=await api('/recipes');recipeList.innerHTML='';recipes.slice(0,12).forEach(r=>recipeList.appendChild(publishedRecipeCard(r)));if(!recipes.length)recipeList.innerHTML='<div class="empty-state"><h2>Ainda não há receitas autorais.</h2><p>Publique a sua para ela aparecer aqui.</p></div>'}catch{recipeList.innerHTML='<div class="empty-state"><p>As receitas da comunidade aparecerão aqui quando o servidor estiver ligado.</p></div>'}}}

function publishedRecipeCard(recipe){const key=recipe.key||recipe.id;const card=document.createElement('a');card.className='recipe-card';card.dataset.publishedId=key;card.dataset.minutes=recipe.minutes||0;card.dataset.category=norm((recipe.category||'')+' comunidade');card.dataset.difficulty=recipe.difficulty||'';card.dataset.type=recipe.type||'principal';card.dataset.status='publicada';card.dataset.ingredients=norm(recipe.ingredients||'');card.dataset.title=norm(recipe.title||'');card.href=`receita.html?id=${encodeURIComponent(key)}`;const image=recipe.cover||recipe.image||'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=88';card.innerHTML=`<div class="recipe-image"><img loading="lazy" src="${escapeAttr(image)}" alt="${escapeAttr(recipe.title)}"><button type="button" class="heart" data-favorite data-recipe="${escapeAttr(key)}" aria-label="Salvar ${escapeAttr(recipe.title)}" aria-pressed="false">♡</button><span class="tag">COMUNIDADE</span></div><div class="recipe-body"><div class="rating">★★★★★ <span>nova</span></div><h3>${escapeHtml(recipe.title)}</h3><p>${escapeHtml(recipe.description||'Receita compartilhada pela comunidade.')}</p><div class="recipe-meta"><span>◷ ${recipe.minutes||''} min</span><span>● ${escapeHtml(recipe.difficulty||'')}</span></div>${recipe.author?`<small class="recipe-author">Por ${escapeHtml(recipe.author)}</small>`:''}</div>`;return card}

async function setupFavorites(){
  const buttons=$$('[data-favorite]');
  for(const button of buttons){
    const key=button.dataset.recipe||button.dataset.publishedId;if(!key)continue;
    const update=saved=>{button.classList.toggle('saved',saved);button.textContent=saved?'♥':'♡';button.setAttribute('aria-label',saved?'Remover dos favoritos':'Salvar nos favoritos');button.setAttribute('aria-pressed',String(saved));button.title=saved?'Remover dos favoritos':'Salvar nos favoritos'};
    if(authUser()){try{update((await api('/favorites/'+encodeURIComponent(key))).saved)}catch{update(false)}}else update(false);
    button.onclick=async e=>{e.preventDefault();e.stopPropagation();if(!requireAuth())return;const saved=button.classList.contains('saved');try{const d=await api('/favorites/'+encodeURIComponent(key),{method:saved?'DELETE':'POST'});update(d.saved);toast(d.saved?'Receita adicionada aos seus favoritos.':'Receita removida dos seus favoritos.');await updateFavoriteCounters();window.dispatchEvent(new CustomEvent('sabor:favorites-updated'))}catch(err){toast(err.message)}}
  }
  const page=$('[data-favorites-list]');
  if(page){if(!requireAuth())return;try{const items=await api('/favorites');page.innerHTML='';if(!items.length)page.innerHTML='<div class="empty-state"><div>♡</div><h2>Você ainda não tem favoritos.</h2><p>Toque no coração de uma receita para guardá-la só na sua conta.</p><a class="btn btn-primary" href="receitas.html">Explorar receitas</a></div>';else items.forEach(r=>{const card=publishedRecipeCard({key:r.key,title:r.title,description:'Receita salva por você.',minutes:'',difficulty:'',cover:r.image||r.cover});page.appendChild(card)});setupFavoritesOnDynamicCards();await updateFavoriteCounters()}catch(e){page.innerHTML='<div class="empty-state"><h2>Não foi possível carregar seus favoritos.</h2><p>'+escapeHtml(e.message)+'</p></div>'}}
}
function setupFavoritesOnDynamicCards(){const buttons=$$('[data-favorite]');buttons.forEach(button=>{if(button.dataset.favoriteBound)return;button.dataset.favoriteBound='1';const key=button.dataset.recipe;if(!key)return;button.onclick=async e=>{e.preventDefault();e.stopPropagation();if(!requireAuth())return;const saved=button.classList.contains('saved');try{const d=await api('/favorites/'+encodeURIComponent(key),{method:saved?'DELETE':'POST'});button.classList.toggle('saved',d.saved);button.textContent=d.saved?'♥':'♡';button.setAttribute('aria-pressed',String(d.saved));toast(d.saved?'Receita adicionada aos seus favoritos.':'Receita removida dos favoritos.');await updateFavoriteCounters()}catch(err){toast(err.message)}}})}
async function updateFavoriteCounters(){const user=authUser();if(!user)return;try{const items=await api('/favorites');$$('[data-profile-favorite-count]').forEach(x=>x.textContent=String(items.length));$$('[data-header-favorite-count]').forEach(x=>x.textContent=String(items.length))}catch{}}


const PUBLISHED_KEY='sabor-published-recipes-v1';
function compressImage(file,maxWidth=1200,quality=.78){return new Promise((resolve,reject)=>{if(!file||!file.type.startsWith('image/'))return reject(new Error('Arquivo não é uma imagem.'));const reader=new FileReader();reader.onerror=()=>reject(new Error('Não foi possível ler a imagem.'));reader.onload=()=>{const img=new Image();img.onload=()=>{const scale=Math.min(1,maxWidth/img.width),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.width*scale));canvas.height=Math.max(1,Math.round(img.height*scale));const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0,canvas.width,canvas.height);resolve(canvas.toDataURL('image/jpeg',quality))};img.onerror=()=>reject(new Error('Imagem inválida.'));img.src=reader.result};reader.readAsDataURL(file)})}
function readFileDataUrl(file){return new Promise((resolve,reject)=>{if(!file)return resolve('');const reader=new FileReader();reader.onerror=()=>reject(new Error('Não foi possível ler o arquivo.'));reader.onload=()=>resolve(String(reader.result||''));reader.readAsDataURL(file)})}
async function setupPublish(){
  const form=$('[data-publish-form]'); if(!form)return; if(!requireAuth())return;
  const photoInput=$('[data-recipe-photo]',form),galleryInput=$('[data-recipe-gallery]',form),videoInput=$('[data-recipe-video]',form),preview=$('[data-photo-preview]',form),galleryPreview=$('[data-gallery-preview]',form),videoPreview=$('[data-video-preview]',form);
  const render=async()=>{
    if(preview){preview.innerHTML='';if(photoInput?.files?.[0]){try{const img=document.createElement('img');img.src=await compressImage(photoInput.files[0],900,.72);img.alt='Pré-visualização da foto principal';preview.appendChild(img)}catch{}}}
    if(galleryPreview){galleryPreview.innerHTML='';for(const file of [...(galleryInput?.files||[])].slice(0,4)){try{const img=document.createElement('img');img.src=await compressImage(file,600,.7);img.alt='Pré-visualização';galleryPreview.appendChild(img)}catch{}}}
    if(videoPreview){videoPreview.innerHTML='';const f=videoInput?.files?.[0];if(f){const url=URL.createObjectURL(f);const v=document.createElement('video');v.controls=true;v.muted=true;v.playsInline=true;v.src=url;v.setAttribute('aria-label','Pré-visualização do vídeo');videoPreview.appendChild(v);}}
  };
  photoInput?.addEventListener('change',render);galleryInput?.addEventListener('change',render);videoInput?.addEventListener('change',render);
  form.addEventListener('submit',async e=>{
    e.preventDefault(); if(!requireAuth())return; if(!form.checkValidity()){form.reportValidity();return}
    const fd=new FormData(form),btn=$('button[type=submit]',form);btn.disabled=true;
    try{
      const cover=await compressImage(photoInput.files[0],1200,.78),gallery=[];
      for(const f of [...galleryInput.files].slice(0,4))gallery.push(await compressImage(f,900,.72));
      let video=String(fd.get('videoUrl')||'').trim();
      if(videoInput?.files?.[0]){const f=videoInput.files[0];if(f.size>3.5*1024*1024)throw new Error('O vídeo precisa ter no máximo 3,5 MB.');if(!['video/mp4','video/webm'].includes(f.type))throw new Error('Envie um vídeo MP4 ou WebM.');video=await readFileDataUrl(f)}
      const data=await api('/recipes',{method:'POST',body:JSON.stringify({title:fd.get('title'),category:fd.get('category'),minutes:fd.get('minutes'),servings:fd.get('servings'),difficulty:fd.get('difficulty'),type:fd.get('type'),description:fd.get('description'),ingredients:fd.get('ingredients'),preparation:fd.get('preparation'),cover,gallery,video})});
      toast('Receita enviada! Ela está aguardando a análise da equipe.'); form.reset(); if(preview)preview.innerHTML='';if(galleryPreview)galleryPreview.innerHTML='';if(videoPreview)videoPreview.innerHTML='';
      await renderMyRecipes(); window.scrollTo({top:document.body.scrollHeight,behavior:'smooth'});
    }catch(err){toast(err.message)}finally{btn.disabled=false}
  });
  await renderMyRecipes()
}
async function renderMyRecipes(){
  const list=$('[data-my-recipes]');if(!list||!authUser())return;
  try{
    const recipes=await api('/recipes/mine');$('[data-my-recipes-count]')?.replaceChildren(document.createTextNode(String(recipes.length)));$('[data-profile-recipe-count]')?.replaceChildren(document.createTextNode(String(recipes.length)));list.innerHTML='';
    if(!recipes.length){list.innerHTML='<div class="empty-state"><div>＋</div><h2>Você ainda não enviou uma receita.</h2><p>Compartilhe aquele bolo diferente ou a receita da família. Primeiro a equipe confere, depois ela aparece no site.</p></div>';return}
    recipes.forEach(r=>{const item=document.createElement('article');item.className='my-recipe-item';const status=r.status==='aprovada'?'APROVADA':r.status==='rejeitada'?'PRECISA DE AJUSTES':'AGUARDANDO ANÁLISE';const cls=r.status==='aprovada'?'approved':r.status==='rejeitada'?'rejected':'pending';const action=r.status==='aprovada'?`<a class="text-link" href="receita.html?id=${encodeURIComponent(r.key)}">Abrir receita →</a>`:`<span class="moderation-status ${cls}">${status}</span>`;item.innerHTML=`<img src="${escapeAttr(r.cover||'')}" alt="${escapeAttr(r.title)}"><div><span class="eyebrow">MINHA RECEITA</span><h3>${escapeHtml(r.title)}</h3><p>${escapeHtml(r.description||'Receita enviada por você.')}</p>${r.status==='rejeitada'&&r.rejectionReason?`<p class="rejection-reason"><strong>Observação:</strong> ${escapeHtml(r.rejectionReason)}</p>`:''}${action}</div>`;list.appendChild(item)})
  }catch(e){list.innerHTML='<div class="empty-state"><p>'+escapeHtml(e.message)+'</p></div>'}
}
async function setupPublishedRecipeDetail(){
  const main=$('.recipe-detail');if(!main)return;
  const requested=new URLSearchParams(location.search).get('id')||'risoto-cremoso-de-cogumelos';
  try{
    const remote=await api('/recipes/'+encodeURIComponent(requested));
    if(remote.builtIn){const found=getBuiltinRecipe(requested);if(found.recipe){renderBuiltinRecipe(found.key,found.recipe);return}}
    if(remote.builtIn)return;
    const recipe=remote;document.title=recipe.title+' — Sabor & Cia';const gallery=(recipe.gallery||[]).filter(Boolean);
    main.innerHTML=`<div class="breadcrumb"><a href="receitas.html">Receitas</a><span>/</span><span>Receita da comunidade</span></div><section class="detail-hero"><div class="detail-photo"><img alt="${escapeAttr(recipe.title)}" src="${escapeAttr(recipe.cover)}"></div><div class="detail-intro"><span class="eyebrow">RECEITA DA COMUNIDADE</span><h1>${escapeHtml(recipe.title)}</h1><p class="lead">${escapeHtml(recipe.description||'Receita compartilhada pela comunidade.')}</p><div class="author"><span class="author-avatar">${escapeHtml(initials(recipe.author))}</span><div><strong>${escapeHtml(recipe.author)}</strong><small>Compartilhada pela comunidade</small></div></div><div class="detail-actions"><button class="btn btn-primary" data-favorite data-recipe="${escapeAttr(recipe.key)}" type="button">♡</button><button class="outline-btn" data-share type="button">↗ Compartilhar receita</button></div></div></section><section class="detail-info"><div><span>◷</span><strong>${recipe.minutes} min</strong><small>tempo total</small></div><div><span>●</span><strong>${escapeHtml(recipe.difficulty)}</strong><small>dificuldade</small></div><div><span>♨</span><strong>${escapeHtml(recipe.servings||'—')} porções</strong><small>rendimento</small></div><div><span>♡</span><strong>comunidade</strong><small>receita publicada</small></div></section>${gallery.length?`<section class="recipe-gallery"><span class="eyebrow">FOTOS DA RECEITA</span><h2>Feita por <em>${escapeHtml(recipe.author)}</em></h2><div class="recipe-gallery-grid">${gallery.map((src,i)=>`<img src="${escapeAttr(src)}" alt="Foto ${i+1} de ${escapeAttr(recipe.title)}" loading="lazy">`).join('')}</div></section>`:''}<section class="cook-layout"><div class="ingredients"><span class="eyebrow">PARA COMEÇAR</span><h2>Ingredientes</h2>${String(recipe.ingredients||'').split(/\n+/).map(x=>x.trim()).filter(Boolean).map(x=>`<label class="check"><input type="checkbox"><span>${escapeHtml(x)}</span></label>`).join('')}<div class="timer-box live-recipe-timer" data-recipe-live-timer data-recipe-seconds="${Math.max(0,Number(recipe.minutes||0))*60}"><span class="eyebrow">TIMER DA RECEITA</span><strong data-live-timer-display>${String(Math.max(0,Number(recipe.minutes||0))).padStart(2,'0')}:00</strong><small data-live-timer-label>Tempo da receita: ${Math.max(0,Number(recipe.minutes||0))} minutos.</small><div><button class="btn btn-primary btn-small" data-live-timer-start type="button">Iniciar</button></div></div></div><div class="steps"><div class="steps-head"><div><span class="eyebrow">AGORA, MÃO NA MASSA</span><h2>Modo de preparo</h2></div><div aria-label="Progresso" class="progress"><span style="width:0%"></span></div></div>${String(recipe.preparation||'').split(/\n+/).map(x=>x.trim()).filter(Boolean).map((x,i)=>`<article class="step"><span>${String(i+1).padStart(2,'0')}</span><div><h3>Etapa ${i+1}</h3><p>${escapeHtml(x)}</p><button class="step-done" type="button">✓ Concluir etapa</button></div></article>`).join('')}</div></section><section class="comment-box"><span class="eyebrow">CONTA PRA GENTE</span><h2>Você fez? <em>Conta como ficou.</em></h2><p>Seu comentário fica nesta receita e também aparece na comunidade.</p><form data-comment-form data-recipe="${escapeAttr(recipe.key)}" data-recipe-title="${escapeAttr(recipe.title)}"><fieldset class="star-rating" data-star-rating><legend>Sua avaliação</legend><input type="hidden" name="rating" value="0"><div class="star-rating-buttons" role="radiogroup" aria-label="Sua avaliação"><button type="button" data-star-value="1" aria-label="1 estrela">★</button><button type="button" data-star-value="2" aria-label="2 estrelas">★</button><button type="button" data-star-value="3" aria-label="3 estrelas">★</button><button type="button" data-star-value="4" aria-label="4 estrelas">★</button><button type="button" data-star-value="5" aria-label="5 estrelas">★</button></div></fieldset><label for="comment-text">Seu comentário</label><textarea id="comment-text" maxlength="500" placeholder="Escreva sua experiência com essa receita..." required></textarea><div class="comment-form-footer"><small>Até 500 caracteres.</small><button class="btn btn-primary" type="submit">Publicar comentário</button></div></form></section><section class="recipe-comments"><span class="eyebrow">O QUE A COMUNIDADE DISSE</span><h2>Comentários de quem <em>já fez.</em> <span data-comments-count>(0)</span></h2><div class="comments-list" data-comments-list aria-live="polite"></div></section>`;
  }catch(e){console.warn(e.message)}
}

async function setupRemoteRecipes(){const grid=$('[data-recipe-grid]');if(!grid)return;try{const recipes=await api('/recipes');recipes.forEach(r=>{if(!$('.recipe-card[data-published-id="'+CSS.escape(r.key)+'"]',grid))grid.appendChild(publishedRecipeCard(r))});setupRecipeCardNavigation();$('[data-recipe-search]')?.dispatchEvent(new Event('input'))}catch{}}
function setupRecipeCardNavigation(){
  $$('.recipe-card').forEach(card=>{
    if(card.dataset.cardNavigation||card.classList.contains('recipe-placeholder'))return;card.dataset.cardNavigation='1';
    const key=card.dataset.recipe||card.querySelector('[data-favorite]')?.dataset.recipe||card.dataset.publishedId;if(!key)return;
    const base=location.pathname.includes('/pages/')?'receita.html':'pages/receita.html',url=base+'?id='+encodeURIComponent(key);
    card.dataset.recipe=key;
    if(card.matches('a')){card.setAttribute('href',url);return}
    card.setAttribute('tabindex','0');card.setAttribute('role','link');card.style.cursor='pointer';
    const open=()=>location.href=url;
    card.addEventListener('click',e=>{if(e.target.closest('button,a,input,select,textarea'))return;open()});
    card.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&!e.target.closest('button')){e.preventDefault();open()}});
  });
}

function setupFilters(){
  const grid=$('[data-recipe-grid]');if(!grid)return;
  const getCards=()=>$$('.recipe-card',grid).filter(x=>!x.classList.contains('recipe-placeholder')),category=$('[data-filter="category"]'),time=$('[data-filter="time"]'),difficulty=$('[data-filter="difficulty"]'),type=$('[data-filter="type"]'),status=$('[data-filter="status"]'),search=$('[data-recipe-search]'),summary=$('[data-filter-summary]'),empty=$('[data-no-results]');
  const params=new URLSearchParams(location.search);
  if(params.get('q')&&search)search.value=params.get('q');
  if(params.get('ingredientes')&&search)search.value=params.get('ingredientes').split(',').join(' ');
  if(params.get('categoria')&&category)category.value=norm(params.get('categoria'));
  const apply=async()=>{
    let favs=new Set();if(authUser()){try{favs=new Set((await api('/favorites')).map(x=>x.key))}catch{}}
    const c=norm(category?.value||'todas'),max=Number(time?.value||0),d=norm(difficulty?.value||'todas'),t=norm(type?.value||'todos'),st=norm(status?.value||'todos'),q=norm(search?.value||''),tokens=q.split(/\s+/).filter(Boolean);
    let n=0;
    getCards().forEach(card=>{
      const x=card.dataset,cats=norm(x.category).split(/\s+/),mins=Number(x.minutes||0),title=norm(x.title||$('h3',card)?.textContent),ing=norm(x.ingredients||''),desc=norm($('p',card)?.textContent||''),key=x.recipe||x.publishedId||card.querySelector('[data-favorite]')?.dataset.recipe||'';
      const haystack=[title,ing,desc,cats.join(' '),norm(x.type),norm(x.difficulty)].join(' ');
      const categoryOk=c==='todas'||(c==='favoritos'&&favs.has(key))||(c!=='favoritos'&&cats.includes(c))||(c==='rapidas'&&mins<=30);
      const queryOk=!tokens.length||tokens.every(token=>haystack.includes(token));
      const ok=categoryOk&&(!max||mins<=max)&&(d==='todas'||norm(x.difficulty)===d)&&(t==='todos'||norm(x.type)===t)&&(st==='todos'||norm(x.status||'exemplo')===st)&&queryOk;
      card.hidden=!ok;card.style.display=ok?'':'none';if(ok)n++;
    });
    if(summary)summary.textContent=`${n} ${n===1?'receita encontrada':'receitas encontradas'}`;
    empty?.classList.toggle('show',n===0);
  };
  [category,time,difficulty,type,status].filter(Boolean).forEach(x=>x.addEventListener('change',apply));search?.addEventListener('input',apply);
  $('[data-filter-reset]')?.addEventListener('click',()=>{[category,time,difficulty,type,status].filter(Boolean).forEach(x=>x.selectedIndex=0);if(search)search.value='';history.replaceState({},'',location.pathname);apply()});
  $('[data-kids-filter]')?.addEventListener('click',()=>{if(category){category.value='infantis';apply();history.replaceState({},'',location.pathname+'?categoria=infantis');document.querySelector('.catalog-grid')?.scrollIntoView({behavior:document.body.classList.contains('reduce-motion')?'auto':'smooth',block:'start'});}});apply();
}

// Mantém a foto principal em alta resolução, mas pede uma cópia menor no card.
// Isso deixa celular e tablet mais rápidos sem mudar o visual do site.
function recipeImageForCard(url,width=1100){
  const value=String(url||'');
  if(!value)return '';
  if(/images\.unsplash\.com/.test(value)){
    if(/[?&]w=\d+/.test(value))return value.replace(/([?&])w=\d+/,`$1w=${width}`);
    return value+(value.includes('?')?'&':'?')+`w=${width}`;
  }
  return value;
}

function builtinRecipeCard(key,recipe){
  const card=document.createElement('a');const isKids=(recipe.categories||[]).includes('infantis')||recipe.kids===true;card.className='recipe-card'+(isKids?' kids-card':'');card.dataset.recipe=key;card.dataset.minutes=String(recipe.minutes||0);card.dataset.category=(recipe.categories||[]).join(' ');card.dataset.difficulty=recipe.difficulty||'';card.dataset.type=recipe.type||'principal';card.dataset.status='exemplo';card.dataset.ingredients=norm((recipe.ingredients||[]).map(x=>x.i).join(' '));card.dataset.title=norm(recipe.title||'');card.href=`receita.html?id=${encodeURIComponent(key)}`;
  const tag=isKids?'KIDS 🌈':((recipe.categories||[]).includes('rapidas')?`${recipe.minutes} MIN`:String(recipe.category||'RECEITA').toUpperCase());
  card.innerHTML=`<div class="recipe-image no-photo">${recipe.image?`<img alt="${escapeAttr(recipe.title)}" loading="lazy" src="${escapeAttr(recipeImageForCard(recipe.image))}">`:recipePlaceholderMarkup(recipe)}<span class="tag">${escapeHtml(tag)}</span><button aria-label="Salvar ${escapeAttr(recipe.title)}" class="heart" data-favorite data-recipe="${escapeAttr(key)}" type="button">♡</button></div><div class="recipe-body"><div class="rating">★★★★★ <span>${escapeHtml(recipe.rating||'4,8')}</span></div><h3>${escapeHtml(recipe.title)}</h3><p>${escapeHtml(recipe.description||'Receita completa do Sabor & Cia.')}</p><div class="recipe-meta"><span>◷ ${Number(recipe.minutes||0)} min</span><span>● ${escapeHtml(recipe.difficulty||'Fácil')}</span><span>♨ ${Number(recipe.servings||0)} porções</span></div></div>`;
  return card;
}

function setupRecipePlaceholders(){
  // Monta o catálogo fixo a partir da base oficial: 190 receitas gerais + 10 infantis.
  // Assim não há cards duplicados, vazios ou dependentes de fotos externas.
  const grid=$('[data-recipe-grid]');if(!grid)return;
  const builtins=window.SABOR_BUILTIN_RECIPES||{};
  grid.innerHTML='';
  Object.entries(builtins).forEach(([key,recipe])=>grid.appendChild(builtinRecipeCard(key,recipe)));
}

function setupRecipeSteps(){const steps=$$('.step-done');if(!steps.length)return;const progress=$('.progress span'),update=()=>{if(progress)progress.style.width=(steps.filter(x=>x.classList.contains('done')).length/steps.length*100)+'%'};steps.forEach((b,i)=>b.onclick=()=>{b.classList.toggle('done');b.textContent=b.classList.contains('done')?'✓ Etapa concluída':'✓ Concluir etapa';toast(`Etapa ${i+1} ${b.classList.contains('done')?'concluída':'reaberta'}.`);update()});update()}
let activeReelOpener=null;
function ensureReelViewer(){
  let modal=$('[data-reel-viewer]');
  if(modal)return modal;
  modal=document.createElement('div');
  modal.className='reel-viewer';
  modal.dataset.reelViewer='';
  modal.hidden=true;
  modal.innerHTML='<div class="reel-viewer-backdrop" data-reel-viewer-close></div><div class="reel-viewer-card" role="dialog" aria-modal="true" aria-labelledby="reel-viewer-title"><div class="reel-viewer-head"><div><strong id="reel-viewer-title" data-reel-viewer-title>Vídeo da receita</strong><small>Você continua dentro do Sabor & Cia</small></div><button class="reel-viewer-close" type="button" data-reel-viewer-close aria-label="Fechar vídeo">×</button></div><div class="reel-viewer-player"><iframe data-reel-viewer-frame title="Vídeo da receita" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div></div>';
  document.body.appendChild(modal);
  $$('[data-reel-viewer-close]',modal).forEach(btn=>btn.addEventListener('click',closeReelViewer));
  return modal;
}
function openReelViewer(id,title,format='video',opener=null){
  if(!id)return;
  const modal=ensureReelViewer(),card=$('.reel-viewer-card',modal),frame=$('[data-reel-viewer-frame]',modal);
  activeReelOpener=opener||document.activeElement;
  card.classList.toggle('short',format==='short');
  $('[data-reel-viewer-title]',modal).textContent=title||'Vídeo da receita';
  frame.title=title||'Vídeo da receita';
  frame.src=`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&playsinline=1&modestbranding=1`;
  modal.hidden=false;modal.classList.add('open');document.body.classList.add('reel-modal-open');
  $('.reel-viewer-close',modal)?.focus();
}
function closeReelViewer(){
  const modal=$('[data-reel-viewer]');if(!modal)return;
  const frame=$('[data-reel-viewer-frame]',modal);if(frame)frame.src='about:blank';
  modal.classList.remove('open');modal.hidden=true;document.body.classList.remove('reel-modal-open');
  if(activeReelOpener&&document.contains(activeReelOpener))activeReelOpener.focus();activeReelOpener=null;
}
function setupReels(){
  $$('[data-reel]').forEach(card=>{const video=$('video',card),b=$('[data-reel-play],.reel-play',card);if(!video||!b)return;b.onclick=e=>{e.preventDefault();e.stopPropagation();if(video.paused)video.play().then(()=>b.textContent='❚❚').catch(()=>toast('Não foi possível reproduzir este reel.'));else{video.pause();b.textContent='▶'}};video.onplay=()=>b.textContent='❚❚';video.onpause=()=>b.textContent='▶';video.onerror=()=>{$('.reel-error',card)?.remove();const m=document.createElement('small');m.className='reel-error';m.textContent='Coloque o arquivo indicado neste espaço.';card.appendChild(m)}});
  $$('[data-youtube-id]').forEach(card=>{if(card.dataset.reelBound)return;card.dataset.reelBound='1';card.addEventListener('click',e=>{e.preventDefault();openReelViewer(card.dataset.youtubeId,card.dataset.reelTitle||$('strong',card)?.textContent||'Vídeo da receita',card.dataset.reelFormat||'video',card)})});
}
function setupCapacitySlots(){
  // Os espaços de Reels continuam separados do catálogo de 200 receitas.
  const reels=$$('[data-reel-slot]');
  reels.forEach(card=>{
    const num=card.dataset.reelSlot;
    const video=$('video',card);
    if(video) return;
    card.setAttribute('aria-label',`Espaço reservado para o Reel ${num}`);
  });
}

function setupTimer(){const box=$('[data-timer]');if(!box)return;let seconds=Number(box.dataset.seconds||0),remaining=seconds,timer=null;const display=$('[data-timer-display]',box),start=$('[data-timer-start]',box),render=()=>display.textContent=String(Math.floor(remaining/60)).padStart(2,'0')+':'+String(remaining%60).padStart(2,'0');if(start)start.onclick=()=>{if(timer)return;if(remaining<=0)remaining=seconds;start.textContent='Em andamento…';timer=setInterval(()=>{remaining--;render();if(remaining<=0){clearInterval(timer);timer=null;start.textContent='Iniciar novamente';toast('Timer finalizado!')}},1000)};render()}
function updateAccountUI(){
  const user=authUser();
  $$('[data-account-name]').forEach(x=>x.textContent=user?.name||'Sua conta');
  $$('[data-account-initials]').forEach(x=>x.textContent=initials(user?.name));
  $$('[data-account-only]').forEach(x=>x.hidden=!user);

  $$('[data-login-link]').forEach(x=>{
    if(user){x.hidden=true}else{x.hidden=false;x.textContent='Entrar';x.href=location.pathname.includes('/pages/')?'login.html':'pages/login.html'}
  });
  $$('[data-register-link]').forEach(x=>{
    x.hidden=false;
    if(user){x.textContent=user.name;x.href=location.pathname.includes('/pages/')?'perfil.html':'pages/perfil.html';x.classList.add('account-user-pill');x.setAttribute('aria-label','Abrir perfil de '+user.name)}
    else{x.textContent='Criar conta';x.href=location.pathname.includes('/pages/')?'cadastro.html':'pages/cadastro.html';x.classList.remove('account-user-pill');x.removeAttribute('aria-label')}
  });

  const actions=$('.header-actions');
  if(actions){
    const menu=$('[data-menu]',actions);
    let fav=$('[data-header-favorites]',actions);
    if(user&&!fav){fav=document.createElement('a');fav.className='header-favorites';fav.dataset.headerFavorites='';fav.href=location.pathname.includes('/pages/')?'favoritos.html':'pages/favoritos.html';fav.innerHTML='♥ <span data-header-favorite-count>0</span>';fav.setAttribute('aria-label','Meus favoritos');actions.insertBefore(fav,menu||null)}
    if(!user&&fav)fav.remove();
    let logout=$('[data-auth-logout]',actions);
    if(user&&!logout){logout=document.createElement('button');logout.type='button';logout.className='outline-btn header-logout';logout.dataset.authLogout='';logout.textContent='Sair';logout.addEventListener('click',()=>{clearAuth();toast('Você saiu da sua conta.');setTimeout(()=>location.href=location.pathname.includes('/pages/')?'login.html':'pages/login.html',250)});actions.insertBefore(logout,menu||null)}
    if(!user&&logout)logout.remove();
  }
  updateFavoriteCounters();
}

function repairBrandPaths(){const prefix=location.pathname.includes('/pages/')?'../':'';$$('.brand-logo').forEach(img=>{const wanted=prefix+'assets/brand/sabor-cia-mark.svg';if(!img.getAttribute('src')?.endsWith(wanted))img.setAttribute('src',wanted)})}
function setupRepresentatives(){const footer=$('[data-site-footer]');if(!footer||$('.footer-representatives',footer))return;const row=document.createElement('div');row.className='footer-representatives';row.innerHTML='<strong>Representantes:</strong> <span>Ana Letícia</span><span>Letícia da Silva</span><span>Kaio Requena</span><span>Mayara Macedo</span>';footer.appendChild(row)}

const I18N={
  en:{'Início':'Home','Receitas':'Recipes','Comunidade':'Community','Vídeos':'Videos','Livros':'Books','Publicar receita':'Publish recipe','Favoritos':'Favorites','Acessibilidade':'Accessibility','Sobre':'About','Entrar':'Sign in','Criar conta':'Create account','Explorar':'Explore','Sobre nós':'About us','Contato':'Contact','Privacidade':'Privacy','Termos de uso':'Terms of use','Sua conta':'Your account','Perfil':'Profile','Buscar':'Search','Ver todas':'View all','Ver todos os livros →':'View all books →','Encontrar receitas →':'Find recipes →','Receitas para viver bem':'Recipes for living well','RECEITAS PARA VIVER BEM':'RECIPES FOR LIVING WELL','Comida boa tem':'Good food has','história.':'a story.','Conte a sua.':'Tell yours.','Nome':'Name','Senha':'Password','Confirmar senha':'Confirm password','Criar minha conta':'Create my account','Já tem uma conta?':'Already have an account?','Ainda não tem conta?':'No account yet?','Representantes:':'Representatives:','Projeto acadêmico.':'Academic project.','Nome da receita':'Recipe name','Irá colocar descrição':'Description will go here'},
  es:{'Início':'Inicio','Receitas':'Recetas','Comunidade':'Comunidad','Vídeos':'Videos','Livros':'Libros','Publicar receita':'Publicar receta','Favoritos':'Favoritos','Acessibilidade':'Accesibilidad','Sobre':'Acerca de','Entrar':'Entrar','Criar conta':'Crear cuenta','Explorar':'Explorar','Sobre nós':'Sobre nosotros','Contato':'Contacto','Privacidade':'Privacidad','Termos de uso':'Términos de uso','Sua conta':'Tu cuenta','Perfil':'Perfil','Buscar':'Buscar','Ver todas':'Ver todas','Ver todos os livros →':'Ver todos los libros →','Encontrar receitas →':'Encontrar recetas →','RECEITAS PARA VIVER BEM':'RECETAS PARA VIVIR BIEN','Nome':'Nombre','Senha':'Contraseña','Confirmar senha':'Confirmar contraseña','Criar minha conta':'Crear mi cuenta','Já tem uma conta?':'¿Ya tienes una cuenta?','Ainda não tem conta?':'¿Aún no tienes cuenta?','Representantes:':'Representantes:','Projeto acadêmico.':'Proyecto académico.','Nome da receita':'Nombre de la receta','Irá colocar descrição':'Aquí irá la descripción'}
};
function setGoogleTranslateCookie(lang){
  const value=lang==='pt'?'':`/pt/${lang}`;
  const expires=lang==='pt'?'; expires=Thu, 01 Jan 1970 00:00:00 GMT':'';
  document.cookie=`googtrans=${value}; path=/${expires}`;
  document.cookie=`googtrans=${value}; path=/; domain=${location.hostname}${expires}`;
}
function loadFullPageTranslator(lang){
  if(lang==='pt')return;
  let host=document.getElementById('google_translate_element');
  if(!host){host=document.createElement('div');host.id='google_translate_element';host.hidden=true;document.body.appendChild(host)}
  window.googleTranslateElementInit=()=>{try{if(!host.dataset.ready){host.dataset.ready='1';new google.translate.TranslateElement({pageLanguage:'pt',includedLanguages:'en,es',autoDisplay:false},'google_translate_element')}}catch(e){console.warn('Tradutor:',e)}};
  if(window.google?.translate?.TranslateElement){window.googleTranslateElementInit();return}
  if(!document.querySelector('script[data-full-google-translate]')){const script=document.createElement('script');script.dataset.fullGoogleTranslate='1';script.src='https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';script.async=true;document.head.appendChild(script)}
}
function setupLanguage(){
  const actions=$('.header-actions');if(!actions)return;
  let select=$('[data-language-select]',actions);
  if(!select){select=document.createElement('select');select.className='language-select';select.dataset.languageSelect='';select.setAttribute('aria-label','Idioma do site');select.title='Idioma';select.innerHTML='<option value="pt">🌐 PT</option><option value="en">🌐 EN</option><option value="es">🌐 ES</option>';actions.insertBefore(select,actions.firstChild)}
  const saved=localStorage.getItem('sabor-language-v1')||'pt';
  select.value=saved;const accessSelect=$('[data-access-language]');if(accessSelect)accessSelect.value=saved;
  document.documentElement.lang=saved==='pt'?'pt-BR':saved;
  const changeLanguage=lang=>{if(!['pt','en','es'].includes(lang))lang='pt';localStorage.setItem('sabor-language-v1',lang);setGoogleTranslateCookie(lang);location.reload()};
  select.addEventListener('change',()=>changeLanguage(select.value));
  if(accessSelect)accessSelect.onchange=e=>changeLanguage(e.target.value);
  if(saved!=='pt'){setGoogleTranslateCookie(saved);loadFullPageTranslator(saved)}else setGoogleTranslateCookie('pt');
}

async function refreshLoggedUser(){return authUser();}
function pageName(){const p=location.pathname.split('/').filter(Boolean).pop();return p||'index.html'}
function authGateTarget(){return readStore(LOCAL_USERS_KEY,[]).length?'login.html':'cadastro.html'}
async function setupAuth(){
  const page=pageName();
  const existingUser=authUser();
  // Navegação pública: ninguém é forçado a cadastrar ou entrar para usar o site.
  // Login continua sendo pedido apenas nas ações pessoais (favoritar, comentar e publicar).
  $$('[data-auth-required]').forEach(a=>{if(!existingUser)a.onclick=e=>{e.preventDefault();goLogin('Crie sua conta ou entre para usar esta área.')}});

  const register=$('[data-register-form]');
  if(register){
    const status=$('[data-register-status]',register);
    const setStatus=(message,kind='info')=>{if(status){status.textContent=message;status.dataset.state=kind}};
    setStatus('Cadastro pronto. Nesta versão os dados ficam salvos neste navegador, sem MySQL.','success');
    const registerMsg=sessionStorage.getItem('sabor-register-message');if(registerMsg){toast(registerMsg);sessionStorage.removeItem('sabor-register-message')}
    register.addEventListener('submit',async e=>{
      e.preventDefault();if(!register.checkValidity()){register.reportValidity();return}
      const fd=new FormData(register),password=String(fd.get('password')||''),confirm=String(fd.get('passwordConfirm')||'');
      if(password!==confirm){setStatus('As senhas não coincidem.','error');toast('As senhas não coincidem.');return}
      if(password.length<8){setStatus('A senha precisa ter pelo menos 8 caracteres.','error');toast('Use pelo menos 8 caracteres.');return}
      if(!fd.get('privacyConsent')){setStatus('Aceite a Política de Privacidade e os Termos para continuar.','error');return}
      const btn=$('button[type=submit]',register);btn.disabled=true;setStatus('Criando sua conta…');
      try{
        const data=await api('/auth/register',{method:'POST',body:JSON.stringify({name:fd.get('name'),email:fd.get('email'),password,emailConsent:Boolean(fd.get('emailConsent'))})});
        setAuth(data,true);updateAccountUI();setStatus(`Conta criada! Bem-vindo(a), ${data.user.name}.`,'success');toast(`Conta criada! Bem-vindo(a), ${data.user.name}.`);
        let dest=sessionStorage.getItem('sabor-after-register')||sessionStorage.getItem('sabor-after-login')||'../index.html';
        sessionStorage.removeItem('sabor-after-register');sessionStorage.removeItem('sabor-after-login');
        // Evita voltar para a própria tela de cadastro após o primeiro acesso.
        if(/cadastro\.html/i.test(dest))dest='../index.html';setTimeout(()=>location.href=dest,450);
      }catch(err){setStatus(err.message||'Não foi possível criar a conta.','error');toast(err.message||'Não foi possível criar a conta.')}finally{btn.disabled=false}
    });
  }

  const login=$('[data-login-form]');
  if(login){
    const msg=sessionStorage.getItem('sabor-login-message');if(msg){toast(msg);sessionStorage.removeItem('sabor-login-message')}
    login.addEventListener('submit',async e=>{
      e.preventDefault();if(!login.checkValidity()){login.reportValidity();return}
      const fd=new FormData(login),btn=$('button[type=submit]',login);btn.disabled=true;
      try{
        const data=await api('/auth/login',{method:'POST',body:JSON.stringify({email:fd.get('email'),password:fd.get('password')})});
        setAuth(data,fd.get('remember')!==null);updateAccountUI();toast(`Bem-vindo(a), ${data.user.name}!`);
        let dest=sessionStorage.getItem('sabor-after-login')||'../index.html';sessionStorage.removeItem('sabor-after-login');if(/login\.html/i.test(dest))dest='../index.html';setTimeout(()=>location.href=dest,350);
      }catch(err){
        if(err.code==='ACCOUNT_NOT_FOUND'){sessionStorage.setItem('sabor-register-message','Cadastre-se para continuar.');toast('Conta não encontrada. Abra o cadastro.');setTimeout(()=>location.href='cadastro.html',500)}else toast(err.message)
      }finally{btn.disabled=false}
    });
  }
  return true;
}

function setupIngredientFinder(){
  const board=$('[data-ingredient-finder]');if(!board)return;
  const input=$('[data-ingredient-input]',board),result=$('[data-ingredient-result]',board),go=$('[data-ingredient-go]',board);
  const section=board.closest('.ingredient-section');
  const primaryLink=section?.querySelector('.ingredient-copy .btn');
  const chips=()=>$$('[data-ingredient]',board);
  const selected=()=>chips().filter(btn=>btn.classList.contains('selected')).map(btn=>String(btn.dataset.ingredient||'').trim()).filter(Boolean);
  const update=()=>{
    const values=selected();
    chips().forEach(btn=>{const on=btn.classList.contains('selected');btn.setAttribute('aria-pressed',on?'true':'false');const mark=$('b',btn);if(mark)mark.textContent=on?'×':'+'});
    if(result){
      const strong=$('strong',result),small=$('small',result);
      if(values.length){if(strong)strong.textContent=values.join(', ');if(small)small.textContent=`${values.length} ${values.length===1?'ingrediente selecionado':'ingredientes selecionados'}`;}
      else{if(strong)strong.textContent='Selecione ingredientes';if(small)small.textContent='e veja receitas que combinam com sua cozinha';}
    }
    const href=values.length?`pages/receitas.html?ingredientes=${encodeURIComponent(values.join(','))}`:'pages/receitas.html';
    if(go)go.href=href;if(primaryLink)primaryLink.href=href;
  };
  chips().forEach(btn=>{
    btn.type='button';btn.setAttribute('aria-pressed',btn.classList.contains('selected')?'true':'false');
    btn.addEventListener('click',()=>{btn.classList.toggle('selected');update()});
  });
  const addTyped=()=>{
    const raw=String(input?.value||'').trim();if(!raw)return false;
    const normalized=norm(raw);
    let match=chips().find(btn=>norm(btn.dataset.ingredient||btn.textContent.replace(/[+×]/g,''))===normalized);
    if(match){match.classList.add('selected');}
    else{
      const btn=document.createElement('button');btn.type='button';btn.className='ingredient-chip selected';btn.dataset.ingredient=raw;btn.setAttribute('aria-pressed','true');btn.innerHTML=`${escapeHtml(raw)} <b>×</b>`;
      $('.ingredient-chips',board)?.appendChild(btn);
      btn.addEventListener('click',()=>{btn.classList.toggle('selected');update()});
    }
    if(input)input.value='';update();return true;
  };
  input?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();addTyped()}});
  input?.addEventListener('change',()=>{if(input.value.trim())addTyped()});
  go?.addEventListener('click',e=>{if(!selected().length&&input?.value.trim()){e.preventDefault();addTyped();location.href=go.href}});
  update();
}

function setupForms(){$$('form:not([data-login-form]):not([data-register-form]):not([data-publish-form]):not([data-comment-form])').forEach(f=>f.addEventListener('submit',e=>{if(f.dataset.allowNative!==undefined||f.getAttribute('action'))return;e.preventDefault();if(!f.checkValidity()){f.reportValidity();return}toast('Formulário enviado com sucesso.') }))}
function setupEmailConsent(){const check=$('[data-email-consent]');const label=$('[data-email-consent-label]');if(check&&label)check.addEventListener('change',()=>label.classList.toggle('selected',check.checked))}

window.addEventListener('pagehide',()=>{$('[data-gesture-box]')?._gestureCleanup?.();});
window.addEventListener('keydown',e=>{if(e.key==='Escape'){speechToken++;speechSynthesis.cancel();$('[data-panel]')?.classList.remove('open');$('[data-share-dialog]')?.classList.remove('open');$('[data-comment-modal]')?.classList.remove('open');closeReelViewer();}});
document.addEventListener('DOMContentLoaded',async()=>{
  const toastNode=$('[data-toast]');if(!toastNode){const t=document.createElement('div');t.className='toast';t.dataset.toast='';t.setAttribute('role','status');document.body.appendChild(t)}
  repairBrandPaths();setupRepresentatives();setupTheme();setupMenu();setupAccessibility();setupRecipeCardNavigation();
  const authReady=await setupAuth();if(authReady===false)return;
  setupEmailConsent();updateAccountUI();
  setupRecipePlaceholders();setupFilters();setupIngredientFinder();setupRecipeCardNavigation();
  await setupPublishedRecipeDetail();setupShare();setupLanguage();await setupRemoteRecipes();await setupCommunity();await setupComments();await setupFavorites();await setupPublish();
  setupRecipeSteps();setupServingsScaler();setupStepTimers();setupStarRatings();setupReels();setupCapacitySlots();setupTimer();setupForms();
});
