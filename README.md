<div align="center">
    <a href="https://insagenda.fr/">
        <img src="https://insagenda.fr/assets/logo/logo.svg" alt="INSAgenda's logo" width="80" height="80">
    </a>
    <h3 align="center">INSAgenda (frontend)</h3>
    <p align="center">
        Insagenda is a free website, open source, to consult the timetable at INSA Rouen.<br/>
        <a href="https://insagenda.fr/"><b>Explore our website »</b></a><br/><br/>
    </p>
</div>

## Table of contents

1. [About](#about)
2. [Usage](#usage)
    - [Serving](#serving)
    - [Preprocessing](#preprocessing)
3. [Contributing](#contributing)
    - [Recommandations](#recommandations)
    - [License](#license)

## About

This repository contains all static files hosted on [INSAgenda](https://insagenda.fr/) expect files under the `/agenda` scope. These are in [web-app](https://github.com/INSAgenda/web-app). The backend is closed-source.

## Usage

### Serving

We use a closed-source backend to serve the files. You can download a debug version of the backend [here](https://insagenda.fr/development/backend.tar.gz). It will require a valid database. There is a downloadable empty database [here](https://insagenda.fr/development/database). You will need SQLite3 installed.  
All the files in this repository are expected by our backend to be contained next to it in a `files` folder.
  
We have more in-depth explanations in [the web-app repository](https://github.com/INSAgenda/web-app).

### Preprocessing

There is a list of code snippets in `common-code`. These snippets will be processed by our backend at startup. All occurences of `[COMMON-CODE-WHATEVER]` will be replaced by the content of the file at `/common-code/whatever`. As a result, **you have to relaunch the server each time you want to test changes** in your browser. This unpractical behavior will change in the future. 

## Contributing

### Recommandations

We currently do not have ready-to-use documentation for our endpoints.  
If you need any information, feel free to ask on [our discord server](https://discord.gg/TpdbUyfcbJ).

### License

This project is unlicensed. This means the source code is protected by copyright laws in the most restrictive way.  
You can read the code and contribute to it, but you mustn't use it for any other purpose. This is especially true for INSA, as we give them no right whatsoever on our project. We think it's like we worked for them for free and they owe us money.
