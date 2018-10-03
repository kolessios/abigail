const debug = require('debug')('abigail:http-server')
const http = require('express')()
const ActionsManager = require('../Core/ActionsManager')
const actions = require('../Core/Actions')

class HttpServer {
    constructor() {
        this.host = process.env.HTTPSERVER_BIND
        this.port = process.env.HTTPSERVER_PORT
    }

    boot() {
        this.routes()

        http.listen(this.port, this.host, () => {
            debug(`[${this.host}:${this.port}] API`)
        })
    }

    routes() {
        http.get('/', (req, res) => res.send('Abigaíl Home Assistant API'))

        for (let action of actions) {
            http.get(`/actions${action.path}`, (req, res) => {
                ActionsManager.exec(action.command, req.params.value)
                res.end()
            })
        }
    }
}

module.exports = new HttpServer()