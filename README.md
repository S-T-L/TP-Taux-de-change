# Taux de Change

Application web de conversion de devises en temps réel. Elle permet de convertir des montants depuis le **Franc CFP (XPF)** vers 12 devises internationales.

---

## Aperçu

<img width="1315" height="831" alt="tdc" src="https://github.com/user-attachments/assets/978a4e56-a8fd-4355-b3ca-0f0fa8cda3df" />

---

## Technologies

- Vue 3
- Vue Router
- ExchangeRate-API

---

## Installation

```bash
git clone <url-du-repo>
cd <nom-du-repo>
npm install
```

Créer un fichier `.env` à la racine avec votre clé API :

```
VUE_APP_EXCHANGE_API_KEY=votre_clé_api_ici
```

> Clé gratuite disponible sur [exchangerate-api.com](https://www.exchangerate-api.com/)

---

## Lancer l'application

```bash
npm run serve
```

Accessible sur [http://localhost:8080](http://localhost:8080)

---

## Utilisation

1. Saisir un montant
2. Sélectionner la devise source
3. Les montants convertis s'affichent pour toutes les devises disponibles

L'application propose deux onglets illustrant les deux approches de Vue 3 :
- **Options API** — route `/`
- **Composition API** — route `/composition`
