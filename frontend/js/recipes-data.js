/* ============================================================
   Sabor & Cia — recipes-data.js
   ============================================================
   ESTE É O ARQUIVO PRINCIPAL PARA EDITAR AS RECEITAS.

   Cada receita segue este formato:

   'nome-da-receita': {
      title: 'Nome que aparece no site',
      category: 'Categoria principal',
      categories: ['filtros','onde','ela','aparece'],
      type: 'principal / lanche / sobremesa / bebida...',
      difficulty: 'Fácil / Médio / Difícil',
      minutes: 30,        // tempo TOTAL da receita, em minutos
      servings: 4,        // quantidade de porções
      rating: '4,9',      // nota inicial exibida
      reviews: 120,       // quantidade inicial de avaliações
      image: 'CAMINHO-OU-LINK-DA-FOTO',
      description: 'Descrição da receita',
      ingredients: [...], // ingredientes
      steps: [...]        // modo de preparo
   }

   COMO TROCAR A FOTO:
   Procure a receita e altere somente a linha "image:".

   Exemplo usando foto da internet:
   image:'https://site.com/minha-foto.jpg',

   Exemplo usando foto salva dentro do projeto:
   1. Coloque a foto em: frontend/assets/receitas/omelete.jpg
   2. Use aqui: image:'../assets/receitas/omelete.jpg',

   ATENÇÃO:
   - Não apague vírgulas entre os campos.
   - Textos ficam entre aspas.
   - Números como minutes e servings ficam sem aspas.
   - O timer principal usa o valor de "minutes" automaticamente.
   ============================================================ */
window.SABOR_BUILTIN_RECIPES = {
  /* EXEMPLO DE UMA RECEITA:
     Você pode usar este primeiro bloco como modelo para editar as demais. */
  'omelete-de-queijo': {
    title:'Omelete de queijo', category:'Café da manhã', categories:['cafe','lanches','economicas','rapidas','iniciantes'], type:'lanche', difficulty:'Fácil', minutes:10, servings:2, rating:'4,9', reviews:128,
    image:'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1400&q=90',
    description:'Omelete macio por dentro, dourado por fora e recheado com queijo derretido. Uma opção rápida para café da manhã ou lanche.',
    ingredients:[{q:3,u:'',i:'ovos'},{q:80,u:'g',i:'queijo muçarela ralado'},{q:0.25,u:'',i:'cebola pequena picada'},{q:1,u:'colher (sopa)',i:'leite'},{q:1,u:'colher (chá)',i:'manteiga'},{q:null,u:'',i:'sal, pimenta e cheiro-verde a gosto'}],
    steps:[{t:'Prepare os ovos',d:'Bata os ovos com o leite, sal e pimenta até a mistura ficar uniforme.',timer:60},{t:'Refogue a cebola',d:'Derreta a manteiga em fogo médio e refogue a cebola até ficar transparente.',timer:120},{t:'Cozinhe a omelete',d:'Despeje os ovos, abaixe o fogo e cozinhe até as bordas firmarem. Espalhe o queijo por cima.',timer:180},{t:'Dobre e sirva',d:'Dobre a omelete ao meio, espere o queijo derreter e finalize com cheiro-verde.',timer:60}]
  },
  'pizza-de-frigideira': {
    title:'Pizza de frigideira', category:'Massas', categories:['massas','lanches','economicas','rapidas','iniciantes'], type:'lanche', difficulty:'Fácil', minutes:15, servings:2, rating:'4,8', reviews:214,
    image:'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?auto=format&fit=crop&w=1400&q=90',
    description:'Massa rápida feita na frigideira, com molho de tomate, queijo derretido e acabamento de orégano.',
    ingredients:[{q:1,u:'xícara',i:'farinha de trigo'},{q:0.33,u:'xícara',i:'água'},{q:1,u:'colher (sopa)',i:'azeite'},{q:0.5,u:'colher (chá)',i:'fermento químico'},{q:0.25,u:'colher (chá)',i:'sal'},{q:4,u:'colheres (sopa)',i:'molho de tomate'},{q:120,u:'g',i:'muçarela'},{q:0.5,u:'',i:'tomate em rodelas'},{q:null,u:'',i:'orégano a gosto'}],
    steps:[{t:'Faça a massa',d:'Misture farinha, sal, fermento, água e azeite até formar uma massa macia.',timer:120},{t:'Abra na frigideira',d:'Espalhe a massa em uma frigideira antiaderente untada e cozinhe em fogo baixo.',timer:180},{t:'Vire e recheie',d:'Vire a massa, passe o molho, adicione tomate e muçarela e polvilhe orégano.',timer:120},{t:'Derreta o queijo',d:'Tampe a frigideira e deixe em fogo baixo até o queijo derreter e a base dourar.',timer:180}]
  },
  'risoto-cremoso-de-cogumelos': {
    title:'Risoto cremoso de cogumelos', category:'Massas & risotos', categories:['massas','vegetarianas','jantar','iniciantes'], type:'principal', difficulty:'Médio', minutes:35, servings:4, rating:'4,9', reviews:183,
    image:'https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?auto=format&fit=crop&w=1400&q=90',
    description:'Cremoso no ponto, com cogumelos bem dourados e parmesão. Uma receita para cozinhar devagar e comer sem pressa.',
    ingredients:[{q:2,u:'xícaras',i:'arroz arbóreo'},{q:250,u:'g',i:'cogumelos frescos fatiados'},{q:1,u:'',i:'cebola pequena picada'},{q:0.5,u:'xícara',i:'vinho branco seco'},{q:1,u:'litro',i:'caldo de legumes quente'},{q:80,u:'g',i:'parmesão ralado'},{q:2,u:'colheres (sopa)',i:'manteiga'},{q:1,u:'colher (sopa)',i:'azeite'},{q:null,u:'',i:'sal e pimenta a gosto'}],
    steps:[{t:'Doure os cogumelos',d:'Aqueça o azeite e doure os cogumelos em fogo alto. Tempere e reserve.',timer:300},{t:'Refogue a base',d:'Na mesma panela, derreta metade da manteiga e refogue a cebola até ficar macia.',timer:180},{t:'Toste o arroz',d:'Junte o arroz e mexa por cerca de 2 minutos. Adicione o vinho e espere evaporar.',timer:180},{t:'Adicione o caldo',d:'Coloque o caldo quente aos poucos, mexendo e esperando o líquido ser absorvido antes de adicionar mais.',timer:900},{t:'Finalize',d:'Desligue o fogo, misture cogumelos, parmesão e o restante da manteiga. Tampe e descanse antes de servir.',timer:120}]
  },
  'bolo-de-chocolate-da-familia': {
    title:'Bolo de chocolate da família', category:'Bolos', categories:['sobremesas','bolos','cafe','iniciantes'], type:'sobremesa', difficulty:'Fácil', minutes:50, servings:10, rating:'4,9', reviews:342,
    image:'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1400&q=90',
    description:'Bolo de chocolate fofinho com cobertura cremosa, simples de fazer e ótimo para dividir à mesa.',
    ingredients:[{q:3,u:'',i:'ovos'},{q:1.5,u:'xícara',i:'açúcar'},{q:0.75,u:'xícara',i:'óleo'},{q:1,u:'xícara',i:'leite morno'},{q:1,u:'xícara',i:'chocolate em pó'},{q:2,u:'xícaras',i:'farinha de trigo'},{q:1,u:'colher (sopa)',i:'fermento químico'},{q:1,u:'caixa',i:'creme de leite para a cobertura'},{q:150,u:'g',i:'chocolate meio amargo para a cobertura'}],
    steps:[{t:'Misture os líquidos',d:'Bata ovos, açúcar, óleo e leite até ficar uniforme.',timer:180},{t:'Junte os secos',d:'Acrescente chocolate e farinha aos poucos. Misture o fermento por último.',timer:180},{t:'Asse',d:'Leve a massa a uma forma untada e asse em forno preaquecido a 180 °C.',timer:2100},{t:'Faça a cobertura',d:'Derreta o chocolate com o creme de leite até formar um creme brilhante.',timer:240},{t:'Finalize',d:'Espere o bolo amornar, espalhe a cobertura e sirva.',timer:300}]
  },
  'pastel-crocante-de-feira': {
    title:'Pastel crocante de feira', category:'Salgados', categories:['salgados','lanches','brasileiras'], type:'lanche', difficulty:'Médio', minutes:45, servings:8, rating:'4,8', reviews:97,
    image:'https://images.unsplash.com/photo-1626132647523-66f7bf0e6f9b?auto=format&fit=crop&w=1400&q=90',
    description:'Pastel com massa sequinha e recheio clássico de carne bem temperada, inspirado no pastel de feira.',
    ingredients:[{q:500,u:'g',i:'massa de pastel'},{q:350,u:'g',i:'carne moída'},{q:1,u:'',i:'cebola pequena picada'},{q:1,u:'',i:'tomate sem sementes picado'},{q:0.5,u:'xícara',i:'azeitonas picadas'},{q:null,u:'',i:'sal, pimenta e cheiro-verde a gosto'},{q:null,u:'',i:'óleo suficiente para fritar'}],
    steps:[{t:'Prepare o recheio',d:'Refogue cebola e carne até secar bem. Junte tomate, azeitona e temperos.',timer:600},{t:'Esfrie o recheio',d:'Espere o recheio esfriar completamente para a massa não umedecer.',timer:600},{t:'Monte os pastéis',d:'Distribua o recheio, dobre a massa e feche as bordas pressionando com um garfo.',timer:480},{t:'Frite',d:'Frite em óleo quente, poucos por vez, até ficarem dourados e crocantes.',timer:180}]
  },
  'spaghetti-ao-molho-de-tomate': {
    title:'Spaghetti ao molho de tomate', category:'Massas', categories:['massas','jantar','economicas','rapidas','iniciantes'], type:'principal', difficulty:'Fácil', minutes:25, servings:4, rating:'4,8', reviews:156,
    image:'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1400&q=90',
    description:'Massa simples com molho de tomate caseiro, alho e ervas. Um jantar rápido e cheio de sabor.',
    ingredients:[{q:400,u:'g',i:'spaghetti'},{q:4,u:'',i:'tomates maduros picados'},{q:0.5,u:'',i:'cebola picada'},{q:2,u:'dentes',i:'alho picado'},{q:2,u:'colheres (sopa)',i:'azeite'},{q:null,u:'',i:'sal, pimenta e manjericão a gosto'},{q:40,u:'g',i:'parmesão para servir'}],
    steps:[{t:'Cozinhe a massa',d:'Cozinhe o spaghetti em água salgada até ficar al dente.',timer:600},{t:'Faça o molho',d:'Refogue cebola e alho no azeite, junte os tomates e tempere.',timer:600},{t:'Junte tudo',d:'Escorra a massa reservando um pouco da água do cozimento e misture ao molho.',timer:180},{t:'Finalize',d:'Ajuste a textura com água do cozimento e sirva com manjericão e parmesão.',timer:60}]
  },
  'frango-com-batatas-douradas': {
    title:'Frango com batatas douradas', category:'Almoço', categories:['brasileiras','jantar','almoco','economicas','iniciantes','airfryer'], type:'principal', difficulty:'Fácil', minutes:30, servings:4, rating:'4,9', reviews:226,
    image:'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=1400&q=90',
    description:'Frango suculento com batatas bem douradas e tempero de casa. Pode ser feito no forno ou na airfryer.',
    ingredients:[{q:600,u:'g',i:'peito ou sobrecoxa de frango em cubos'},{q:500,u:'g',i:'batatas em cubos'},{q:1,u:'',i:'cebola em pétalas'},{q:3,u:'dentes',i:'alho amassado'},{q:2,u:'colheres (sopa)',i:'azeite'},{q:1,u:'colher (chá)',i:'páprica'},{q:null,u:'',i:'sal, pimenta e ervas a gosto'}],
    steps:[{t:'Tempere',d:'Misture frango, batata, cebola, alho, azeite e temperos.',timer:180},{t:'Preaqueça',d:'Preaqueça a airfryer a 200 °C ou o forno a 220 °C.',timer:300},{t:'Asse',d:'Distribua sem amontoar e asse até frango cozinhar e batatas dourarem. Mexa na metade.',timer:1200},{t:'Finalize',d:'Confira o ponto do frango e sirva imediatamente.',timer:60}]
  },
  'salada-crocante-da-horta': {
    title:'Salada crocante da horta', category:'Saladas', categories:['saladas','vegetarianas','veganas','fitness','saudaveis','rapidas'], type:'acompanhamento', difficulty:'Fácil', minutes:12, servings:4, rating:'4,8', reviews:88,
    image:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1400&q=90',
    description:'Salada fresca com tomate, pepino, cebola e molho de limão. Leve, colorida e crocante.',
    ingredients:[{q:2,u:'',i:'tomates em cubos'},{q:1,u:'',i:'pepino fatiado'},{q:0.5,u:'',i:'cebola roxa fatiada'},{q:1,u:'',i:'cenoura ralada'},{q:1,u:'',i:'limão'},{q:2,u:'colheres (sopa)',i:'azeite'},{q:null,u:'',i:'sal, pimenta e folhas verdes a gosto'}],
    steps:[{t:'Higienize',d:'Lave e seque bem todos os vegetais e folhas.',timer:180},{t:'Corte',d:'Corte tomate, pepino e cebola e rale a cenoura.',timer:240},{t:'Faça o molho',d:'Misture limão, azeite, sal e pimenta.',timer:60},{t:'Misture e sirva',d:'Junte tudo delicadamente e tempere apenas na hora de servir.',timer:60}]
  },
  'sopa-cremosa-de-legumes': {
    title:'Sopa cremosa de legumes', category:'Sopas', categories:['sopas','vegetarianas','jantar','economicas','rapidas','saudaveis'], type:'principal', difficulty:'Fácil', minutes:20, servings:4, rating:'4,8', reviews:132,
    image:'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1400&q=90',
    description:'Sopa cremosa e econômica com batata, cenoura e cebola, perfeita para dias mais frios.',
    ingredients:[{q:2,u:'',i:'batatas médias em cubos'},{q:2,u:'',i:'cenouras em rodelas'},{q:1,u:'',i:'cebola picada'},{q:1,u:'litro',i:'caldo de legumes'},{q:1,u:'colher (sopa)',i:'azeite'},{q:null,u:'',i:'sal, pimenta e cheiro-verde a gosto'}],
    steps:[{t:'Refogue',d:'Refogue a cebola no azeite até ficar macia.',timer:180},{t:'Cozinhe os legumes',d:'Junte batata, cenoura e caldo e cozinhe até os legumes ficarem macios.',timer:720},{t:'Bata',d:'Bata parte ou toda a sopa com cuidado até obter a cremosidade desejada.',timer:120},{t:'Finalize',d:'Volte ao fogo, ajuste os temperos e finalize com cheiro-verde.',timer:120}]
  },
  'vitamina-de-banana-e-aveia': {
    title:'Vitamina de banana e aveia', category:'Bebidas', categories:['bebidas','fitness','saudaveis','rapidas','cafe'], type:'bebida', difficulty:'Fácil', minutes:8, servings:2, rating:'4,7', reviews:75,
    image:'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=1400&q=90',
    description:'Vitamina cremosa de banana e aveia para um café da manhã rápido ou lanche nutritivo.',
    ingredients:[{q:2,u:'',i:'bananas maduras'},{q:400,u:'ml',i:'leite gelado'},{q:3,u:'colheres (sopa)',i:'aveia em flocos'},{q:1,u:'colher (sopa)',i:'mel ou açúcar opcional'},{q:0.5,u:'colher (chá)',i:'canela'},{q:4,u:'',i:'cubos de gelo'}],
    steps:[{t:'Separe os ingredientes',d:'Descasque as bananas e meça os demais ingredientes.',timer:120},{t:'Bata',d:'Coloque tudo no liquidificador e bata até ficar cremoso.',timer:60},{t:'Ajuste',d:'Prove, ajuste a doçura e a consistência com mais leite se quiser.',timer:60},{t:'Sirva',d:'Sirva imediatamente, de preferência bem gelado.',timer:30}]
  },
  'arroz-feijao-e-carne-acebolada': {
    title:'Arroz, feijão e carne acebolada', category:'Brasileiras', categories:['brasileiras','almoco','economicas','iniciantes'], type:'principal', difficulty:'Fácil', minutes:40, servings:4, rating:'4,9', reviews:301,
    image:'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1400&q=90',
    description:'Prato brasileiro completo com arroz soltinho, feijão temperado e carne acebolada.',
    ingredients:[{q:2,u:'xícaras',i:'arroz cozido'},{q:2,u:'xícaras',i:'feijão cozido com caldo'},{q:500,u:'g',i:'bifes em tiras'},{q:2,u:'',i:'cebolas fatiadas'},{q:3,u:'dentes',i:'alho'},{q:2,u:'colheres (sopa)',i:'óleo ou azeite'},{q:null,u:'',i:'sal, pimenta e cheiro-verde a gosto'}],
    steps:[{t:'Tempere o feijão',d:'Refogue alho em um pouco de óleo, junte o feijão e deixe apurar.',timer:600},{t:'Prepare a carne',d:'Tempere a carne e doure em frigideira bem quente, sem amontoar.',timer:480},{t:'Acebole',d:'Retire a carne, coloque a cebola na mesma frigideira e deixe dourar levemente.',timer:240},{t:'Monte o prato',d:'Volte a carne à frigideira, misture com a cebola e sirva com arroz e feijão.',timer:60}]
  },
  'bolo-de-cenoura-com-chocolate': {
    title:'Bolo de cenoura com chocolate', category:'Bolos', categories:['sobremesas','bolos','cafe'], type:'sobremesa', difficulty:'Médio', minutes:55, servings:12, rating:'4,9', reviews:388,
    image:'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1400&q=90',
    description:'Bolo de cenoura fofinho com cobertura de chocolate brilhante e sabor de receita clássica.',
    ingredients:[{q:3,u:'',i:'cenouras médias picadas'},{q:3,u:'',i:'ovos'},{q:0.75,u:'xícara',i:'óleo'},{q:1.5,u:'xícara',i:'açúcar'},{q:2,u:'xícaras',i:'farinha de trigo'},{q:1,u:'colher (sopa)',i:'fermento químico'},{q:4,u:'colheres (sopa)',i:'chocolate em pó'},{q:3,u:'colheres (sopa)',i:'açúcar para a cobertura'},{q:2,u:'colheres (sopa)',i:'manteiga'},{q:4,u:'colheres (sopa)',i:'leite'}],
    steps:[{t:'Bata a cenoura',d:'Bata cenoura, ovos, óleo e açúcar no liquidificador até ficar liso.',timer:180},{t:'Misture a massa',d:'Junte a mistura à farinha e incorpore o fermento delicadamente.',timer:180},{t:'Asse',d:'Asse em forma untada a 180 °C até o palito sair limpo.',timer:2100},{t:'Faça a cobertura',d:'Leve chocolate, açúcar, manteiga e leite ao fogo até engrossar levemente.',timer:300},{t:'Cubra o bolo',d:'Espalhe a cobertura ainda quente sobre o bolo morno.',timer:60}]
  },
  'wrap-de-grao-de-bico': {
    title:'Wrap de grão-de-bico', category:'Lanches', categories:['veganas','vegetarianas','saudaveis','rapidas','lanches','fitness'], type:'lanche', difficulty:'Fácil', minutes:18, servings:2, rating:'4,6', reviews:64,
    image:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1400&q=90',
    description:'Wrap fresco e nutritivo com grão-de-bico temperado, tomate, cebola e molho de limão.',
    ingredients:[{q:2,u:'',i:'tortilhas para wrap'},{q:1,u:'xícara',i:'grão-de-bico cozido'},{q:1,u:'',i:'tomate em cubos'},{q:0.25,u:'',i:'cebola roxa picada'},{q:0.5,u:'',i:'limão'},{q:1,u:'colher (sopa)',i:'azeite'},{q:null,u:'',i:'folhas verdes, sal e pimenta a gosto'}],
    steps:[{t:'Tempere o grão-de-bico',d:'Amasse levemente o grão-de-bico com azeite, limão, sal e pimenta.',timer:180},{t:'Aqueça os wraps',d:'Aqueça rapidamente as tortilhas em frigideira seca para ficarem flexíveis.',timer:60},{t:'Monte',d:'Distribua folhas, grão-de-bico, tomate e cebola sobre cada tortilha.',timer:120},{t:'Enrole',d:'Dobre as laterais, enrole firme e corte ao meio para servir.',timer:60}]
  },
  'batata-crocante-na-airfryer': {
    title:'Batata crocante na airfryer', category:'Airfryer', categories:['airfryer','salgados','lanches','rapidas','economicas'], type:'lanche', difficulty:'Fácil', minutes:28, servings:4, rating:'4,7', reviews:198,
    image:'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=1400&q=90',
    description:'Batatas crocantes por fora e macias por dentro, com pouco óleo e preparo simples na airfryer.',
    ingredients:[{q:700,u:'g',i:'batatas'},{q:1.5,u:'colher (sopa)',i:'azeite'},{q:1,u:'colher (chá)',i:'páprica'},{q:0.5,u:'colher (chá)',i:'alho em pó'},{q:null,u:'',i:'sal, pimenta e ervas a gosto'}],
    steps:[{t:'Corte e lave',d:'Corte as batatas em palitos ou gomos e lave para retirar o excesso de amido.',timer:300},{t:'Seque e tempere',d:'Seque muito bem e misture com azeite e temperos.',timer:180},{t:'Asse',d:'Leve à airfryer preaquecida a 200 °C em camada não muito cheia.',timer:900},{t:'Mexa e finalize',d:'Agite o cesto e asse mais um pouco até dourar e ficar crocante.',timer:360}]
  },
  'salada-de-folhas-e-queijo': {
    title:'Salada de folhas e queijo', category:'Saladas', categories:['saladas','vegetarianas','saudaveis','almoco','fitness'], type:'acompanhamento', difficulty:'Fácil', minutes:35, servings:4, rating:'4,7', reviews:83,
    image:'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1400&q=90',
    description:'Mix de folhas com tomate, queijo e nozes, finalizado com um molho simples de mostarda e limão.',
    ingredients:[{q:1,u:'maço',i:'folhas variadas'},{q:2,u:'',i:'tomates'},{q:120,u:'g',i:'queijo branco em cubos'},{q:0.5,u:'xícara',i:'nozes picadas'},{q:2,u:'colheres (sopa)',i:'azeite'},{q:1,u:'colher (chá)',i:'mostarda'},{q:0.5,u:'',i:'limão'},{q:null,u:'',i:'sal e pimenta a gosto'}],
    steps:[{t:'Higienize as folhas',d:'Lave, higienize e seque muito bem as folhas para o molho aderir melhor.',timer:600},{t:'Prepare os complementos',d:'Corte tomate e queijo e pique as nozes grosseiramente.',timer:240},{t:'Faça o molho',d:'Misture azeite, mostarda, limão, sal e pimenta até emulsionar.',timer:60},{t:'Monte',d:'Junte tudo em uma tigela grande e tempere somente na hora de servir.',timer:60}]
  }
 };

/* Receitas adicionais: garantem pelo menos 10 opções reais em cada filtro principal. */
(function(){
  const catalog=window.SABOR_BUILTIN_RECIPES;
  const slug=t=>String(t).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const images={
    breakfast:'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1400&q=88',
    meal:'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1400&q=88',
    cake:'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1400&q=88',
    salad:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1400&q=88',
    soup:'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1400&q=88',
    drink:'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=1400&q=88',
    airfryer:'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=1400&q=88',
    pasta:'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1400&q=88'
  };
  const build=(spec)=>{
    const main=spec.main||spec.title.toLowerCase(), template=spec.template;let ingredients=[],steps=[];
    if(template==='breakfast-sweet'){
      ingredients=[{q:1,u:'xícara',i:main},{q:1,u:'xícara',i:'leite ou bebida vegetal'},{q:1,u:'',i:'banana madura'},{q:1,u:'colher (sopa)',i:'aveia ou granola'},{q:null,u:'',i:'canela e mel a gosto'}];
      steps=[{t:'Prepare a base',d:`Separe ${main} e os demais ingredientes.`,timer:120},{t:'Misture',d:'Misture ou bata até obter uma textura uniforme e cremosa.',timer:120},{t:'Ajuste a textura',d:'Acrescente um pouco mais de leite se necessário e prove.',timer:60},{t:'Finalize',d:'Sirva com fruta, canela ou granola por cima.',timer:60}];
    } else if(template==='breakfast-savory'){
      ingredients=[{q:1,u:'xícara',i:main},{q:2,u:'',i:'ovos'},{q:60,u:'g',i:'queijo'},{q:0.5,u:'',i:'tomate picado'},{q:1,u:'colher (chá)',i:'azeite'},{q:null,u:'',i:'sal e ervas a gosto'}];
      steps=[{t:'Prepare os ingredientes',d:`Separe e prepare ${main}, ovos, queijo e tomate.`,timer:120},{t:'Misture a base',d:'Misture os ingredientes principais e tempere.',timer:120},{t:'Cozinhe',d:'Cozinhe em frigideira antiaderente em fogo médio até firmar e dourar.',timer:300},{t:'Sirva',d:'Finalize com ervas e sirva ainda quente.',timer:60}];
    } else if(template==='meal'){
      ingredients=[{q:600,u:'g',i:main},{q:2,u:'xícaras',i:'arroz cozido ou acompanhamento'},{q:1,u:'',i:'cebola picada'},{q:2,u:'dentes',i:'alho'},{q:2,u:'colheres (sopa)',i:'azeite'},{q:null,u:'',i:'sal, pimenta e cheiro-verde a gosto'}];
      steps=[{t:'Tempere',d:`Tempere ${main} com sal, pimenta e alho.`,timer:180},{t:'Refogue a base',d:'Aqueça o azeite e refogue a cebola até ficar macia.',timer:180},{t:'Cozinhe',d:`Junte ${main} e cozinhe até ficar bem dourado e no ponto.`,timer:720},{t:'Finalize',d:'Ajuste os temperos, finalize com cheiro-verde e sirva com o acompanhamento.',timer:120}];
    } else if(template==='cake'){
      ingredients=[{q:1,u:'xícara',i:main},{q:3,u:'',i:'ovos'},{q:1.5,u:'xícara',i:'açúcar'},{q:0.5,u:'xícara',i:'óleo'},{q:1,u:'xícara',i:'leite'},{q:2,u:'xícaras',i:'farinha de trigo'},{q:1,u:'colher (sopa)',i:'fermento químico'}];
      steps=[{t:'Prepare a mistura',d:`Misture ${main}, ovos, açúcar, óleo e leite até ficar uniforme.`,timer:180},{t:'Adicione a farinha',d:'Acrescente a farinha aos poucos e misture até a massa ficar lisa.',timer:180},{t:'Finalize a massa',d:'Incorpore o fermento delicadamente e transfira para uma forma untada.',timer:120},{t:'Asse',d:'Asse em forno preaquecido a 180 °C até dourar e o palito sair limpo.',timer:2100}];
    } else if(template==='salad'){
      ingredients=[{q:2,u:'xícaras',i:main},{q:2,u:'xícaras',i:'folhas frescas'},{q:1,u:'',i:'tomate picado'},{q:0.5,u:'',i:'cebola roxa fatiada'},{q:1,u:'',i:'limão'},{q:2,u:'colheres (sopa)',i:'azeite'},{q:null,u:'',i:'sal, pimenta e ervas a gosto'}];
      steps=[{t:'Higienize',d:'Lave e seque muito bem as folhas e vegetais.',timer:300},{t:'Prepare os ingredientes',d:`Corte ou prepare ${main} e os demais ingredientes.`,timer:240},{t:'Faça o molho',d:'Misture limão, azeite, sal, pimenta e ervas.',timer:60},{t:'Monte',d:'Misture tudo delicadamente e tempere somente antes de servir.',timer:60}];
    } else if(template==='soup'){
      ingredients=[{q:500,u:'g',i:main},{q:1,u:'',i:'batata média em cubos'},{q:1,u:'',i:'cebola picada'},{q:2,u:'dentes',i:'alho'},{q:1,u:'litro',i:'caldo de legumes'},{q:1,u:'colher (sopa)',i:'azeite'},{q:null,u:'',i:'sal e pimenta a gosto'}];
      steps=[{t:'Refogue',d:'Refogue cebola e alho no azeite até perfumar.',timer:180},{t:'Cozinhe',d:`Junte ${main}, batata e caldo. Cozinhe até tudo ficar macio.`,timer:900},{t:'Acerte a textura',d:'Bata parte da sopa se quiser mais cremosidade ou mantenha em pedaços.',timer:180},{t:'Finalize',d:'Volte ao fogo, ajuste sal e pimenta e sirva quente.',timer:120}];
    } else if(template==='drink'){
      ingredients=[{q:2,u:'xícaras',i:main},{q:500,u:'ml',i:'água, leite ou bebida vegetal gelada'},{q:6,u:'',i:'cubos de gelo'},{q:1,u:'colher (sopa)',i:'mel ou açúcar opcional'},{q:null,u:'',i:'limão, hortelã ou canela a gosto'}];
      steps=[{t:'Prepare',d:`Higienize e prepare ${main}.`,timer:120},{t:'Bata ou misture',d:'Junte os ingredientes no liquidificador ou jarra e misture bem.',timer:60},{t:'Ajuste',d:'Acerte a doçura e a concentração conforme seu gosto.',timer:30},{t:'Sirva',d:'Adicione gelo e sirva imediatamente.',timer:30}];
    } else if(template==='airfryer'){
      ingredients=[{q:500,u:'g',i:main},{q:1.5,u:'colher (sopa)',i:'azeite'},{q:1,u:'colher (chá)',i:'páprica'},{q:0.5,u:'colher (chá)',i:'alho em pó'},{q:null,u:'',i:'sal, pimenta e ervas a gosto'}];
      steps=[{t:'Prepare',d:`Corte e seque bem ${main}.`,timer:180},{t:'Tempere',d:'Misture com azeite, páprica, alho, sal e pimenta.',timer:120},{t:'Asse na airfryer',d:'Leve à airfryer preaquecida a 200 °C, sem sobrecarregar o cesto.',timer:720},{t:'Doure',d:'Mexa o cesto e asse mais alguns minutos até ficar dourado e crocante.',timer:300}];
    } else {
      ingredients=[{q:400,u:'g',i:'massa'},{q:250,u:'g',i:main},{q:1,u:'',i:'cebola pequena'},{q:2,u:'dentes',i:'alho'},{q:2,u:'colheres (sopa)',i:'azeite'},{q:300,u:'ml',i:'molho ou caldo'},{q:null,u:'',i:'sal, pimenta e ervas a gosto'}];
      steps=[{t:'Cozinhe a massa',d:'Cozinhe a massa em água salgada até ficar al dente.',timer:600},{t:'Prepare o molho',d:`Refogue cebola e alho e junte ${main}.`,timer:420},{t:'Misture',d:'Junte a massa ao molho e misture com um pouco da água do cozimento.',timer:180},{t:'Finalize',d:'Ajuste sal e pimenta, finalize com ervas e sirva.',timer:60}];
    }
    return {title:spec.title,category:spec.category,categories:spec.categories,type:spec.type,difficulty:spec.difficulty||'Fácil',minutes:spec.minutes,servings:spec.servings||4,rating:spec.rating||'4,8',reviews:spec.reviews||Math.floor(70+spec.minutes*3),image:images[spec.image||template.split('-')[0]]||images.meal,description:spec.description||`${spec.title}: receita prática, completa e pensada para o dia a dia.`,ingredients,steps};
  };
  const specs=[
    // Café da manhã / lanches
    {title:'Panqueca de banana e aveia',category:'Café da manhã',categories:['cafe','lanches','saudaveis','vegetarianas','rapidas','economicas','iniciantes','fitness'],type:'lanche',minutes:15,servings:2,template:'breakfast-sweet',main:'aveia em flocos'},
    {title:'Cuscuz com ovo',category:'Café da manhã',categories:['cafe','lanches','brasileiras','rapidas','economicas','iniciantes'],type:'lanche',minutes:18,servings:2,template:'breakfast-savory',main:'flocão de milho hidratado'},
    {title:'Tapioca de queijo e tomate',category:'Café da manhã',categories:['cafe','lanches','vegetarianas','rapidas','economicas','iniciantes'],type:'lanche',minutes:12,servings:2,template:'breakfast-savory',main:'goma de tapioca'},
    {title:'Pão de queijo de frigideira',category:'Café da manhã',categories:['cafe','lanches','salgados','brasileiras','rapidas','economicas','iniciantes'],type:'lanche',minutes:15,servings:2,template:'breakfast-savory',main:'polvilho doce'},
    {title:'Overnight oats de morango',category:'Café da manhã',categories:['cafe','lanches','saudaveis','vegetarianas','rapidas','fitness'],type:'lanche',minutes:10,servings:2,template:'breakfast-sweet',main:'aveia e morango'},
    {title:'Iogurte com frutas e granola',category:'Café da manhã',categories:['cafe','lanches','saudaveis','vegetarianas','rapidas','fitness','iniciantes'],type:'lanche',minutes:8,servings:2,template:'breakfast-sweet',main:'iogurte natural e frutas'},
    {title:'Crepioca de frango',category:'Café da manhã',categories:['cafe','lanches','rapidas','economicas','iniciantes','fitness'],type:'lanche',minutes:18,servings:2,template:'breakfast-savory',main:'goma de tapioca e frango desfiado'},
    {title:'Torrada integral com abacate',category:'Café da manhã',categories:['cafe','lanches','saudaveis','vegetarianas','veganas','rapidas','fitness','iniciantes'],type:'lanche',minutes:10,servings:2,template:'breakfast-savory',main:'pão integral e abacate'},

    // Almoço / jantar / brasileiras
    {title:'Frango grelhado com arroz e legumes',category:'Almoço',categories:['almoco','jantar','brasileiras','saudaveis','economicas','iniciantes','fitness'],type:'principal',minutes:35,template:'meal',main:'filé de frango'},
    {title:'Carne moída com batata',category:'Almoço',categories:['almoco','jantar','brasileiras','economicas','iniciantes'],type:'principal',minutes:35,template:'meal',main:'carne moída com batata'},
    {title:'Picadinho brasileiro',category:'Almoço',categories:['almoco','jantar','brasileiras','economicas','iniciantes'],type:'principal',minutes:40,template:'meal',main:'carne bovina em cubos'},
    {title:'Escondidinho de frango',category:'Almoço',categories:['almoco','jantar','brasileiras','economicas','iniciantes'],type:'principal',minutes:50,template:'meal',main:'frango desfiado e purê de mandioca'},
    {title:'Arroz carreteiro rápido',category:'Almoço',categories:['almoco','jantar','brasileiras','economicas','rapidas','iniciantes'],type:'principal',minutes:30,template:'meal',main:'carne em tiras e arroz'},
    {title:'Filé de peixe com limão',category:'Almoço',categories:['almoco','jantar','brasileiras','saudaveis','rapidas','fitness','iniciantes'],type:'principal',minutes:28,template:'meal',main:'filé de peixe'},
    {title:'Strogonoff de frango',category:'Almoço',categories:['almoco','jantar','brasileiras','economicas','iniciantes'],type:'principal',minutes:35,template:'meal',main:'frango em cubos com molho cremoso'},
    {title:'Feijão tropeiro simples',category:'Almoço',categories:['almoco','jantar','brasileiras','economicas','iniciantes'],type:'principal',minutes:40,template:'meal',main:'feijão cozido com farinha de mandioca'},

    // Bolos / sobremesas
    {title:'Bolo de fubá cremoso',category:'Bolos',categories:['sobremesas','bolos','cafe','brasileiras','economicas'],type:'sobremesa',minutes:55,servings:12,template:'cake',main:'fubá'},
    {title:'Bolo de laranja',category:'Bolos',categories:['sobremesas','bolos','cafe','economicas','iniciantes'],type:'sobremesa',minutes:50,servings:12,template:'cake',main:'suco e raspas de laranja'},
    {title:'Bolo de banana com canela',category:'Bolos',categories:['sobremesas','bolos','cafe','economicas','iniciantes'],type:'sobremesa',minutes:50,servings:12,template:'cake',main:'banana amassada e canela'},
    {title:'Bolo de coco',category:'Bolos',categories:['sobremesas','bolos','cafe','brasileiras'],type:'sobremesa',minutes:55,servings:12,template:'cake',main:'coco ralado'},
    {title:'Bolo formigueiro',category:'Bolos',categories:['sobremesas','bolos','cafe','iniciantes'],type:'sobremesa',minutes:50,servings:12,template:'cake',main:'chocolate granulado'},
    {title:'Bolo de milho',category:'Bolos',categories:['sobremesas','bolos','cafe','brasileiras','economicas'],type:'sobremesa',minutes:55,servings:12,template:'cake',main:'milho verde'},
    {title:'Bolo de maçã',category:'Bolos',categories:['sobremesas','bolos','cafe','iniciantes'],type:'sobremesa',minutes:55,servings:12,template:'cake',main:'maçã picada e canela'},
    {title:'Bolo de limão',category:'Bolos',categories:['sobremesas','bolos','cafe','iniciantes'],type:'sobremesa',minutes:50,servings:12,template:'cake',main:'suco e raspas de limão'},

    // Saladas
    {title:'Salada tropical de manga',category:'Saladas',categories:['saladas','saudaveis','vegetarianas','veganas','rapidas','fitness'],type:'acompanhamento',minutes:15,template:'salad',main:'manga em cubos'},
    {title:'Salada de grão-de-bico',category:'Saladas',categories:['saladas','saudaveis','vegetarianas','veganas','economicas','fitness'],type:'acompanhamento',minutes:20,template:'salad',main:'grão-de-bico cozido'},
    {title:'Salada de quinoa com legumes',category:'Saladas',categories:['saladas','saudaveis','vegetarianas','veganas','fitness'],type:'acompanhamento',minutes:25,template:'salad',main:'quinoa cozida e legumes'},
    {title:'Salada caprese',category:'Saladas',categories:['saladas','saudaveis','vegetarianas','rapidas','iniciantes'],type:'acompanhamento',minutes:12,template:'salad',main:'tomate, muçarela e manjericão'},
    {title:'Salada de repolho e cenoura',category:'Saladas',categories:['saladas','saudaveis','vegetarianas','veganas','rapidas','economicas','iniciantes'],type:'acompanhamento',minutes:15,template:'salad',main:'repolho e cenoura'},
    {title:'Salada de beterraba e laranja',category:'Saladas',categories:['saladas','saudaveis','vegetarianas','veganas','fitness'],type:'acompanhamento',minutes:20,template:'salad',main:'beterraba cozida e laranja'},
    {title:'Salada de lentilha',category:'Saladas',categories:['saladas','saudaveis','vegetarianas','veganas','economicas','fitness'],type:'acompanhamento',minutes:25,template:'salad',main:'lentilha cozida'},
    {title:'Salada mediterrânea',category:'Saladas',categories:['saladas','saudaveis','vegetarianas','rapidas','fitness'],type:'acompanhamento',minutes:18,template:'salad',main:'pepino, tomate e azeitonas'},

    // Sopas
    {title:'Sopa cremosa de abóbora',category:'Sopas',categories:['sopas','jantar','saudaveis','vegetarianas','veganas','economicas'],type:'principal',minutes:30,template:'soup',main:'abóbora em cubos'},
    {title:'Caldo de mandioquinha',category:'Sopas',categories:['sopas','jantar','saudaveis','vegetarianas','economicas','iniciantes'],type:'principal',minutes:35,template:'soup',main:'mandioquinha'},
    {title:'Sopa de ervilha',category:'Sopas',categories:['sopas','jantar','saudaveis','vegetarianas','veganas','economicas'],type:'principal',minutes:40,template:'soup',main:'ervilha seca'},
    {title:'Sopa de lentilha',category:'Sopas',categories:['sopas','jantar','saudaveis','vegetarianas','veganas','economicas','fitness'],type:'principal',minutes:40,template:'soup',main:'lentilha'},
    {title:'Caldo de feijão',category:'Sopas',categories:['sopas','jantar','brasileiras','economicas','iniciantes'],type:'principal',minutes:30,template:'soup',main:'feijão cozido'},
    {title:'Canja de galinha',category:'Sopas',categories:['sopas','jantar','brasileiras','economicas','iniciantes'],type:'principal',minutes:45,template:'soup',main:'frango desfiado e arroz'},
    {title:'Sopa de tomate assado',category:'Sopas',categories:['sopas','jantar','saudaveis','vegetarianas','veganas','fitness'],type:'principal',minutes:35,template:'soup',main:'tomate maduro'},
    {title:'Creme de milho',category:'Sopas',categories:['sopas','jantar','vegetarianas','economicas','iniciantes'],type:'principal',minutes:30,template:'soup',main:'milho verde'},
    {title:'Sopa de cebola',category:'Sopas',categories:['sopas','jantar','vegetarianas','economicas'],type:'principal',minutes:45,template:'soup',main:'cebola fatiada'},

    // Bebidas
    {title:'Suco verde refrescante',category:'Bebidas',categories:['bebidas','saudaveis','veganas','rapidas','fitness'],type:'bebida',minutes:8,servings:2,template:'drink',main:'couve, abacaxi e limão'},
    {title:'Limonada com hortelã',category:'Bebidas',categories:['bebidas','saudaveis','veganas','rapidas','economicas','iniciantes'],type:'bebida',minutes:8,servings:4,template:'drink',main:'limão e hortelã'},
    {title:'Chá gelado de pêssego',category:'Bebidas',categories:['bebidas','saudaveis','veganas','rapidas'],type:'bebida',minutes:12,servings:4,template:'drink',main:'chá e pêssego'},
    {title:'Smoothie de morango',category:'Bebidas',categories:['bebidas','saudaveis','vegetarianas','rapidas','fitness','cafe'],type:'bebida',minutes:8,servings:2,template:'drink',main:'morango e iogurte'},
    {title:'Smoothie de manga',category:'Bebidas',categories:['bebidas','saudaveis','vegetarianas','rapidas','fitness','cafe'],type:'bebida',minutes:8,servings:2,template:'drink',main:'manga e iogurte'},
    {title:'Café gelado cremoso',category:'Bebidas',categories:['bebidas','cafe','rapidas','iniciantes'],type:'bebida',minutes:10,servings:2,template:'drink',main:'café forte e leite'},
    {title:'Chocolate quente simples',category:'Bebidas',categories:['bebidas','cafe','economicas','iniciantes'],type:'bebida',minutes:15,servings:2,template:'drink',main:'leite e chocolate em pó'},
    {title:'Suco de melancia com limão',category:'Bebidas',categories:['bebidas','saudaveis','veganas','rapidas','fitness'],type:'bebida',minutes:8,servings:4,template:'drink',main:'melancia e limão'},
    {title:'Água saborizada cítrica',category:'Bebidas',categories:['bebidas','saudaveis','veganas','rapidas','fitness'],type:'bebida',minutes:5,servings:4,template:'drink',main:'laranja, limão e hortelã'},

    // Airfryer / salgados
    {title:'Coxinha da asa na airfryer',category:'Airfryer',categories:['airfryer','salgados','lanches','rapidas','economicas','iniciantes'],type:'lanche',minutes:30,template:'airfryer',main:'coxinha da asa de frango'},
    {title:'Nuggets caseiros na airfryer',category:'Airfryer',categories:['airfryer','salgados','lanches','rapidas','economicas','iniciantes'],type:'lanche',minutes:28,template:'airfryer',main:'frango empanado em pedaços'},
    {title:'Pão de alho na airfryer',category:'Airfryer',categories:['airfryer','salgados','lanches','rapidas','economicas','iniciantes','vegetarianas'],type:'lanche',minutes:15,template:'airfryer',main:'pão com creme de alho'},
    {title:'Bolinho de arroz na airfryer',category:'Airfryer',categories:['airfryer','salgados','lanches','brasileiras','economicas','iniciantes'],type:'lanche',minutes:25,template:'airfryer',main:'massa de arroz cozido'},
    {title:'Legumes crocantes na airfryer',category:'Airfryer',categories:['airfryer','salgados','saudaveis','vegetarianas','veganas','fitness','rapidas'],type:'acompanhamento',minutes:22,template:'airfryer',main:'abobrinha, cenoura e pimentão'},
    {title:'Queijo coalho na airfryer',category:'Airfryer',categories:['airfryer','salgados','lanches','brasileiras','rapidas','iniciantes'],type:'lanche',minutes:12,template:'airfryer',main:'queijo coalho'},
    {title:'Pastelzinho na airfryer',category:'Airfryer',categories:['airfryer','salgados','lanches','rapidas','economicas','iniciantes'],type:'lanche',minutes:18,template:'airfryer',main:'pastel pequeno recheado'},
    {title:'Banana com canela na airfryer',category:'Airfryer',categories:['airfryer','sobremesas','lanches','saudaveis','vegetarianas','rapidas','economicas'],type:'sobremesa',minutes:12,template:'airfryer',main:'banana madura'},

    // Massas
    {title:'Penne alho e óleo',category:'Massas',categories:['massas','jantar','rapidas','economicas','vegetarianas','iniciantes'],type:'principal',minutes:20,template:'pasta',main:'alho dourado e azeite'},
    {title:'Macarrão cremoso de frango',category:'Massas',categories:['massas','jantar','economicas','iniciantes'],type:'principal',minutes:30,template:'pasta',main:'frango desfiado e creme de leite'},
    {title:'Fusilli com legumes',category:'Massas',categories:['massas','jantar','saudaveis','vegetarianas','rapidas','fitness'],type:'principal',minutes:25,template:'pasta',main:'abobrinha, cenoura e tomate'},
    {title:'Nhoque ao molho de tomate',category:'Massas',categories:['massas','jantar','vegetarianas','economicas'],type:'principal',minutes:40,template:'pasta',main:'molho de tomate caseiro'},
    {title:'Lasanha de frigideira',category:'Massas',categories:['massas','jantar','rapidas','economicas','iniciantes'],type:'principal',minutes:30,template:'pasta',main:'molho de tomate, presunto e queijo'},
    {title:'Macarrão com atum',category:'Massas',categories:['massas','jantar','rapidas','economicas','iniciantes'],type:'principal',minutes:25,template:'pasta',main:'atum e tomate'},
    {title:'Talharim com cogumelos',category:'Massas',categories:['massas','jantar','vegetarianas','rapidas'],type:'principal',minutes:28,template:'pasta',main:'cogumelos fatiados'}
  ];
  specs.forEach(spec=>{const key=slug(spec.title);if(!catalog[key])catalog[key]=build(spec)});
})();
window.SABOR_RECIPE_ALIASES = {
  'risoto-cogumelos':'risoto-cremoso-de-cogumelos',
  'pizza-frigideira':'pizza-de-frigideira',
  'bolo-chocolate':'bolo-de-chocolate-da-familia'
};


/* ===== Expansão V8: catálogo fechado em 200 receitas + 10 receitas infantis ===== */
(function(){
  const catalog=window.SABOR_BUILTIN_RECIPES||(window.SABOR_BUILTIN_RECIPES={});
  const slug=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const images={
    breakfast:'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1400&q=88',
    meal:'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1400&q=88',
    dessert:'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1400&q=88',
    pasta:'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1400&q=88',
    snack:'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1400&q=88',
    healthy:'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1400&q=88',
    vegan:'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=1400&q=88',
    soup:'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1400&q=88',
    drink:'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1400&q=88',
    airfryer:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1400&q=88',
    kids:'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1400&q=88'
  };
  const base=(spec,ingredients,steps)=>({
    title:spec.title,category:spec.category,categories:spec.categories,type:spec.type||'principal',difficulty:spec.difficulty||'Fácil',minutes:spec.minutes||30,servings:spec.servings||4,rating:spec.rating||'4,8',reviews:spec.reviews||Math.max(35,Math.round((spec.minutes||30)*3.1)),image:images[spec.image||spec.template]||images.meal,description:spec.description||`${spec.title}: uma receita completa, gostosa e prática para variar o cardápio do dia a dia.`,ingredients,steps,adultSupervision:!!spec.adultSupervision,kids:!!spec.kids
  });
  function build(spec){
    const main=spec.main||spec.title.toLowerCase();let ing=[],steps=[];
    if(spec.template==='breakfast'){
      ing=[{q:1,u:'xícara',i:main},{q:2,u:'',i:'ovos ou equivalente da receita'},{q:0.5,u:'xícara',i:'leite ou bebida vegetal'},{q:1,u:'colher (sopa)',i:'azeite, manteiga ou mel, conforme a receita'},{q:null,u:'',i:'sal, canela ou ervas a gosto'}];
      steps=[{t:'Separe os ingredientes',d:`Prepare ${main} e deixe tudo medido antes de começar.`,timer:120},{t:'Misture a base',d:'Misture os ingredientes até obter uma massa ou recheio uniforme.',timer:180},{t:'Cozinhe',d:'Cozinhe em fogo médio ou baixo, observando o ponto para não ressecar.',timer:360},{t:'Finalize',d:'Acerte o tempero e sirva ainda fresco.',timer:60}];
    }else if(spec.template==='dessert'){
      ing=[{q:2,u:'xícaras',i:main},{q:2,u:'',i:'ovos'},{q:1,u:'xícara',i:'açúcar'},{q:1,u:'xícara',i:'farinha de trigo ou aveia'},{q:0.5,u:'xícara',i:'leite'},{q:1,u:'colher (chá)',i:'fermento ou espessante, conforme a receita'}];
      steps=[{t:'Prepare a mistura',d:`Misture ${main} com os ingredientes líquidos.`,timer:180},{t:'Junte os secos',d:'Acrescente os ingredientes secos aos poucos e mexa até ficar homogêneo.',timer:180},{t:'Cozinhe ou asse',d:'Leve ao forno ou ao fogo conforme o preparo e cozinhe até atingir o ponto.',timer:1500},{t:'Espere e sirva',d:'Deixe amornar antes de cortar, montar ou servir.',timer:300}];
    }else if(spec.template==='pasta'){
      ing=[{q:400,u:'g',i:'massa'},{q:250,u:'g',i:main},{q:1,u:'',i:'cebola pequena picada'},{q:2,u:'dentes',i:'alho'},{q:2,u:'colheres (sopa)',i:'azeite'},{q:300,u:'ml',i:'molho ou caldo'},{q:null,u:'',i:'sal, pimenta e ervas a gosto'}];
      steps=[{t:'Cozinhe a massa',d:'Cozinhe a massa em água salgada até ficar al dente.',timer:600},{t:'Prepare o molho',d:`Refogue cebola e alho, junte ${main} e cozinhe até ficar saboroso.`,timer:480},{t:'Misture',d:'Junte a massa ao molho e use um pouco da água do cozimento para dar liga.',timer:180},{t:'Finalize',d:'Ajuste o sal, finalize com ervas e sirva.',timer:60}];
    }else if(spec.template==='snack'){
      ing=[{q:400,u:'g',i:main},{q:1,u:'xícara',i:'base da massa ou pão'},{q:120,u:'g',i:'queijo ou recheio complementar'},{q:1,u:'',i:'tomate ou legume picado'},{q:1,u:'colher (sopa)',i:'azeite'},{q:null,u:'',i:'temperos a gosto'}];
      steps=[{t:'Prepare o recheio',d:`Prepare ${main} e tempere de forma equilibrada.`,timer:300},{t:'Monte',d:'Distribua o recheio na massa, pão ou base escolhida.',timer:240},{t:'Doure',d:'Leve ao forno, frigideira ou airfryer até ficar dourado e bem aquecido.',timer:600},{t:'Sirva',d:'Espere um minuto, corte e sirva.',timer:60}];
    }else if(spec.template==='healthy'||spec.template==='vegan'){
      ing=[{q:2,u:'xícaras',i:main},{q:1,u:'xícara',i:'legumes variados'},{q:0.5,u:'xícara',i:'grãos cozidos'},{q:1,u:'',i:'limão'},{q:2,u:'colheres (sopa)',i:'azeite'},{q:null,u:'',i:'ervas, sal e pimenta a gosto'}];
      steps=[{t:'Higienize',d:'Lave e seque muito bem os vegetais e ingredientes frescos.',timer:240},{t:'Prepare',d:`Corte e prepare ${main} e os acompanhamentos.`,timer:300},{t:'Tempere',d:'Misture limão, azeite e ervas para formar um tempero leve.',timer:60},{t:'Monte',d:'Junte tudo, misture delicadamente e sirva.',timer:60}];
    }else if(spec.template==='soup'){
      ing=[{q:500,u:'g',i:main},{q:1,u:'',i:'batata ou mandioquinha em cubos'},{q:1,u:'',i:'cebola picada'},{q:2,u:'dentes',i:'alho'},{q:1,u:'litro',i:'caldo caseiro'},{q:1,u:'colher (sopa)',i:'azeite'},{q:null,u:'',i:'sal e pimenta a gosto'}];
      steps=[{t:'Refogue',d:'Refogue cebola e alho no azeite até perfumar.',timer:180},{t:'Cozinhe',d:`Junte ${main}, a batata e o caldo. Cozinhe até ficar macio.`,timer:900},{t:'Ajuste a textura',d:'Bata parte do preparo se quiser um caldo mais cremoso.',timer:180},{t:'Finalize',d:'Volte ao fogo, ajuste o tempero e sirva quente.',timer:120}];
    }else if(spec.template==='drink'){
      ing=[{q:2,u:'xícaras',i:main},{q:500,u:'ml',i:'água, leite ou bebida vegetal'},{q:6,u:'',i:'cubos de gelo'},{q:1,u:'colher (sopa)',i:'mel ou açúcar opcional'},{q:null,u:'',i:'hortelã, canela ou limão a gosto'}];
      steps=[{t:'Prepare',d:`Higienize e prepare ${main}.`,timer:120},{t:'Bata',d:'Bata ou misture com o líquido até ficar uniforme.',timer:60},{t:'Ajuste',d:'Prove e ajuste a doçura ou a concentração.',timer:30},{t:'Sirva',d:'Acrescente gelo e sirva na hora.',timer:30}];
    }else if(spec.template==='airfryer'){
      ing=[{q:500,u:'g',i:main},{q:1.5,u:'colher (sopa)',i:'azeite'},{q:1,u:'colher (chá)',i:'páprica'},{q:0.5,u:'colher (chá)',i:'alho em pó'},{q:null,u:'',i:'sal, pimenta e ervas a gosto'}];
      steps=[{t:'Prepare',d:`Corte e seque bem ${main}.`,timer:180},{t:'Tempere',d:'Misture com azeite e temperos.',timer:120},{t:'Asse',d:'Leve à airfryer preaquecida a 200 °C sem sobrecarregar o cesto.',timer:720},{t:'Doure',d:'Mexa o cesto e asse mais alguns minutos até ficar dourado.',timer:300}];
    }else{
      ing=[{q:600,u:'g',i:main},{q:2,u:'xícaras',i:'acompanhamento cozido'},{q:1,u:'',i:'cebola picada'},{q:2,u:'dentes',i:'alho'},{q:2,u:'colheres (sopa)',i:'azeite'},{q:null,u:'',i:'sal, pimenta e cheiro-verde a gosto'}];
      steps=[{t:'Tempere',d:`Tempere ${main} e deixe descansar alguns minutos.`,timer:180},{t:'Refogue',d:'Aqueça o azeite e refogue cebola e alho.',timer:180},{t:'Cozinhe',d:`Junte ${main} e cozinhe até ficar no ponto.`,timer:720},{t:'Finalize',d:'Acerte o tempero e sirva com o acompanhamento.',timer:120}];
    }
    return base(spec,ing,steps);
  }
  const groups=[
    {template:'breakfast',category:'Café da manhã',categories:['cafe','lanches','rapidas','iniciantes','economicas'],type:'lanche',minutes:18,names:[
      ['Mingau cremoso de aveia e maçã','aveia com maçã e canela'],['Ovos mexidos com tomate e ervas','ovos, tomate e ervas'],['Pão na chapa com queijo branco','pão francês e queijo branco'],['Tapioca de banana e canela','goma de tapioca com banana'],['Creme de mamão com aveia','mamão maduro com aveia'],['Cuscuz com queijo coalho','cuscuz de milho com queijo coalho'],['Panqueca de cacau e banana','banana, cacau e aveia'],['Torrada com ricota temperada','pão integral e ricota'],['Omelete de espinafre','ovos e espinafre'],['Bowl de iogurte com manga','iogurte natural e manga']
    ]},
    {template:'meal',category:'Almoço',categories:['almoco','jantar','brasileiras','economicas','iniciantes'],type:'principal',minutes:40,names:[
      ['Frango ensopado com cenoura','frango em cubos com cenoura'],['Bife acebolado com arroz','bife bovino com cebola'],['Arroz de forno cremoso','arroz cozido com legumes e queijo'],['Lombo suíno com batatas','lombo suíno em cubos'],['Tilápia assada com legumes','filé de tilápia'],['Almôndegas ao molho caseiro','almôndegas de carne'],['Frango xadrez simples','frango, pimentões e cebola'],['Carne de panela com mandioca','carne bovina e mandioca'],['Arroz com frango de uma panela','frango e arroz temperado'],['Panela de linguiça com legumes','linguiça acebolada com legumes']
    ]},
    {template:'dessert',category:'Sobremesas',categories:['sobremesas','cafe','iniciantes'],type:'sobremesa',minutes:45,names:[
      ['Pudim de leite simples','leite condensado e leite'],['Mousse de maracujá fácil','maracujá e creme de leite'],['Brigadeiro de colher','chocolate e leite condensado'],['Cocada cremosa','coco ralado e leite'],['Doce de banana com canela','banana madura e canela'],['Torta gelada de limão','limão e creme branco'],['Pavê de chocolate prático','biscoito e creme de chocolate'],['Arroz-doce com canela','arroz, leite e canela'],['Curau de milho cremoso','milho verde e leite'],['Bolo de caneca de chocolate','cacau e farinha']
    ]},
    {template:'pasta',category:'Massas',categories:['massas','jantar','iniciantes','economicas'],type:'principal',minutes:30,names:[
      ['Espaguete com almôndegas','almôndegas ao molho de tomate'],['Penne ao molho rosé','molho de tomate e creme de leite'],['Parafuso com frango e milho','frango desfiado e milho'],['Macarrão com brócolis e alho','brócolis e alho dourado'],['Talharim ao molho branco','molho branco cremoso'],['Macarrão de panela de pressão','molho de tomate e queijo'],['Ravióli ao molho de tomate','ravióli recheado'],['Espaguete com abobrinha','abobrinha e tomate'],['Penne com carne moída','carne moída e tomate'],['Macarrão gratinado com queijo','molho cremoso e queijo']
    ]},
    {template:'snack',category:'Lanches',categories:['lanches','salgados','iniciantes','economicas'],type:'lanche',minutes:25,names:[
      ['Torta salgada de liquidificador','frango desfiado e milho'],['Enroladinho de presunto e queijo','presunto e queijo'],['Pão recheado de frigideira','queijo e tomate'],['Cachorro-quente de forno','salsicha e molho de tomate'],['Mini empada de frango','frango cremoso'],['Esfiha aberta de carne','carne moída temperada'],['Sanduíche quente de forno','presunto, queijo e tomate'],['Bolinho de milho com queijo','milho verde e queijo'],['Croquete de carne assado','carne desfiada temperada'],['Tostex de frango cremoso','frango desfiado e requeijão'],['Quiche de legumes simples','legumes picados, ovos e queijo']
    ]},
    {template:'healthy',category:'Saudáveis',categories:['saudaveis','fitness','saladas','rapidas'],type:'acompanhamento',minutes:22,names:[
      ['Bowl de frango e quinoa','quinoa, frango grelhado e folhas'],['Salada de pepino com iogurte','pepino e molho de iogurte'],['Abobrinha grelhada com ervas','abobrinha em rodelas'],['Ovos cozidos com salada colorida','ovos cozidos e vegetais'],['Batata-doce com frango desfiado','batata-doce e frango'],['Arroz integral com legumes','arroz integral e legumes'],['Tabule de quinoa','quinoa, tomate, pepino e hortelã'],['Salada de feijão-fradinho','feijão-fradinho e vegetais'],['Wrap integral de frango','frango, folhas e tomate'],['Bowl de atum com grão-de-bico','atum, grão-de-bico e folhas']
    ]},
    {template:'meal',category:'Brasileiras',categories:['brasileiras','almoco','jantar','economicas'],type:'principal',minutes:45,names:[
      ['Galinhada simples','frango com arroz e açafrão'],['Vaca atolada prática','carne bovina com mandioca'],['Arroz tropeiro','arroz, feijão e farinha'],['Frango com quiabo','frango e quiabo'],['Moqueca rápida de peixe','peixe, tomate e leite de coco'],['Baião de dois simplificado','arroz, feijão e queijo coalho'],['Escondidinho de carne moída','carne moída e purê de mandioca'],['Arroz com pequi caseiro','arroz e pequi'],['Carne seca com abóbora','carne seca e abóbora'],['Virado de legumes com ovo','feijão, farinha, legumes e ovo']
    ]},
    {template:'vegan',category:'Veganas',categories:['veganas','vegetarianas','saudaveis','fitness','economicas'],type:'principal',minutes:30,names:[
      ['Hambúrguer de lentilha','lentilha cozida e aveia'],['Curry de grão-de-bico','grão-de-bico e leite de coco'],['Tofu grelhado com legumes','tofu e legumes'],['Arroz com lentilha e cebola','arroz e lentilha'],['Abóbora assada com grão-de-bico','abóbora e grão-de-bico'],['Berinjela recheada com quinoa','berinjela e quinoa'],['Feijão branco com tomate e ervas','feijão branco e tomate'],['Macarrão vegano ao pesto','massa e pesto de manjericão'],['Purê de batata com cogumelos','batata e cogumelos'],['Bowl de feijão-preto e milho','feijão-preto, milho e arroz']
    ]},
    {template:'soup',category:'Sopas',categories:['sopas','jantar','saudaveis','economicas'],type:'principal',minutes:38,names:[
      ['Sopa de legumes com macarrão','cenoura, batata, chuchu e macarrão'],['Caldo verde leve','batata e couve'],['Creme de cenoura com gengibre','cenoura e gengibre'],['Sopa de batata com alho-poró','batata e alho-poró'],['Caldo de abóbora com frango','abóbora e frango desfiado'],['Sopa de grão-de-bico','grão-de-bico e legumes'],['Creme de ervilha com hortelã','ervilha e hortelã'],['Sopa de milho com frango','milho e frango desfiado'],['Caldo de mandioca com carne','mandioca e carne desfiada'],['Sopa de abobrinha e cenoura','abobrinha e cenoura']
    ]},
    {template:'drink',category:'Bebidas',categories:['bebidas','rapidas','iniciantes'],type:'bebida',minutes:8,names:[
      ['Suco de abacaxi com hortelã','abacaxi e hortelã'],['Vitamina de banana e aveia','banana e aveia'],['Suco de laranja com cenoura','laranja e cenoura'],['Smoothie de banana e cacau','banana e cacau'],['Chá gelado de limão','chá preto e limão'],['Suco de goiaba cremoso','goiaba madura'],['Vitamina de mamão','mamão e leite'],['Limonada suíça suave','limão e leite condensado opcional'],['Suco de manga com maracujá','manga e maracujá'],['Chocolate gelado cremoso','leite e chocolate']
    ]},
    {template:'airfryer',category:'Airfryer',categories:['airfryer','rapidas','iniciantes'],type:'lanche',minutes:24,names:[
      ['Batata rústica na airfryer','batata em gomos'],['Frango empanado crocante na airfryer','filé de frango empanado'],['Abobrinha empanada na airfryer','abobrinha em rodelas'],['Almôndegas na airfryer','almôndegas de carne'],['Milho temperado na airfryer','espiga de milho em pedaços'],['Couve-flor crocante na airfryer','couve-flor em floretes'],['Linguiça acebolada na airfryer','linguiça e cebola'],['Batata-doce chips na airfryer','batata-doce fatiada'],['Pão de queijo recheado na airfryer','pão de queijo com queijo'],['Filé de peixe na airfryer','filé de peixe temperado']
    ]}
  ];
  groups.forEach(group=>group.names.forEach(([title,main],idx)=>{
    const spec={...group,title,main,minutes:group.minutes+(idx%3)*3,servings:group.type==='bebida'?4:4};delete spec.names;
    const key=slug(title);if(!catalog[key])catalog[key]=build(spec);
  }));

  const kids=[
    {title:'Mini pizza colorida',main:'mini pães ou discos de massa, molho, queijo, milho e tomate',type:'lanche',minutes:20,servings:4,template:'snack',categories:['infantis','lanches','salgados','iniciantes','rapidas'],description:'Mini pizzas alegres para montar com as crianças. Cada uma pode escolher as cores do próprio recheio.'},
    {title:'Panquequinha de banana com carinhas',main:'banana, aveia e ovos',type:'lanche',minutes:15,servings:4,template:'breakfast',categories:['infantis','cafe','lanches','iniciantes','saudaveis'],description:'Panquequinhas pequenas decoradas com frutas para formar carinhas divertidas.'},
    {title:'Sanduíche estrelinha de queijo e tomate',main:'pão macio, queijo e tomate',type:'lanche',minutes:12,servings:4,template:'snack',categories:['infantis','lanches','iniciantes','rapidas'],description:'Sanduíches em formato divertido, macios e fáceis de montar com ajuda de um adulto.'},
    {title:'Copinho arco-íris de frutas',main:'morango, manga, kiwi, uva e banana',type:'sobremesa',minutes:10,servings:4,template:'healthy',categories:['infantis','sobremesas','saudaveis','veganas','rapidas','iniciantes'],description:'Camadas de frutas de várias cores em copinhos transparentes para deixar o lanche mais alegre.'},
    {title:'Biscoitinho de aveia e banana',main:'banana amassada e aveia',type:'sobremesa',minutes:25,servings:8,template:'dessert',categories:['infantis','sobremesas','lanches','saudaveis','iniciantes'],description:'Biscoitinhos macios com poucos ingredientes, bons para um lanche simples.'},
    {title:'Mini hambúrguer caseiro divertido',main:'mini hambúrguer, pão pequeno, queijo e alface',type:'lanche',minutes:30,servings:4,template:'snack',categories:['infantis','lanches','salgados','iniciantes'],description:'Mini hambúrgueres em tamanho infantil, montados com ingredientes simples e coloridos.'},
    {title:'Barquinho de banana com frutas',main:'banana, morango, uva e iogurte',type:'sobremesa',minutes:10,servings:4,template:'healthy',categories:['infantis','sobremesas','saudaveis','rapidas','iniciantes'],description:'Banana aberta como um barquinho e recheada com frutas picadas e iogurte.'},
    {title:'Pão de queijo mini',main:'polvilho, queijo e ovos',type:'lanche',minutes:30,servings:10,template:'snack',categories:['infantis','lanches','salgados','brasileiras','iniciantes'],description:'Pãezinhos de queijo pequenos, fáceis de segurar e ótimos para o lanche.'},
    {title:'Vitamina rosa de morango e banana',main:'morango, banana e leite',type:'bebida',minutes:7,servings:3,template:'drink',categories:['infantis','bebidas','cafe','rapidas','iniciantes','saudaveis'],description:'Vitamina naturalmente rosada, cremosa e fácil de preparar.'},
    {title:'Bolinho de cenoura em mini forminhas',main:'cenoura, ovos, farinha e cacau para cobertura',type:'sobremesa',minutes:40,servings:10,template:'dessert',categories:['infantis','sobremesas','bolos','cafe','iniciantes'],description:'Mini bolinhos de cenoura feitos em forminhas coloridas, com cobertura de chocolate opcional.'}
  ];
  kids.forEach((spec,idx)=>{
    const full={...spec,category:'Infantis',difficulty:'Fácil',kids:true,adultSupervision:true,image:'kids',rating:'4,9',reviews:90+idx*7};
    const recipe=build(full);
    // Ajustes pensados para cozinha com crianças: etapas curtas e lembrete de supervisão.
    recipe.steps[0]={t:'Organize com um adulto',d:'Lave as mãos, separe os ingredientes e peça ajuda de um adulto para facas, fogo, forno ou eletrodomésticos.',timer:120};
    recipe.description=spec.description+' Nas partes quentes ou com corte, peça ajuda de um adulto.';
    const key=slug(spec.title);if(!catalog[key])catalog[key]=recipe;
  });

  // Garante exatamente 200 receitas embutidas sem apagar nenhuma receita anterior.
  const keys=Object.keys(catalog);
  if(keys.length>200){
    // Esta salvaguarda só afetaria itens adicionados por engano depois desta versão.
    keys.slice(200).forEach(k=>delete catalog[k]);
  }
})();


/* ============================================================
   FOTOS DAS 200 RECEITAS — alta resolução, sem mudar o layout
   ============================================================
   As fotos abaixo usam o CDN da Unsplash em até 3840 px de largura.
   O site continua com o MESMO visual; só trocamos os placeholders por fotos.

   IMPORTANTE PARA CELULAR/TABLET:
   - O catálogo usa uma versão menor da mesma foto para carregar mais rápido.
   - Ao abrir a receita, a imagem principal usa a versão de alta resolução.
   - As fotos continuam com loading="lazy" nos cards.
   ============================================================ */
(function(){
  const catalog=window.SABOR_BUILTIN_RECIPES||{};

  // Fotos que já faziam parte do projeto, agora pedidas em alta resolução.
  const photo=id=>`https://images.unsplash.com/${id}?auto=format&fit=crop&w=3840&q=90`;

  // Pequenos grupos de fotos por tipo de receita. Assim o catálogo fica variado
  // sem alterar nomes, textos, filtros, botões ou qualquer parte do layout.
  const pools={
    breakfast:[
      'photo-1525351484163-7529414344d8',
      'photo-1533089860892-a7c6f0a88666',
      'photo-1511690743698-d9d85f2fbf38',
      'photo-1509440159596-0249088772ff'
    ],
    pizza:[
      'photo-1571997478779-2adcbbe9ab2f',
      'photo-1565299624946-b28f40a0ae38'
    ],
    pasta:[
      'photo-1473093295043-cdd812d0e601',
      'photo-1551183053-bf91a1d81141',
      'photo-1572449043416-55f4685c9bb7'
    ],
    dessert:[
      'photo-1578985545062-69928b1d9587',
      'photo-1551024506-0bccd828d307'
    ],
    snack:[
      'photo-1601050690597-df0568f70950',
      'photo-1626132647523-66f7bf0e6f9b',
      'photo-1509440159596-0249088772ff'
    ],
    meal:[
      'photo-1532550907401-a500c9a57435',
      'photo-1504674900247-0877df9cc836',
      'photo-1547592180-85f173990554'
    ],
    salad:[
      'photo-1512621776951-a57141f2eefd',
      'photo-1540420773420-3366772f4999',
      'photo-1490645935967-10de6ba17061'
    ],
    soup:[
      'photo-1547592166-23ac45744acd',
      'photo-1547592180-85f173990554'
    ],
    drink:[
      'photo-1553530666-ba11a7da3888',
      'photo-1544145945-f90425340c7e'
    ],
    airfryer:[
      'photo-1573080496219-bb080dd4f877',
      'photo-1532550907401-a500c9a57435'
    ],
    healthy:[
      'photo-1512621776951-a57141f2eefd',
      'photo-1540420773420-3366772f4999',
      'photo-1490645935967-10de6ba17061'
    ]
  };

  // Faz a escolha sempre ser a mesma para cada receita.
  // Isso evita a foto trocar sozinha quando a página é recarregada.
  const stableIndex=(text,size)=>{
    let n=0;
    for(const ch of String(text||'')) n=(n*31+ch.charCodeAt(0))>>>0;
    return size?n%size:0;
  };

  const normalize=text=>String(text||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');

  const groupFor=recipe=>{
    const text=normalize(`${recipe.title} ${recipe.category} ${(recipe.categories||[]).join(' ')}`);
    if(/pizza/.test(text)) return 'pizza';
    if(/macarrao|massa|spaghetti|espaguete|penne|talharim|ravioli|risoto/.test(text)) return 'pasta';
    if(/bolo|pudim|mousse|brigadeiro|pave|cocada|doce|biscoit|sobremesa|curau/.test(text)) return 'dessert';
    if(/sopa|caldo|creme de/.test(text)) return 'soup';
    if(/suco|vitamina|smoothie|cha |limonada|bebida|chocolate gelado/.test(text)) return 'drink';
    if(/airfryer/.test(text)) return 'airfryer';
    if(/salada|bowl|tabule|quinoa|vegana|vegetariana|grao-de-bico|tofu|saudavel|fitness/.test(text)) return 'healthy';
    if(/cafe da manha|omelete|panqueca|cuscuz|tapioca|iogurte|crepioca|torrada|mingau|ovos/.test(text)) return 'breakfast';
    if(/lanche|salgado|pastel|sanduiche|pao |empada|esfiha|croquete|tostex|quiche|hamburguer/.test(text)) return 'snack';
    return 'meal';
  };

  Object.values(catalog).forEach(recipe=>{
    const group=groupFor(recipe);
    const pool=pools[group]||pools.meal;
    recipe.image=photo(pool[stableIndex(recipe.title,pool.length)]);
  });
})();

/* Mantém todos os filtros de dificuldade úteis no catálogo. */
Object.values(window.SABOR_BUILTIN_RECIPES||{}).forEach(recipe=>{
  if(recipe.kids||(recipe.categories||[]).includes('infantis')){ recipe.difficulty='Fácil'; return; }
  const cats=recipe.categories||[];
  if(Number(recipe.minutes)>=50 && (cats.includes('bolos')||cats.includes('massas')||cats.includes('brasileiras'))) recipe.difficulty='Difícil';
  else if(Number(recipe.minutes)>=35) recipe.difficulty='Médio';
});
