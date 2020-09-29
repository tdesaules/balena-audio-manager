# BALENA AUDIO MANAGER

## Introduction

Introduction

## Getting Started

Installation process to init the app.

Create root folder

```
mkdir BalenaAudioManager
cd BalenaAudioManager
```

Init webpack base

```
npm init -y
npm install --save-dev webpack webpack-cli webpack-dev-server html-webpack-plugin clean-webpack-plugin webpack-merge
npm install --save-dev html-loader
npm install --save-dev node-sass sass-loader css-loader style-loader mini-css-extract-plugin
npm install --save-dev materialize-css@next
npm install --save-dev babel-loader @babel/core @babel/preset-env
```

Init Svelte framework

```
npm install --save-dev svelte svelte-loader svelte-preprocess
```

Prepare GraphQL client

```
npm install --save-dev apollo-boost graphql svelte-apollo
```

Node.js / Koa.js

```
npm install --save-dev koa koa-static koa-webpack socket.io socket.io-client @types/socket.io-client
npm install --save-dev node-fetch
```

Install Balena SDK

```
npm install --save-dev balena-sdk
```

Install Json RPC client
```
npm install --save-dev node-fetch
npm install --save-dev jsonrpc-lite
```

## Build and Test

Export mandatory Balena var

```
export BALENACLOUD_API_URL=https://api.balena-cloud.com/
export BALENACLOUD_API_KEY=kJBE6SPqbrQHKPX9b0nGkPVPlEGX6Cj8
export SNAPCAST_DEVICE_NAME=chambre
export BALENA_APP_NAME=Audio
export BALENA_DEVICE_NAME_AT_INIT=chambre
```

## Pipeline CI/CD



## Contribute

- tdesaules@outlook.com

## Ressource

- <https://webpack.js.org/>
- <https://pugjs.org/>
- <https://bulma.io/>
- <https://svelte.dev/>
- <https://github.com/sveltejs/svelte-loader>
- <https://github.com/sveltejs/template-webpack/blob/master/public/index.html>
- <https://github.com/kaisermann/svelte-preprocess/>
