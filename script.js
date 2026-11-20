var V=["identifier","distinguer","comparer","produire","justifier","expliquer","classer","décrire","argumenter","construire","calculer","analyser","résoudre","citer","formuler","schématiser","définir","présenter","illustrer","évaluer","appliquer","situer","reconnaître","rédiger"];
var BAD={"comprendre":"expliquer","savoir":"identifier","connaître":"citer","connaitre":"citer","apprendre":"formuler","découvrir":"décrire","decouvrir":"décrire"};
var COL={Introduction:"#c27a1a",Activités:"#1f6f5c",Évaluation:"#3a62a8",Conclusion:"#7a4a9c"};

var ACT=[
{m:"Binômes",t:"Tri de cartes",d:function(x){return "Chaque binôme reçoit des cartes sur « "+x+" » à classer en deux ou trois catégories, puis justifie son classement à l’oral.";},c:"Distribuer les cartes, circuler, relever les hésitations.",tr:"Tableau de classement complété",mat:"Cartes à découper"},
{m:"Groupes",t:"Jeu de rôle « Le conseil »",d:function(x){return "Chaque groupe défend un point de vue ou une option liés à « "+x+" » devant un conseil fictif qui doit trancher.";},c:"Attribuer un rôle par groupe, fixer 3 min de préparation puis 2 min de plaidoyer.",tr:"Fiche d’arguments du groupe",mat:"Fiches rôle"},
{m:"Débat",t:"Débat mouvant",d:function(x){return "Affirmation provocante sur « "+x+" » : les élèves se placent « d’accord / pas d’accord » dans la salle et argumentent, avec droit de changer de camp.";},c:"Lire l’affirmation, distribuer la parole, reformuler les arguments.",tr:"Trois arguments notés par élève",mat:"Aucun"},
{m:"Individuel",t:"Recherche guidée",d:function(x){return "Chaque élève exploite un court document (texte, schéma ou tableau) sur « "+x+" » et répond à 3 questions de prélèvement et d’interprétation.";},c:"Fournir le document, proposer un coup de pouce aux élèves en difficulté.",tr:"Réponses écrites aux 3 questions",mat:"Document imprimé ou projeté"},
{m:"Jeu",t:"Quiz par équipes",d:function(x){return "Course de questions sur « "+x+" » : une équipe marque des points en justifiant sa réponse, avec bonus pour l’explication.";},c:"Préparer 8 questions graduées, tenir le score au tableau.",tr:"Bilan des points et erreurs fréquentes",mat:"Ardoises ou feuilles"},
{m:"Groupes",t:"Production collective",d:function(x){return "Chaque groupe réalise une affiche ou une carte mentale synthétisant un aspect de « "+x+" », puis un rapporteur la présente.";},c:"Répartir les sous-thèmes, imposer un temps de présentation.",tr:"Affiche ou schéma du groupe",mat:"Grandes feuilles, feutres"},
{m:"Mise en situation",t:"Étude de cas",d:function(x){return "Une situation concrète liée à « "+x+" » est proposée : les élèves proposent et justifient une décision ou une solution.";},c:"Présenter le cas en 2 minutes, laisser chercher, confronter les solutions.",tr:"Solution justifiée par écrit",mat:"Fiche cas"},
{m:"Binômes",t:"Pensez-échangez-partagez",d:function(x){return "Question ouverte sur « "+x+" » : réflexion seul, échange à deux, puis mise en commun à la classe.";},c:"Chronométrer chaque temps (1 min, 2 min, mise en commun).",tr:"Phrase de synthèse du binôme",mat:"Aucun"}
];
var EV=[
{t:"Mini-quiz de 5 questions",d:"Quiz individuel couvrant chaque objectif, correction rapide en classe.",tr:"Copie corrigée"},
{t:"Production courte",d:"Un paragraphe ou un schéma qui mobilise les notions de la séance.",tr:"Production écrite"},
{t:"Billet de sortie",d:"Chaque élève note 3 choses apprises et 1 question restée en suspens.",tr:"Billet remis à l’enseignant"}
];
var INTRO=[
function(x){return "Accroche : image, objet ou question surprenante sur « "+x+" », puis annonce des objectifs.";},
function(x){return "Rappel de la séance précédente par 2 questions flash, puis question-problème sur « "+x+" ».";},
function(x){return "Remue-méninges : que savons-nous déjà sur « "+x+" » ? Recueil des représentations au tableau.";}
];
var CONC=[
"Synthèse collective (carte mentale ou trace écrite), retour sur la question de départ et ouverture vers la séance suivante.",
"Chaque élève reformule l’essentiel en une phrase ; l’enseignant fixe la trace écrite et annonce la suite.",
"Retour aux représentations de départ : qu’est-ce qui a changé ? Consignes pour la prochaine séance."
];

var seed=0;
function $(i){return document.getElementById(i);}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
function pick(a,i){return a[((i%a.length)+a.length)%a.length];}

function split(T,n){var b=Math.floor(T/n),r=T-b*n,o=[];for(var i=0;i<n;i++)o.push(b+(i<r?1:0));return o;}

function build(){
 var theme=$("theme").value.trim()||"le thème",T=Math.max(15,parseInt($("duree").value)||55),niv=$("niveau").value.trim(),eff=parseInt($("eff").value)||0,mat=$("mat").value;
 var objs=$("obj").value.split("\n").map(function(s){return s.trim();}).filter(Boolean);
 var prog=$("prog").value.split("\n").map(function(s){return s.trim();}).filter(Boolean);
 var intro=Math.max(3,Math.round(T*.08)),concl=Math.max(3,Math.round(T*.08)),ev=Math.max(4,Math.round(T*.15));
 var act=T-intro-concl-ev,n=T<=35?1:T<=75?2:T<=110?3:4;
 while(act/n<8&&n>1)n--;
 var parts=split(act,n),t=0,rows=[];
 rows.push({ph:"Introduction",min:intro,titre:"Accroche et objectifs",d:pick(INTRO,seed)(theme),m:"Classe entière",c:"Afficher les objectifs reformulés au tableau.",tr:"Question-problème notée",mat:"Tableau"});
 var last="",k=seed;
 for(var i=0;i<n;i++){
  var a,g=0;do{a=pick(ACT,k++);g++;}while((a.m===last||(mat==="min"&&a.mat!=="Aucun"&&a.mat!=="Fiches rôle"&&g<10)||(eff>0&&eff<8&&a.m==="Groupes"&&g<10))&&g<10);
  last=a.m;
  rows.push({ph:"Activités",min:parts[i],titre:"Activité "+(i+1)+" : "+a.t,d:a.d(theme),m:a.m+(a.m==="Groupes"&&eff>=8?" (groupes de "+(eff>=24?4:3)+")":""),c:a.c,tr:a.tr,mat:a.mat});
 }
 var e=pick(EV,seed);
 rows.push({ph:"Évaluation",min:ev,titre:e.t,d:e.d,m:"Individuel",c:"Ramasser les productions ; repérer les objectifs non atteints.",tr:e.tr,mat:"Feuilles"});
 rows.push({ph:"Conclusion",min:concl,titre:"Synthèse et ouverture",d:pick(CONC,seed),m:"Classe entière",c:"Garder 1 minute pour les consignes de fin de séance.",tr:"Trace écrite finale",mat:"Tableau"});
 rows.forEach(function(r){r.a=t;t+=r.min;r.b=t;});
 return {theme:theme,T:T,niv:niv,objs:objs,prog:prog,rows:rows};
}

function objHtml(p){
 return p.objs.map(function(o){
  var w=o.split(/\s+/)[0].toLowerCase(),txt=o,note="";
  if(BAD[w]){note="<div class=\"warn\">« "+esc(w)+" » n’est pas observable : essayez « "+BAD[w]+" ».</div>";}
  else if(V.indexOf(w)<0){note="<div class=\"warn\">Commencez plutôt par un verbe d’action observable (identifier, comparer, produire…).</div>";}
  var match="";
  if(p.prog.length){
   var ws=o.toLowerCase().split(/[^a-zàâçéèêëîïôûùüÿ]+/).filter(function(x){return x.length>4;}),best=null,bs=0;
   p.prog.forEach(function(l){var s=0,ll=l.toLowerCase();ws.forEach(function(x){if(ll.indexOf(x.slice(0,Math.max(5,x.length-2)))>-1)s++;});if(s>bs){bs=s;best=l;}});
   match=best?"<div class=\"mu\">↳ Programme : <span class=\"tag\">"+esc(best)+"</span></div>":"<div class=\"warn\">Aucune correspondance trouvée dans l’extrait : à vérifier manuellement.</div>";
  }
  return "<li>"+esc(txt)+note+match+"</li>";
 }).join("");
}

function render(){
 var p=build(),o=$("out");
 var bar=p.rows.map(function(r){return "<div style=\"width:"+(r.min/p.T*100)+"%;background:"+COL[r.ph]+"\" title=\""+r.ph+" "+r.min+" min\">"+r.min+"′</div>";}).join("");
 var tb=p.rows.map(function(r,i){return "<tr><td><strong>"+r.a+"–"+r.b+"</strong><br><span class=\"mu\">"+r.min+" min</span></td><td><span class=\"tag\" style=\"color:"+COL[r.ph]+"\">"+r.ph+"</span></td><td><strong>"+esc(r.titre)+"</strong><br>"+esc(r.d)+"</td><td>"+esc(r.m)+"</td></tr>";}).join("");
 var det=p.rows.map(function(r){return "<div class=\"ph\" style=\"border-color:"+COL[r.ph]+"\"><h3>"+r.a+"–"+r.b+" min · "+esc(r.titre)+"</h3><p><strong>Modalité :</strong> "+esc(r.m)+"</p><p><strong>Consigne enseignant :</strong> "+esc(r.c)+"</p><p><strong>Matériel :</strong> "+esc(r.mat)+"</p><p><strong>Trace attendue :</strong> "+esc(r.tr)+"</p></div>";}).join("");
 var half=Math.round(p.T*.1);
 o.innerHTML="<div class=\"row noprint\" style=\"justify-content:space-between\"><h2 style=\"margin:0\">"+esc(p.theme)+"</h2><div class=\"row\"><button id=\"re\">🔄 Autres activités</button><button id=\"cp\">Copier</button><button id=\"pr\">Imprimer</button></div></div><p class=\"mu\">"+esc(p.niv)+" · "+p.T+" min</p><div class=\"bar\">"+bar+"</div>"
 +"<h3>Objectifs</h3><ol>"+objHtml(p)+"</ol>"
 +"<h3>Déroulé minuté</h3><div class=\"scroll\"><table><tr><th>Temps</th><th>Phase</th><th>Activité</th><th>Modalité</th></tr>"+tb+"</table></div>"
 +"<h3>Détail par phase</h3>"+det
 +"<h3>Différenciation</h3><p><strong>Élèves en difficulté :</strong> fournir un exemple résolu ou un lexique, réduire la tâche à un objectif, former des binômes tutorés.<br><strong>Élèves avancés :</strong> ajouter une question de transfert ou demander de créer eux-mêmes une question pour la classe.</p>"
 +"<h3>Plan B si la séance prend du retard</h3><p>Raccourcir la dernière activité d’environ "+half+" min, la transformer en démonstration par l’enseignant, et reporter l’évaluation en billet de sortie.</p>";
 o.className="card";
 $("re").onclick=function(){seed++;render();};
 $("pr").onclick=function(){window.print();};
 $("cp").onclick=function(){
  var txt=p.theme+" ("+p.niv+", "+p.T+" min)\n\n"+p.rows.map(function(r){return r.a+"–"+r.b+" min | "+r.ph+" | "+r.titre+" | "+r.m+"\n"+r.d;}).join("\n\n");
  try{navigator.clipboard.writeText(txt).then(function(){$("cp").textContent="Copié ✓";});}catch(e){var ta=document.createElement("textarea");ta.value=txt;document.body.appendChild(ta);ta.select();try{document.execCommand("copy");$("cp").textContent="Copié ✓";}catch(x){}document.body.removeChild(ta);}
 };
 o.scrollIntoView({behavior:"smooth",block:"start"});
}
$("gen").onclick=function(){
 var m=[];
 if(!$("theme").value.trim())m.push("le thème");
 if(!(parseInt($("duree").value)>=15))m.push("la durée (15 min minimum)");
 if(!$("niveau").value.trim())m.push("le niveau");
 if(!$("obj").value.trim())m.push("au moins un objectif");
 var e=$("err");
 if(m.length){e.textContent="Veuillez renseigner : "+m.join(", ")+".";e.className="warn";return;}
 e.className="warn hide";seed=0;render();
};
