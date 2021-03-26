
# Projet 7 OpenClassroom

### Lancement du projet :
- Copier le fichier .env.exemple et renommer le .env
- Créer une base de donnée MySql en amont et ajouter les informations de connexion dans le fichier .env comme dans le .env.exemple
- Allez dans le dossier backend et lancer la commande "npm install && npm server"
- Allez dans le dossier front-end et lancer la commande "npm install && npm run build"

Site testé en production avec un serveur Apache:
Veuillez ajouter dans le VirtualHost de votre fichier .conf lié a votre domaine le code suivant :

```apache
<Directory /> 
	RewriteEngine  On
	RewriteCond  %{REQUEST_FILENAME} !-d
	RewriteCond  %{REQUEST_FILENAME} !-f
	RewriteRule ^ index.html [L]  
</Directory>
```

#### Pour utiliser le Front:
Le front a été développé depuis un serveur Apache et pour le faire correctement fonctionner, ajouter les lignes suivantes dans votre fichier .conf de votre domaine.

### Librairies utilisées :
#### Back-End :
- Crypto JS (pour crypter certain champs)
- Bcrypt (pour crypter les mots de passes)
- Maria DB (base de donnée)
- JsonWebToken

#### Front-End :
- React
- React Router
- Bootstrap

### Scénario
Vous êtes développeur depuis plus d'un an chez  **CONNECT-E**, une petite agence web regroupant une douzaine d'employés.

Votre directrice, Stéphanie, invite toute l'agence à prendre un verre pour célébrer une bonne nouvelle ! Elle vient de signer un contrat pour un nouveau projet ambitieux ! 🥂

Le client en question est  **Groupomania**, un groupe spécialisé dans la grande distribution et l'un des plus fidèles clients de l'agence.

[![Le logo de Groupomania](https://user.oc-static.com/upload/2019/09/04/15676009353158_image2.png)](https://user.oc-static.com/upload/2019/09/04/15676009353158_image2.png)

Le logo de Groupomania

Le projet consiste à construire un  **réseau social interne**  pour les employés de Groupomania. Le but de cet outil est de faciliter les interactions entre collègues. Le département RH de Groupomania a laissé libre cours à son imagination pour les fonctionnalités du réseau et a imaginé plusieurs briques pour favoriser les échanges entre collègues.

Stéphanie vous envoie un message via l’outil de messagerie instantanée de l’entreprise.

> Stéphanie : Hello, comme tu le sais, nous démarrons un très beau projet avec Groupomania et j’aimerais que ce soit toi qui gères la partie développement.
> Stéphanie : Groupomania a déjà réfléchi aux fonctionnalités à intégrer dans le réseau social. Il s’agit en fait de produits déjà existants :
9GAG - ils veulent que les employés partagent et commentent les gifs avec d'autres collègues ;
Reddit - ils veulent que les employés écrivent et/ou partagent des articles avec leurs collègues sur des sujets qui les intéressent.
> Vous : Super, je prends note. Est-ce qu’ils t’ont fourni les spécifications fonctionnelles ?
> Stéphanie : Oui, je te les envoie par mail tout de suite :)]