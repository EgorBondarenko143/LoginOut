const connectionDB = require('./connectionDB')

module.exports = {
    socketHandling: (socket, io) => {
        //ОБРАБОТКА ПЕРВИЧНОГО ПОДКЛЮЧЕНИЯ КЛИЕНТА
        console.log('New client connected');

        const messageFromDB = ''
        const SQL_QUERY = `SELECT * FROM general_chat`
        connectionDB.query(SQL_QUERY, (err, responseFromDB) => {
            if (err) { notifyClients(socket, 'База данных недоступна') }
            else {
                responseFromDB.forEach(messageFromDB => {
                    socket.emit('message', messageFromDB)
                });
            }
        })

        // io.emit()
        // socket.emit()

        // ОБРАБОТКА ОТКЛЮЧЕНИЯ КЛИЕНТА
        socket.on('disconnect', () => { console.log('cllient disconnected'); })
    },

    notifyClients: (io, newMessage) => {
        io.emit('message', newMessage)
    },

    getDateNow: () => {
        let now = new Date()
        let hours = (now.getHours() < 10) ? '0' + now.getHours() : now.getHours();
        let minutes = (now.getMinutes() < 10) ? '0' + now.getMinutes() : now.getMinutes();
        return hours + ':' + minutes
    }
}