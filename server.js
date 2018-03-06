const express = require('express');
const bodyParser = require('body-parser');

const knex = require('./database/db.js');

const server = express();

server.use(bodyParser.json());

// endpoints here
server.get('/', (req, res) => {
	res.status(200).json({ api: 'running...' });
});

server.get('/zoos/:id', (req, res) => {
	const { id } = req.params;
	knex('zoos')
		.where('id', id)
		.then(zoos => {
			if (zoos.length > 0) {
				res.status(200).json(zoos);
			} else {
				res.status(404).json({ msg: `Zoo with id: ${id} does not exist.` });
			}
		})
		.catch(err => {
			res.status(500).json({ msg: 'Error retrieving the Zoo.' });
		});
});

server.get('/zoos', (req, res) => {
	knex('zoos')
		.then(zoos => {
			res.status(200).json(zoos);
		})
		.catch(err => {
			res.status(500).json({ msg: 'Error retrieving the Zoos.' });
		});
});

server.post('/zoos', (req, res) => {
	const zoo = req.body;

	knex
		.insert(zoo)
		.into('zoos')
		.then(ids => {
			res.status(201).json(ids);
		})
		.catch(err => {
			res.status(500).json({ msg: 'Zoo not added to zoos Table.' });
		});
});

server.put('/zoos/:id', (req, res) => {
	const { id } = req.params;
	const updatedName = req.body.name;

	knex('zoos')
		.where({ id })
		.update({
			name: updatedName
		})
		.then(zoo => {
			res.status(200).json(zoo);
		})
		.catch(err => {
			res.status(500).json({ msg: `Could not update zoo id: ${id}.` });
		});
});

server.delete('/zoos/:id', (req, res) => {
	const { id } = req.params;

	knex('zoos')
		.where({ id })
		.then(zoo => {
			if (zoo.length > 0) {
				knex('zoos')
					.where({ id })
					.del()
					.then(success => {
						res.status(200).json({
							msg: `Zoo with id: ${id} successfully deleted. Say goodbye. :-(`
						});
					})
					.catch(err => {
						res.status(500).json({ msg: `Could not delete zoo id: ${id}.` });
					});
			} else {
				res.status(404).json({ msg: `Zoo with id: ${id} does not exist.` });
			}
		});
});

server.post('/bears', (req, res) => {
	const bear = req.body;

	knex
		.insert(bear)
		.into('bears')
		.then(ids => {
			res.status(201).json(ids);
		})
		.catch(err => {
			res.status(500).json({ msg: 'Bear not added to Bears Table.' });
		});
});

const port = 3000;
server.listen(port, function() {
	console.log(`Server Listening on ${port}`);
});
