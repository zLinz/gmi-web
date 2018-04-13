## install
    ``` npm install -g gmi-web

## start <project_name>
    ``` gmi-web start <project_name> && cd <project_name>

## install babel-loader package
    ``` npm install or yarn install

## run
    ``` gmi-web serve

## page <pagename>
    ``` gmi-web page pagename  (create relating page's file but need to import to main.scss yourself)

## build
    ``` gmi-web build

## localhost <port>
    ``` gmi-web localhost 8080  (open a server bases in current directory)

## suport
    ``` Mac\Windows\Linux

## contact
    ``` linzhizhao790086754@gmail.com

## brief document
    1. src/assets -> dist/assets (watch supported)
    2. src/js -> dist/js (webpack build && watch supported)
    3. src/lib -> dist/lib (watch supported)
    4. src/pages -> dist (watch supported && root directory)
    5. src/scss/pages/main.scss -> dist/css/style.min.css (watch supported && so all of your scss file needed to be imported into main.scss file)
    6. put all the dist file into your server, and open your browser.

## notice
    1. src/js/tool、src/js/pages、src/scss/pages/main.scss and src/pages/includes can't be deleted.