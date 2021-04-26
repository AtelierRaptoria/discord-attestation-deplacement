<h1 align="center">Remplir automatiquement une attestation dérogatoire de déplacement avec un bot Discord 📝</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="https://www.gnu.org/licenses/gpl-3.0.html" target="_blank">
    <img alt="License: GNU GPLv3" src="https://img.shields.io/badge/License-GNU GPLv3-yellow.svg" />
  </a>
  <a href="https://twitter.com/AtelierRaptoria" target="_blank">
    <img alt="Twitter: AtelierRaptoria" src="https://img.shields.io/twitter/follow/AtelierRaptoria.svg?style=social" />
  </a>
</p>

> Avec votre bot Discord, vous pourrez remplir automatiquement vos attestations de déplacement en quelques secondes<br />
Tutoriel : [https://raptoria.fr/informatique/discord-attestation-deplacement](https://raptoria.fr/informatique/discord-attestation-deplacement)

> :warning: Puisque les attestations de déplacement dérogatoire demandent des informations personnelles, il est très fortement recommandé d'utiliser un bot privé qui sera utilisé sur un serveur privé.

## 💻 Installation

```sh
git clone https://gitlab.com/AtelierRaptoria/discord-attestation-deplacement.git
cd discord-attestation-deplacement
npm i
```

## ⚙️ Configuration
Pour que votre bot fonctionne correctement, vous avez 2 fichiers à modifier :
1. le fichier `config.json`
2. le fichier `data/users.json`

Le fichier `config.json` contient le token de votre bot ainsi que le salon dans lequel il doit générer les attestations (et écouter vos requêtes).

Le fichier `data/users.json` contient les informations personnelles (date de naissance, adresse, etc.) des membres du serveur.

## ✏️ Configuration avancée

Si vous le souhaitez, vous pouvez modifier les dialogues et emojis utilisés par le bot en modifiant les variables situées en début de script. Vous pouvez également ajouter des phrases pour déclencher le bot dans un des fichiers texte présents dans `data/deplacements`.


## 📘 Usage

```sh
pm2 start index.js
```


## ❓ Un problème, une question ?

En cas de problème, veuillez jeter un coup d'oeil sur [page des tickets](https://gitlab.com/AtelierRaptoria/discord-attestation-deplacement/-/issues).<br />Si vous ne trouvez pas la réponse à votre problème ou votre question, n'hésitez pas à ouvrir un nouveau ticket.

## 🤝 Contributions

Les contributions et suggestions sont les bienvenues !<br />Rendez-vous sur la [page des tickets](https://gitlab.com/AtelierRaptoria/discord-attestation-deplacement/-/issues).

## 🤩 Soutenir ce projet

Si ce projet vous a plu, n'hésitez pas à lui donner une ⭐️ !

## 💃 Raptoria

- Site web : [raptoria.fr](https://raptoria.fr)
- Twitter : [@AtelierRaptoria](https://twitter.com/AtelierRaptoria)
- Gitlab : [@AtelierRaptoria](https://gitlab.com/AtelierRaptoria)
- Github : [@AtelierRaptoria](https://github.com/AtelierRaptoria)

## 📝 License

Ce projet est sous licence [GNU GPLv3](https://www.gnu.org/licenses/gpl-3.0.html).
