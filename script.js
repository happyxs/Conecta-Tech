(function () {
'use strict';

document.documentElement.classList.add('js');

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

const store = {
get(key, fallback) {
try {
const raw = localStorage.getItem(key);
return raw === null ? fallback : JSON.parse(raw);
} catch (e) {
return fallback;
}
},
set(key, value) {
try {
localStorage.setItem(key, JSON.stringify(value));
} catch (e) {}
}
};

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const norm = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const COURSES = [
{ id: 'c1', title: 'Responsive Web Design', platform: 'freeCodeCamp', cat: 'Web', level: 'Iniciante', lang: 'EN', hours: 300, featured: 10, url: 'https://www.freecodecamp.org/learn', desc: 'Currículo completo com exercícios no próprio navegador: HTML, CSS, Flexbox, Grid e projetos práticos.' },
{ id: 'c2', title: 'Aprender Desenvolvimento Web', platform: 'MDN Web Docs', cat: 'Web', level: 'Iniciante', lang: 'PT', hours: 60, featured: 9, url: 'https://developer.mozilla.org/pt-BR/docs/Learn_web_development', desc: 'Guia oficial e em português da Mozilla, do primeiro HTML até JavaScript e acessibilidade.' },
{ id: 'c3', title: 'Curso de HTML5 e CSS3', platform: 'Curso em Vídeo', cat: 'Web', level: 'Iniciante', lang: 'PT', hours: 40, featured: 9, url: 'https://www.cursoemvideo.com/', desc: 'Videoaulas didáticas em português, ótimas para quem está começando totalmente do zero.' },
{ id: 'c4', title: 'The Modern JavaScript Tutorial', platform: 'javascript.info', cat: 'Web', level: 'Intermediário', lang: 'EN', hours: 80, featured: 7, url: 'https://javascript.info/', desc: 'Tutorial extenso e bem explicado sobre a linguagem, com tarefas para fixar cada capítulo.' },
{ id: 'c5', title: 'Full Stack Foundations', platform: 'The Odin Project', cat: 'Web', level: 'Intermediário', lang: 'EN', hours: 400, featured: 8, url: 'https://www.theodinproject.com/', desc: 'Caminho gratuito e baseado em projetos para se tornar desenvolvedor web de ponta a ponta.' },
{ id: 'c6', title: 'CS50: Introdução à Ciência da Computação', platform: 'Harvard CS50', cat: 'Fundamentos', level: 'Iniciante', lang: 'EN', hours: 100, featured: 10, url: 'https://cs50.harvard.edu/x/', desc: 'O curso introdutório mais famoso do mundo. Gratuito, com legendas e exercícios desafiadores.' },
{ id: 'c7', title: 'Curso de Python para Iniciantes', platform: 'Curso em Vídeo', cat: 'Programação', level: 'Iniciante', lang: 'PT', hours: 45, featured: 10, url: 'https://www.cursoemvideo.com/', desc: 'Aprenda lógica e Python na prática, com exercícios resolvidos e linguagem acessível.' },
{ id: 'c8', title: 'CS50P: Programação com Python', platform: 'Harvard CS50', cat: 'Programação', level: 'Iniciante', lang: 'EN', hours: 60, featured: 8, url: 'https://cs50.harvard.edu/python/', desc: 'Python do básico ao testes automatizados, com problem sets e certificado opcional.' },
{ id: 'c9', title: 'Tutorial oficial de Python', platform: 'Python.org', cat: 'Programação', level: 'Intermediário', lang: 'PT', hours: 20, featured: 6, url: 'https://docs.python.org/pt-br/3/tutorial/', desc: 'A documentação oficial traduzida: ótima referência para consolidar a linguagem.' },
{ id: 'c10', title: 'GitHub Skills', platform: 'GitHub', cat: 'Programação', level: 'Iniciante', lang: 'EN', hours: 8, featured: 7, url: 'https://skills.github.com/', desc: 'Mini cursos interativos para aprender Git, GitHub, pull requests e publicação de sites.' },
{ id: 'c11', title: 'Lógica de Programação', platform: 'Khan Academy', cat: 'Fundamentos', level: 'Iniciante', lang: 'PT', hours: 25, featured: 7, url: 'https://pt.khanacademy.org/computing', desc: 'Conceitos de computação e programação explicados com vídeos curtos e desafios interativos.' },
{ id: 'c12', title: 'Kaggle Learn', platform: 'Kaggle', cat: 'Dados e IA', level: 'Intermediário', lang: 'EN', hours: 40, featured: 8, url: 'https://www.kaggle.com/learn', desc: 'Micro cursos de Python, Pandas, SQL e Machine Learning direto no notebook, sem instalar nada.' },
{ id: 'c13', title: 'Elements of AI', platform: 'Universidade de Helsinque', cat: 'Dados e IA', level: 'Iniciante', lang: 'EN', hours: 30, featured: 7, url: 'https://www.elementsofai.com/', desc: 'Introdução sem matemática pesada para entender o que é inteligência artificial e como ela afeta a sociedade.' },
{ id: 'c14', title: 'Trilhas de Fundamentos de IA e Dados', platform: 'Microsoft Learn', cat: 'Dados e IA', level: 'Iniciante', lang: 'PT', hours: 20, featured: 8, url: 'https://learn.microsoft.com/pt-br/training/', desc: 'Módulos gratuitos em português sobre nuvem, dados e inteligência artificial, com laboratórios guiados.' },
{ id: 'c15', title: 'Introdução à Cibersegurança', platform: 'Cisco Networking Academy', cat: 'Redes e Segurança', level: 'Iniciante', lang: 'PT', hours: 15, featured: 9, url: 'https://www.netacad.com/', desc: 'Entenda ameaças, proteção de dados e carreiras na área de segurança digital.' },
{ id: 'c16', title: 'Fundamentos de Redes', platform: 'Cisco Networking Academy', cat: 'Redes e Segurança', level: 'Iniciante', lang: 'PT', hours: 24, featured: 8, url: 'https://www.netacad.com/', desc: 'Como a internet funciona por baixo: IP, roteamento, switches e configuração básica de redes.' },
{ id: 'c17', title: 'Pre Security', platform: 'TryHackMe', cat: 'Redes e Segurança', level: 'Iniciante', lang: 'EN', hours: 40, featured: 7, url: 'https://tryhackme.com/', desc: 'Laboratórios práticos no navegador para aprender redes, Linux e web antes de entrar em segurança.' },
{ id: 'c18', title: 'Cursos de Informática e Tecnologia', platform: 'Fundação Bradesco', cat: 'Fundamentos', level: 'Iniciante', lang: 'PT', hours: 30, featured: 6, url: 'https://www.ev.org.br/', desc: 'Escola Virtual com cursos gratuitos e certificado de participação em tecnologia e áreas de apoio.' }
];

const CAT_GLYPH = {
'Web': '&lt;/&gt;',
'Programação': '{ }',
'Dados e IA': 'AI',
'Redes e Segurança': '#!',
'Fundamentos': '01'
};

const LEVEL_ORDER = { 'Iniciante': 0, 'Intermediário': 1 };

const TRAILS = [
{
id: 'web', name: 'Desenvolvimento Web', glyph: '&lt;/&gt;',
short: 'HTML, CSS e JavaScript do zero',
desc: 'Aprenda a construir sites completos e publicar o seu primeiro portfólio online.',
steps: [
{ id: 's1', t: 'Entenda como a web funciona', d: 'Navegador, servidor, HTTP e o que acontece quando você abre uma página.', h: 2, u: 'https://developer.mozilla.org/pt-BR/docs/Learn_web_development', l: 'MDN Web Docs' },
{ id: 's2', t: 'HTML: a estrutura das páginas', d: 'Títulos, links, imagens, listas, formulários e boas práticas de acessibilidade.', h: 8, u: 'https://www.cursoemvideo.com/', l: 'Curso em Vídeo' },
{ id: 's3', t: 'CSS: estilo e layout', d: 'Cores, tipografia, Flexbox, Grid e design responsivo para celular e computador.', h: 12, u: 'https://www.freecodecamp.org/learn', l: 'freeCodeCamp' },
{ id: 's4', t: 'JavaScript essencial', d: 'Variáveis, funções, eventos e manipulação da página para criar interações.', h: 20, u: 'https://javascript.info/', l: 'javascript.info' },
{ id: 's5', t: 'Git e GitHub', d: 'Controle de versão, repositórios e como colaborar com outras pessoas.', h: 4, u: 'https://skills.github.com/', l: 'GitHub Skills' },
{ id: 's6', t: 'Projeto final: portfólio publicado', d: 'Monte seu site pessoal com seus projetos e publique gratuitamente no GitHub Pages.', h: 14, u: 'https://www.theodinproject.com/', l: 'The Odin Project' }
]
},
{
id: 'python', name: 'Programação com Python', glyph: '{ }',
short: 'Lógica e automação para iniciantes',
desc: 'Desenvolva raciocínio lógico e crie programas que resolvem problemas reais do seu dia a dia.',
steps: [
{ id: 's1', t: 'Lógica de programação', d: 'Algoritmos, fluxogramas, variáveis, condições e repetições sem medo.', h: 8, u: 'https://pt.khanacademy.org/computing', l: 'Khan Academy' },
{ id: 's2', t: 'Python: primeiros passos', d: 'Instalação, sintaxe, tipos de dados, entrada e saída.', h: 10, u: 'https://www.cursoemvideo.com/', l: 'Curso em Vídeo' },
{ id: 's3', t: 'Controle de fluxo e funções', d: 'if, for, while, funções e organização do código em pequenos blocos.', h: 10, u: 'https://cs50.harvard.edu/python/', l: 'CS50P' },
{ id: 's4', t: 'Listas, dicionários e arquivos', d: 'Estruturas de dados e leitura e escrita de arquivos de texto e CSV.', h: 8, u: 'https://docs.python.org/pt-br/3/tutorial/', l: 'Python.org' },
{ id: 's5', t: 'Git e GitHub', d: 'Versione seus códigos e comece a montar um perfil público de projetos.', h: 4, u: 'https://skills.github.com/', l: 'GitHub Skills' },
{ id: 's6', t: 'Projeto: automatize uma tarefa', d: 'Crie um script que renomeia arquivos, organiza planilhas ou consulta uma API.', h: 10, u: 'https://automatetheboringstuff.com/', l: 'Automate the Boring Stuff' }
]
},
{
id: 'dados', name: 'Dados e Inteligência Artificial', glyph: 'AI',
short: 'Analise dados e entenda a IA',
desc: 'Aprenda a transformar números em decisões e entenda como funcionam os modelos de IA.',
steps: [
{ id: 's1', t: 'Base em Python', d: 'Domine o essencial da linguagem usada na maior parte da área de dados.', h: 10, u: 'https://www.kaggle.com/learn', l: 'Kaggle Learn' },
{ id: 's2', t: 'Estatística básica', d: 'Média, mediana, desvio padrão, correlação e como interpretar gráficos.', h: 8, u: 'https://pt.khanacademy.org/math', l: 'Khan Academy' },
{ id: 's3', t: 'Pandas e visualização', d: 'Limpeza de dados, agrupamentos e gráficos com Python.', h: 12, u: 'https://www.kaggle.com/learn', l: 'Kaggle Learn' },
{ id: 's4', t: 'SQL para consultar dados', d: 'SELECT, filtros, junções e agregações em bancos de dados relacionais.', h: 8, u: 'https://learn.microsoft.com/pt-br/training/', l: 'Microsoft Learn' },
{ id: 's5', t: 'Introdução à IA e Machine Learning', d: 'Conceitos de aprendizado de máquina, ética em IA e seus primeiros modelos.', h: 10, u: 'https://www.elementsofai.com/', l: 'Elements of AI' },
{ id: 's6', t: 'Projeto: análise de dados públicos', d: 'Escolha um conjunto de dados aberto, faça perguntas e apresente suas conclusões.', h: 14, u: 'https://www.kaggle.com/datasets', l: 'Kaggle Datasets' }
]
},
{
id: 'redes', name: 'Redes e Segurança', glyph: '#!',
short: 'Infraestrutura e proteção digital',
desc: 'Entenda como a internet funciona por baixo e como proteger sistemas e pessoas.',
steps: [
{ id: 's1', t: 'Como computadores e redes funcionam', d: 'Hardware, sistemas operacionais e como os dispositivos se comunicam.', h: 6, u: 'https://cs50.harvard.edu/x/', l: 'CS50' },
{ id: 's2', t: 'Modelo OSI e TCP/IP', d: 'Camadas de rede, protocolos e o caminho de um pacote até o destino.', h: 8, u: 'https://www.netacad.com/', l: 'Cisco Networking Academy' },
{ id: 's3', t: 'Endereçamento IP e sub-redes', d: 'IPv4, IPv6, máscaras, gateways e como planejar uma rede pequena.', h: 10, u: 'https://www.netacad.com/', l: 'Cisco Networking Academy' },
{ id: 's4', t: 'Linux no terminal', d: 'Comandos essenciais, permissões, processos e redes via linha de comando.', h: 10, u: 'https://tryhackme.com/', l: 'TryHackMe' },
{ id: 's5', t: 'Fundamentos de cibersegurança', d: 'Ameaças, criptografia, senhas, engenharia social e boas práticas.', h: 10, u: 'https://www.netacad.com/', l: 'Cisco Networking Academy' },
{ id: 's6', t: 'Prática guiada em laboratório', d: 'Resolva salas e desafios em ambientes seguros e legais de aprendizado.', h: 14, u: 'https://tryhackme.com/', l: 'TryHackMe' }
]
}
];

const MAT_TYPES = ['Documentação', 'Prática', 'Vídeos', 'Guias', 'Ferramentas'];

const MAT_ICONS = {
'Documentação': '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
'Prática': '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
'Vídeos': '<rect x="2" y="5" width="20" height="14" rx="3"/><path d="m10 9 5 3-5 3z"/>',
'Guias': '<path d="M3 7l9-4 9 4-9 4zM3 12l9 4 9-4M3 17l9 4 9-4"/>',
'Ferramentas': '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>'
};

const MATERIALS = [
{ type: 'Documentação', title: 'MDN Web Docs', desc: 'A referência mais confiável de HTML, CSS e JavaScript, com exemplos e guias em português.', url: 'https://developer.mozilla.org/pt-BR/' },
{ type: 'Documentação', title: 'Documentação do Python', desc: 'Tutorial, biblioteca padrão e guias oficiais da linguagem, com tradução para o português.', url: 'https://docs.python.org/pt-br/3/' },
{ type: 'Documentação', title: 'W3Schools', desc: 'Referência rápida com exemplos editáveis para testar código no navegador.', url: 'https://www.w3schools.com/' },
{ type: 'Documentação', title: 'DevDocs', desc: 'Várias documentações reunidas em uma interface rápida que funciona até offline.', url: 'https://devdocs.io/' },
{ type: 'Prática', title: 'Exercism', desc: 'Exercícios em dezenas de linguagens com feedback de mentores voluntários.', url: 'https://exercism.org/' },
{ type: 'Prática', title: 'Codewars', desc: 'Desafios curtos de lógica chamados kata, que treinam o raciocínio de programação.', url: 'https://www.codewars.com/' },
{ type: 'Prática', title: 'HackerRank', desc: 'Problemas de algoritmos e trilhas por linguagem, usados em processos seletivos.', url: 'https://www.hackerrank.com/' },
{ type: 'Prática', title: 'Frontend Mentor', desc: 'Desafios de interface com designs prontos para você transformar em código.', url: 'https://www.frontendmentor.io/' },
{ type: 'Vídeos', title: 'Canal freeCodeCamp', desc: 'Cursos completos de horas de duração sobre programação, dados e computação.', url: 'https://www.youtube.com/@freecodecamp' },
{ type: 'Vídeos', title: 'Canal Curso em Vídeo', desc: 'Playlists organizadas em português para quem está dando os primeiros passos.', url: 'https://www.youtube.com/@CursoemVideo' },
{ type: 'Vídeos', title: 'Canal Filipe Deschamps', desc: 'Vídeos em português sobre tecnologia, carreira e o mercado de software.', url: 'https://www.youtube.com/@FilipeDeschamps' },
{ type: 'Guias', title: 'roadmap.sh', desc: 'Mapas visuais mostrando o que estudar em cada carreira de tecnologia, passo a passo.', url: 'https://roadmap.sh/' },
{ type: 'Guias', title: 'Eloquent JavaScript', desc: 'Livro gratuito online que ensina JavaScript com exercícios interativos.', url: 'https://eloquentjavascript.net/' },
{ type: 'Guias', title: 'Pro Git em português', desc: 'Livro oficial e gratuito para entender Git do básico ao avançado.', url: 'https://git-scm.com/book/pt-br/v2' },
{ type: 'Ferramentas', title: 'Visual Studio Code', desc: 'Editor de código gratuito e leve, com extensões para praticamente qualquer linguagem.', url: 'https://code.visualstudio.com/' },
{ type: 'Ferramentas', title: 'GitHub', desc: 'Hospede seus projetos, publique sites com GitHub Pages e construa seu portfólio.', url: 'https://github.com/' },
{ type: 'Ferramentas', title: 'CodePen', desc: 'Editor online para testar HTML, CSS e JavaScript e compartilhar com facilidade.', url: 'https://codepen.io/' },
{ type: 'Ferramentas', title: 'Figma', desc: 'Ferramenta de design de interfaces com plano gratuito para estudantes e iniciantes.', url: 'https://www.figma.com/' }
];

const OPP_TYPES = ['Programas', 'Benefícios', 'Comunidades', 'Eventos'];

const OPPS = [
{ type: 'Programas', title: 'Oracle Next Education (ONE)', org: 'Oracle e Alura', desc: 'Programa de formação em tecnologia com trilhas de conteúdo e foco em empregabilidade.', url: 'https://www.oracle.com/br/education/oracle-next-education/', g: 'ON' },
{ type: 'Programas', title: 'Bootcamps gratuitos', org: 'DIO', desc: 'Bootcamps em parceria com empresas, com desafios de código e projetos para o portfólio.', url: 'https://www.dio.me/', g: 'DI' },
{ type: 'Programas', title: 'Programaê!', org: 'Fundação Telefônica Vivo', desc: 'Portal com cursos, materiais e iniciativas para aprender programação e pensamento computacional.', url: 'https://programae.org.br/', g: 'Pg' },
{ type: 'Programas', title: 'Capacitação para mulheres', org: '{reprograma}', desc: 'Formações em tecnologia voltadas a mulheres, com foco em inclusão e inserção no mercado.', url: 'https://reprograma.com.br/', g: 'rP' },
{ type: 'Benefícios', title: 'GitHub Student Developer Pack', org: 'GitHub Education', desc: 'Pacote de ferramentas e serviços gratuitos para estudantes verificados.', url: 'https://education.github.com/pack', g: 'GH' },
{ type: 'Benefícios', title: 'Licenças para estudantes', org: 'JetBrains', desc: 'Acesso gratuito às IDEs profissionais da JetBrains para uso educacional.', url: 'https://www.jetbrains.com/community/education/', g: 'JB' },
{ type: 'Comunidades', title: 'Google Developer Groups', org: 'Google', desc: 'Comunidades locais de pessoas desenvolvedoras com eventos, palestras e mentoria.', url: 'https://developers.google.com/community', g: 'GD' },
{ type: 'Comunidades', title: 'Microsoft Learn Student Ambassadors', org: 'Microsoft', desc: 'Rede global de estudantes que aprendem, ensinam e promovem eventos de tecnologia.', url: 'https://studentambassadors.microsoft.com/', g: 'MS' },
{ type: 'Eventos', title: 'Hacktoberfest', org: 'DigitalOcean', desc: 'Evento anual de outubro que incentiva contribuições para projetos de código aberto.', url: 'https://hacktoberfest.com/', g: 'HF' },
{ type: 'Eventos', title: 'Google Summer of Code', org: 'Google', desc: 'Programa para iniciantes contribuírem com projetos open source acompanhados por mentores.', url: 'https://summerofcode.withgoogle.com/', g: 'GS' },
{ type: 'Eventos', title: 'Hackathons online', org: 'Devpost', desc: 'Maratonas de projeto em equipe para praticar, criar portfólio e conhecer pessoas.', url: 'https://devpost.com/hackathons', g: 'DP' },
{ type: 'Eventos', title: 'Python Brasil', org: 'Comunidade Python', desc: 'Principal encontro da comunidade Python do país, com palestras e oficinas.', url: 'https://pythonbrasil.org.br/', g: 'PY' }
];

const FAQS = [
{ q: 'O ConectaTech é realmente gratuito?', a: 'Sim. O ConectaTech não cobra nada e não pede cartão de crédito. Os cursos listados são oferecidos gratuitamente pelas próprias plataformas. Algumas delas podem cobrar por certificados ou recursos extras, e isso é sempre decisão sua.' },
{ q: 'Preciso ter conhecimento prévio em tecnologia?', a: 'Não. Há cursos e trilhas pensados para quem nunca programou. Use o filtro de nível Iniciante ou faça o quiz para receber uma sugestão de por onde começar.' },
{ q: 'Preciso de um computador potente?', a: 'Para começar, não. Muitos cursos funcionam direto no navegador, até pelo celular. Para tarefas mais avançadas, você pode usar editores online e laboratórios na nuvem.' },
{ q: 'Meu progresso nas trilhas fica salvo?', a: 'Sim, no próprio navegador do seu dispositivo. Se você limpar os dados do navegador ou usar outro aparelho, o progresso não será levado junto.' },
{ q: 'Os cursos têm certificado?', a: 'Depende de cada plataforma. Alguns oferecem certificado gratuito, outros cobram e outros não emitem. Confira as regras no site oficial de cada curso antes de começar.' },
{ q: 'Como o ConectaTech escolhe os conteúdos?', a: 'Reunimos materiais de instituições e comunidades reconhecidas, com foco em acessibilidade, idioma e clareza para iniciantes. Como links e condições podem mudar, vale sempre conferir as informações no site de origem.' }
];

const QUIZ = [
{ q: 'O que mais chama a sua atenção na tecnologia?', o: [
{ t: 'Criar sites e aplicativos que as pessoas usam', s: { web: 2 } },
{ t: 'Fazer o computador resolver problemas sozinho', s: { python: 2 } },
{ t: 'Descobrir padrões escondidos nos números', s: { dados: 2 } },
{ t: 'Entender como tudo se conecta e se protege', s: { redes: 2 } }
] },
{ q: 'Como você prefere aprender?', o: [
{ t: 'Vendo o resultado visual acontecer na hora', s: { web: 2 } },
{ t: 'Resolvendo desafios de lógica e quebra-cabeças', s: { python: 2 } },
{ t: 'Investigando, comparando e tirando conclusões', s: { dados: 2 } },
{ t: 'Montando e testando na prática, passo a passo', s: { redes: 2 } }
] },
{ q: 'Qual destes projetos você gostaria de fazer primeiro?', o: [
{ t: 'Um site de portfólio com o meu nome', s: { web: 2 } },
{ t: 'Um programa que automatiza uma tarefa chata', s: { python: 2 } },
{ t: 'Um painel com gráficos de dados reais', s: { dados: 2 } },
{ t: 'Uma rede doméstica mais segura e organizada', s: { redes: 2 } }
] },
{ q: 'Qual frase combina mais com você?', o: [
{ t: 'Gosto de design, cores e de ver as coisas bonitas', s: { web: 1, dados: 1 } },
{ t: 'Gosto de lógica e de achar a solução mais esperta', s: { python: 1, dados: 1 } },
{ t: 'Gosto de números, gráficos e de responder perguntas', s: { dados: 2 } },
{ t: 'Gosto de saber como as coisas funcionam por dentro', s: { redes: 1, python: 1 } }
] }
];

const THEME_KEY = 'ct-theme';
const FAV_KEY = 'ct-favs';
const PROG_KEY = 'ct-progress';
const QUIZ_KEY = 'ct-quiz';
const LEADS_KEY = 'ct-leads';

const header = $('#header');
const nav = $('#nav');
const burger = $('#burger');
const toastEl = $('#toast');
let toastTimer;

function toast(msg) {
toastEl.textContent = msg;
toastEl.classList.add('show');
clearTimeout(toastTimer);
toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
}

function applyTheme(theme) {
document.documentElement.setAttribute('data-theme', theme);
const meta = $('meta[name="theme-color"]');
if (meta) meta.setAttribute('content', theme === 'dark' ? '#06101f' : '#0b78e8');
}

(function initTheme() {
const saved = store.get(THEME_KEY, null);
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(saved || (prefersDark ? 'dark' : 'light'));
$('#themeBtn').addEventListener('click', () => {
const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
applyTheme(next);
store.set(THEME_KEY, next);
});
})();

function closeMenu() {
nav.classList.remove('open');
header.classList.remove('menu-open');
burger.setAttribute('aria-expanded', 'false');
burger.setAttribute('aria-label', 'Abrir menu');
}

burger.addEventListener('click', () => {
const open = !nav.classList.contains('open');
nav.classList.toggle('open', open);
header.classList.toggle('menu-open', open);
burger.setAttribute('aria-expanded', String(open));
burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
});

nav.addEventListener('click', (e) => {
if (e.target.closest('a')) closeMenu();
});

const progressBar = $('#progressBar');
const toTop = $('#toTop');
const navLinks = $$('.nav a');
const sectionEls = navLinks.map((a) => $(a.getAttribute('href'))).filter(Boolean);
let ticking = false;

function onScroll() {
const y = window.scrollY;
const max = document.documentElement.scrollHeight - window.innerHeight;
progressBar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
header.classList.toggle('scrolled', y > 10);
toTop.classList.toggle('show', y > 700);
let current = null;
const probe = y + window.innerHeight * 0.35;
sectionEls.forEach((s) => {
if (s.offsetTop <= probe) current = s.id;
});
navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
ticking = false;
}

window.addEventListener('scroll', () => {
if (!ticking) {
ticking = true;
requestAnimationFrame(onScroll);
}
}, { passive: true });
window.addEventListener('resize', onScroll);
onScroll();

toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

(function initReveal() {
const els = $$('.reveal');
if (!('IntersectionObserver' in window)) {
els.forEach((el) => el.classList.add('in'));
return;
}
const io = new IntersectionObserver((entries) => {
entries.forEach((en) => {
if (en.isIntersecting) {
en.target.classList.add('in');
io.unobserve(en.target);
}
});
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
els.forEach((el) => io.observe(el));
})();

(function initCounters() {
const els = $$('[data-count]');
const run = (el) => {
const target = Number(el.dataset.count);
const suffix = el.dataset.suffix || '';
const dur = 1400;
const start = performance.now();
const tick = (now) => {
const p = Math.min((now - start) / dur, 1);
const eased = 1 - Math.pow(1 - p, 3);
el.textContent = Math.round(target * eased) + suffix;
if (p < 1) requestAnimationFrame(tick);
};
requestAnimationFrame(tick);
};
if (!('IntersectionObserver' in window)) {
els.forEach((el) => { el.textContent = el.dataset.count + (el.dataset.suffix || ''); });
return;
}
const io = new IntersectionObserver((entries) => {
entries.forEach((en) => {
if (en.isIntersecting) {
run(en.target);
io.unobserve(en.target);
}
});
}, { threshold: 0.6 });
els.forEach((el) => io.observe(el));
})();

let favs = store.get(FAV_KEY, []).filter((id) => COURSES.some((c) => c.id === id));
const drawer = $('#drawer');
const overlay = $('#overlay');
const drawerBody = $('#drawerBody');
const favCount = $('#favCount');
const heroFav = $('#heroFav');
let lastFocus = null;

drawer.inert = true;

function openDrawer() {
lastFocus = document.activeElement;
renderDrawer();
drawer.inert = false;
drawer.classList.add('open');
overlay.classList.add('show');
drawer.setAttribute('aria-hidden', 'false');
document.body.style.overflow = 'hidden';
$('#drawerClose').focus();
}

function closeDrawer() {
if (!drawer.classList.contains('open')) return;
drawer.classList.remove('open');
overlay.classList.remove('show');
drawer.setAttribute('aria-hidden', 'true');
drawer.inert = true;
document.body.style.overflow = '';
if (lastFocus && lastFocus.focus) lastFocus.focus();
}

function updateFavUI() {
favCount.textContent = favs.length;
favCount.classList.toggle('show', favs.length > 0);
heroFav.textContent = favs.length;
$$('.fav').forEach((btn) => {
const on = favs.includes(btn.dataset.id);
btn.setAttribute('aria-pressed', String(on));
btn.setAttribute('aria-label', (on ? 'Remover dos favoritos: ' : 'Salvar nos favoritos: ') + btn.dataset.title);
});
}

function renderDrawer() {
if (!favs.length) {
drawerBody.innerHTML = '<div class="drawer-empty"><svg viewBox="0 0 24 24" width="46" height="46" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-4.4-9.3-9A5.4 5.4 0 0 1 12 6.1 5.4 5.4 0 0 1 21.3 12C19 16.6 12 21 12 21z"/></svg><p>Você ainda não salvou nenhum curso.<br>Toque no coração de um curso para guardá-lo aqui.</p></div>';
$('#clearFavs').hidden = true;
return;
}
$('#clearFavs').hidden = false;
drawerBody.innerHTML = favs.map((id) => {
const c = COURSES.find((x) => x.id === id);
return '<div class="fav-item"><div class="trail-ico">' + CAT_GLYPH[c.cat] + '</div><div><strong>' + esc(c.title) + '</strong><small>' + esc(c.platform) + ' · ' + c.level + '</small><br><a href="' + esc(c.url) + '" target="_blank" rel="noopener noreferrer">Abrir curso</a></div><button type="button" data-remove="' + c.id + '" aria-label="Remover ' + esc(c.title) + '"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>';
}).join('');
}

function toggleFav(id) {
const i = favs.indexOf(id);
const c = COURSES.find((x) => x.id === id);
if (i >= 0) {
favs.splice(i, 1);
toast('Removido dos favoritos');
} else {
favs.push(id);
toast('Salvo: ' + c.title);
}
store.set(FAV_KEY, favs);
updateFavUI();
if (drawer.classList.contains('open')) renderDrawer();
}

$('#favBtn').addEventListener('click', openDrawer);
$('#drawerClose').addEventListener('click', closeDrawer);
overlay.addEventListener('click', closeDrawer);
$('#clearFavs').addEventListener('click', () => {
favs = [];
store.set(FAV_KEY, favs);
updateFavUI();
renderDrawer();
toast('Favoritos limpos');
});
drawerBody.addEventListener('click', (e) => {
const b = e.target.closest('[data-remove]');
if (b) toggleFav(b.dataset.remove);
});

const filters = { q: '', cat: 'Todos', level: 'all', lang: 'all', sort: 'featured' };
const grid = $('#courseGrid');
const emptyState = $('#emptyState');
const resultInfo = $('#resultInfo');
const catChips = $('#catChips');
const searchInput = $('#courseSearch');

function buildCatChips() {
const cats = ['Todos'].concat(Array.from(new Set(COURSES.map((c) => c.cat))));
catChips.innerHTML = cats.map((cat) => {
const n = cat === 'Todos' ? COURSES.length : COURSES.filter((c) => c.cat === cat).length;
return '<button type="button" role="tab" aria-selected="' + (filters.cat === cat) + '" data-cat="' + esc(cat) + '">' + esc(cat) + '<span class="n">' + n + '</span></button>';
}).join('');
}

function highlight(text, q) {
const safe = esc(text);
if (!q) return safe;
const re = new RegExp('(' + reEsc(esc(q.trim())) + ')', 'ig');
return safe.replace(re, '<mark>$1</mark>');
}

function filterCourses() {
const q = norm(filters.q.trim());
let list = COURSES.filter((c) => {
if (filters.cat !== 'Todos' && c.cat !== filters.cat) return false;
if (filters.level !== 'all' && c.level !== filters.level) return false;
if (filters.lang !== 'all' && c.lang !== filters.lang) return false;
if (q) {
const hay = norm([c.title, c.platform, c.cat, c.desc, c.level].join(' '));
return q.split(/\s+/).every((w) => hay.includes(w));
}
return true;
});
if (filters.sort === 'az') list.sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'));
else if (filters.sort === 'level') list.sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level] || b.featured - a.featured);
else list.sort((a, b) => b.featured - a.featured);
return list;
}

function renderCourses() {
const list = filterCourses();
grid.innerHTML = list.map((c, i) => {
const on = favs.includes(c.id);
return '<article class="course" data-cat="' + esc(c.cat) + '" style="animation-delay:' + Math.min(i, 12) * 45 + 'ms">' +
'<div class="course-top"><span class="glyph">' + CAT_GLYPH[c.cat] + '</span>' +
'<button type="button" class="fav" data-id="' + c.id + '" data-title="' + esc(c.title) + '" aria-pressed="' + on + '" aria-label="' + (on ? 'Remover dos favoritos: ' : 'Salvar nos favoritos: ') + esc(c.title) + '"><svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-4.4-9.3-9A5.4 5.4 0 0 1 12 6.1 5.4 5.4 0 0 1 21.3 12C19 16.6 12 21 12 21z"/></svg></button></div>' +
'<div class="course-body"><div class="meta"><span class="tag">' + esc(c.cat) + '</span><span class="tag lvl">' + c.level + '</span><span class="tag lvl">' + (c.lang === 'PT' ? 'Português' : 'Inglês') + '</span></div>' +
'<h3>' + highlight(c.title, filters.q) + '</h3><div class="platform">' + highlight(c.platform, filters.q) + '</div>' +
'<p class="desc">' + highlight(c.desc, filters.q) + '</p>' +
'<div class="course-foot"><span class="hours"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>~' + c.hours + ' h</span>' +
'<a class="link" href="' + esc(c.url) + '" target="_blank" rel="noopener noreferrer">Acessar <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a></div></div></article>';
}).join('');
emptyState.hidden = list.length > 0;
resultInfo.textContent = list.length === COURSES.length ? 'Mostrando todos os ' + COURSES.length + ' cursos' : 'Mostrando ' + list.length + ' de ' + COURSES.length + ' cursos';
}

function setCategory(cat) {
filters.cat = cat;
$$('button', catChips).forEach((b) => b.setAttribute('aria-selected', String(b.dataset.cat === cat)));
renderCourses();
}

catChips.addEventListener('click', (e) => {
const b = e.target.closest('button');
if (b) setCategory(b.dataset.cat);
});

let debounce;
searchInput.addEventListener('input', () => {
clearTimeout(debounce);
debounce = setTimeout(() => {
filters.q = searchInput.value;
renderCourses();
}, 160);
});

$('#levelFilter').addEventListener('change', (e) => { filters.level = e.target.value; renderCourses(); });
$('#langFilter').addEventListener('change', (e) => { filters.lang = e.target.value; renderCourses(); });
$('#sortFilter').addEventListener('change', (e) => { filters.sort = e.target.value; renderCourses(); });

function clearFilters() {
filters.q = '';
filters.level = 'all';
filters.lang = 'all';
filters.sort = 'featured';
searchInput.value = '';
$('#levelFilter').value = 'all';
$('#langFilter').value = 'all';
$('#sortFilter').value = 'featured';
setCategory('Todos');
}

$('#clearFilters').addEventListener('click', clearFilters);

grid.addEventListener('click', (e) => {
const b = e.target.closest('.fav');
if (b) toggleFav(b.dataset.id);
});

function searchFromHero(term) {
clearFilters();
filters.q = term;
searchInput.value = term;
renderCourses();
$('#cursos').scrollIntoView({ behavior: 'smooth' });
}

$('#heroSearch').addEventListener('submit', (e) => {
e.preventDefault();
const v = $('#heroInput').value.trim();
if (!v) {
$('#heroInput').focus();
toast('Digite um tema para buscar');
return;
}
searchFromHero(v);
});

$$('.hero-tags button').forEach((b) => b.addEventListener('click', () => {
$('#heroInput').value = b.dataset.search;
searchFromHero(b.dataset.search);
}));

let progress = store.get(PROG_KEY, {});
let activeTrail = TRAILS[0].id;
let recommended = store.get(QUIZ_KEY, null);
const trailTabs = $('#trailTabs');
const trailPanel = $('#trailPanel');

function trailDone(t) {
return (progress[t.id] || []).filter((id) => t.steps.some((s) => s.id === id)).length;
}

function trailPct(t) {
return Math.round((trailDone(t) / t.steps.length) * 100);
}

function updateHeroProgress() {
const avg = Math.round(TRAILS.reduce((sum, t) => sum + trailPct(t), 0) / TRAILS.length);
$('#heroProg').textContent = avg + '%';
}

function renderTrailTabs() {
trailTabs.innerHTML = TRAILS.map((t) => {
const pct = trailPct(t);
const rec = recommended === t.id ? ' · Recomendada' : '';
return '<button type="button" class="trail-tab" role="tab" id="tab-' + t.id + '" data-id="' + t.id + '" aria-selected="' + (t.id === activeTrail) + '" tabindex="' + (t.id === activeTrail ? 0 : -1) + '"><span class="trail-ico">' + t.glyph + '</span><span style="flex:1;min-width:0"><strong>' + esc(t.name) + '</strong><small>' + esc(t.short) + rec + '</small><span class="trail-bar"><i style="width:' + pct + '%"></i></span></span></button>';
}).join('');
}

function renderTrailPanel() {
const t = TRAILS.find((x) => x.id === activeTrail);
const done = progress[t.id] || [];
const pct = trailPct(t);
const hoursLeft = t.steps.filter((s) => !done.includes(s.id)).reduce((n, s) => n + s.h, 0);
const total = t.steps.reduce((n, s) => n + s.h, 0);
trailPanel.innerHTML = '<div class="trail-head"><div><h3>' + esc(t.name) + '</h3><p>' + esc(t.desc) + '</p></div><div class="ring" role="img" aria-label="' + pct + '% concluído"><svg width="104" height="104" viewBox="0 0 104 104"><circle class="bg" cx="52" cy="52" r="46"/><circle class="fg" cx="52" cy="52" r="46" style="stroke-dashoffset:' + (289 - (289 * pct) / 100) + '"/></svg><span>' + pct + '%</span></div></div>' +
'<div class="steps">' + t.steps.map((s, i) => {
const isDone = done.includes(s.id);
return '<div class="step' + (isDone ? ' done' : '') + '"><button type="button" class="step-check" data-step="' + s.id + '" role="checkbox" aria-checked="' + isDone + '" aria-label="Marcar etapa ' + (i + 1) + ' como concluída"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg></button><div class="step-body"><h4>' + (i + 1) + '. ' + esc(s.t) + '</h4><p>' + esc(s.d) + '</p><div class="step-meta"><span>~' + s.h + ' h</span><a class="link" href="' + esc(s.u) + '" target="_blank" rel="noopener noreferrer">' + esc(s.l) + ' <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a></div></div></div>';
}).join('') + '</div>' +
(pct === 100 ? '<div class="trail-done">Parabéns! Você concluiu a trilha de ' + esc(t.name) + '. Que tal escolher a próxima?</div>' : '') +
'<div class="trail-foot"><small>' + done.length + ' de ' + t.steps.length + ' etapas · faltam cerca de ' + hoursLeft + ' h de ' + total + ' h</small><button type="button" class="btn btn-ghost" id="resetTrail">Reiniciar trilha</button></div>';
}

function renderTrails() {
renderTrailTabs();
renderTrailPanel();
updateHeroProgress();
}

function selectTrail(id, focus) {
activeTrail = id;
renderTrails();
if (focus) {
const btn = $('.trail-tab[data-id="' + id + '"]', trailTabs);
if (btn) btn.focus();
}
}

trailTabs.addEventListener('click', (e) => {
const b = e.target.closest('.trail-tab');
if (b) selectTrail(b.dataset.id);
});

trailTabs.addEventListener('keydown', (e) => {
const keys = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'];
if (!keys.includes(e.key)) return;
e.preventDefault();
const idx = TRAILS.findIndex((t) => t.id === activeTrail);
const dir = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1;
selectTrail(TRAILS[(idx + dir + TRAILS.length) % TRAILS.length].id, true);
});

trailPanel.addEventListener('click', (e) => {
const check = e.target.closest('.step-check');
if (check) {
const t = TRAILS.find((x) => x.id === activeTrail);
const list = progress[t.id] || [];
const id = check.dataset.step;
const was = trailPct(t);
progress[t.id] = list.includes(id) ? list.filter((x) => x !== id) : list.concat(id);
store.set(PROG_KEY, progress);
renderTrails();
const now = trailPct(t);
if (now === 100 && was < 100) toast('Trilha concluída! Parabéns!');
const again = $('.step-check[data-step="' + id + '"]', trailPanel);
if (again) again.focus();
return;
}
if (e.target.closest('#resetTrail')) {
const t = TRAILS.find((x) => x.id === activeTrail);
progress[t.id] = [];
store.set(PROG_KEY, progress);
renderTrails();
toast('Trilha reiniciada');
}
});

const quizCard = $('#quizCard');
let quizIndex = 0;
let quizScores = {};
let quizHistory = [];

function renderQuiz() {
if (quizIndex >= QUIZ.length) return renderQuizResult();
const q = QUIZ[quizIndex];
const pct = (quizIndex / QUIZ.length) * 100;
quizCard.innerHTML = '<div class="quiz-top"><span>Pergunta ' + (quizIndex + 1) + ' de ' + QUIZ.length + '</span><span>' + Math.round(pct) + '%</span></div><div class="quiz-bar"><i style="width:' + pct + '%"></i></div>' +
'<h3 class="quiz-q">' + esc(q.q) + '</h3><div class="quiz-opts">' + q.o.map((o, i) => '<button type="button" class="quiz-opt" data-i="' + i + '" style="animation-delay:' + i * 60 + 'ms"><span class="k">' + 'ABCD'[i] + '</span><span>' + esc(o.t) + '</span></button>').join('') + '</div>' +
'<div class="quiz-nav">' + (quizIndex > 0 ? '<button type="button" class="btn btn-ghost" id="quizBack">Voltar</button>' : '<span></span>') + '</div>';
}

function renderQuizResult() {
const ranked = TRAILS.map((t) => ({ t, s: quizScores[t.id] || 0 })).sort((a, b) => b.s - a.s);
const top = ranked[0].t;
const max = Math.max(1, ranked[0].s);
recommended = top.id;
store.set(QUIZ_KEY, recommended);
renderTrailTabs();
quizCard.innerHTML = '<div class="quiz-result"><div class="trail-ico">' + top.glyph + '</div><small>Sua trilha ideal</small><h3>' + esc(top.name) + '</h3><p>' + esc(top.desc) + ' Esse resultado é só um ponto de partida: você pode explorar todas as trilhas quando quiser.</p>' +
'<div class="score">' + ranked.map((r) => '<div><span>' + esc(r.t.name.split(' ')[0] === 'Dados' ? 'Dados e IA' : r.t.name.replace('Desenvolvimento ', '').replace('Programação com ', '')) + '</span><i><b data-w="' + Math.round((r.s / max) * 100) + '"></b></i><span>' + Math.round((r.s / max) * 100) + '%</span></div>').join('') + '</div>' +
'<div class="result-actions"><button type="button" class="btn btn-primary" id="goTrail" data-id="' + top.id + '">Começar esta trilha</button><button type="button" class="btn btn-ghost" id="quizRestart">Refazer quiz</button></div></div>';
requestAnimationFrame(() => requestAnimationFrame(() => {
$$('.score b', quizCard).forEach((b) => { b.style.width = b.dataset.w + '%'; });
}));
}

quizCard.addEventListener('click', (e) => {
const opt = e.target.closest('.quiz-opt');
if (opt) {
const o = QUIZ[quizIndex].o[Number(opt.dataset.i)];
quizHistory.push(o.s);
Object.keys(o.s).forEach((k) => { quizScores[k] = (quizScores[k] || 0) + o.s[k]; });
quizIndex += 1;
renderQuiz();
return;
}
if (e.target.closest('#quizBack')) {
const last = quizHistory.pop();
Object.keys(last).forEach((k) => { quizScores[k] -= last[k]; });
quizIndex -= 1;
renderQuiz();
return;
}
if (e.target.closest('#quizRestart')) {
quizIndex = 0;
quizScores = {};
quizHistory = [];
renderQuiz();
return;
}
const go = e.target.closest('#goTrail');
if (go) {
selectTrail(go.dataset.id);
$('#trilhas').scrollIntoView({ behavior: 'smooth' });
}
});

const matTabs = $('#matTabs');
const matGrid = $('#matGrid');
let matFilter = 'Todos';

function renderMatTabs() {
matTabs.innerHTML = ['Todos'].concat(MAT_TYPES).map((t) => '<button type="button" role="tab" data-t="' + esc(t) + '" aria-selected="' + (t === matFilter) + '">' + esc(t) + '</button>').join('');
}

function renderMaterials() {
const list = MATERIALS.filter((m) => matFilter === 'Todos' || m.type === matFilter);
matGrid.innerHTML = list.map((m, i) => '<article class="mat" style="animation-delay:' + Math.min(i, 10) * 40 + 'ms"><div class="mat-top"><div class="mat-ico"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + MAT_ICONS[m.type] + '</svg></div><span class="tag">' + esc(m.type) + '</span></div><h3>' + esc(m.title) + '</h3><p>' + esc(m.desc) + '</p><a class="link" href="' + esc(m.url) + '" target="_blank" rel="noopener noreferrer">Abrir <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg></a></article>').join('');
}

matTabs.addEventListener('click', (e) => {
const b = e.target.closest('button');
if (!b) return;
matFilter = b.dataset.t;
renderMatTabs();
renderMaterials();
});

const oppChips = $('#oppChips');
const oppList = $('#oppList');
let oppFilter = 'Todos';

function renderOppChips() {
oppChips.innerHTML = ['Todos'].concat(OPP_TYPES).map((t) => {
const n = t === 'Todos' ? OPPS.length : OPPS.filter((o) => o.type === t).length;
return '<button type="button" role="tab" data-t="' + esc(t) + '" aria-selected="' + (t === oppFilter) + '">' + esc(t) + '<span class="n">' + n + '</span></button>';
}).join('');
}

function renderOpps() {
const list = OPPS.filter((o) => oppFilter === 'Todos' || o.type === oppFilter);
oppList.innerHTML = list.map((o, i) => '<article class="opp" style="animation-delay:' + Math.min(i, 10) * 45 + 'ms"><div class="opp-ico">' + esc(o.g) + '</div><div><span class="tag">' + esc(o.type) + '</span><h3>' + esc(o.title) + '</h3><div class="org">' + esc(o.org) + '</div><p>' + esc(o.desc) + '</p></div><a class="btn btn-ghost" href="' + esc(o.url) + '" target="_blank" rel="noopener noreferrer">Saiba mais</a></article>').join('');
}

oppChips.addEventListener('click', (e) => {
const b = e.target.closest('button');
if (!b) return;
oppFilter = b.dataset.t;
renderOppChips();
renderOpps();
});

const faqList = $('#faqList');
faqList.innerHTML = FAQS.map((f, i) => '<div class="faq-item"><button type="button" class="faq-q" id="faq-q' + i + '" aria-expanded="false" aria-controls="faq-a' + i + '"><span>' + esc(f.q) + '</span><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></button><div class="faq-a" id="faq-a' + i + '" role="region" aria-labelledby="faq-q' + i + '"><div><p>' + esc(f.a) + '</p></div></div></div>').join('');

faqList.addEventListener('click', (e) => {
const q = e.target.closest('.faq-q');
if (!q) return;
const item = q.parentElement;
const open = !item.classList.contains('open');
$$('.faq-item', faqList).forEach((it) => {
it.classList.remove('open');
$('.faq-q', it).setAttribute('aria-expanded', 'false');
});
if (open) {
item.classList.add('open');
q.setAttribute('aria-expanded', 'true');
}
});

const form = $('#contactForm');
const formOk = $('#formOk');
const rules = {
fName: (v) => (v.trim().length >= 3 ? '' : 'Informe seu nome (mínimo de 3 letras).'),
fEmail: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Informe um e-mail válido.'),
fInterest: (v) => (v ? '' : 'Escolha uma área de interesse.'),
fTerms: (_v, el) => (el.checked ? '' : 'É necessário aceitar para continuar.')
};

function validateField(id) {
const el = $('#' + id);
const msg = rules[id](el.value, el);
const err = $('.err[data-for="' + id + '"]', form);
err.textContent = msg;
const wrap = el.closest('.field');
if (wrap) wrap.classList.toggle('invalid', Boolean(msg));
el.setAttribute('aria-invalid', String(Boolean(msg)));
return !msg;
}

Object.keys(rules).forEach((id) => {
const el = $('#' + id);
el.addEventListener('blur', () => validateField(id));
el.addEventListener('input', () => {
if (el.getAttribute('aria-invalid') === 'true') validateField(id);
});
});

form.addEventListener('submit', (e) => {
e.preventDefault();
formOk.hidden = true;
const results = Object.keys(rules).map(validateField);
if (results.includes(false)) {
const firstBad = Object.keys(rules).find((id) => $('#' + id).getAttribute('aria-invalid') === 'true');
if (firstBad) $('#' + firstBad).focus();
return;
}
const leads = store.get(LEADS_KEY, []);
const name = $('#fName').value.trim();
leads.push({ name, email: $('#fEmail').value.trim(), interest: $('#fInterest').value, at: new Date().toISOString() });
store.set(LEADS_KEY, leads);
form.reset();
Object.keys(rules).forEach((id) => $('#' + id).setAttribute('aria-invalid', 'false'));
formOk.textContent = 'Obrigado, ' + name.split(' ')[0] + '! Seu interesse foi registrado. Este é um protótipo acadêmico e os dados ficam apenas neste navegador.';
formOk.hidden = false;
toast('Cadastro registrado com sucesso');
});

document.addEventListener('keydown', (e) => {
if (e.key === 'Escape') {
closeDrawer();
closeMenu();
return;
}
const tag = (document.activeElement && document.activeElement.tagName) || '';
if (e.key === '/' && !['INPUT', 'SELECT', 'TEXTAREA'].includes(tag)) {
e.preventDefault();
$('#cursos').scrollIntoView({ behavior: 'smooth' });
setTimeout(() => searchInput.focus({ preventScroll: true }), 400);
}
});

$('#year').textContent = new Date().getFullYear();

buildCatChips();
renderCourses();
renderTrails();
renderMatTabs();
renderMaterials();
renderOppChips();
renderOpps();
renderQuiz();
updateFavUI();
})();
