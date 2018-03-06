const express = require("express");
const bodyParser = require("body-parser");

const knex = require("./database/db.js");
const zooRouter = require("./zoos/zooRouter.js");

const server = express();

server.use(bodyParser.json());

// endpoints here
server.get("/", (req, res) => {
	res.status(200).json({ api: "running..." });
});

server.use("/zoos", zooRouter);

server.post("/bears", (req, res) => {
	const { zoo_id, species, latinName } = req.body;
	const bear = { zoo_id, species, latinName };
	knex
		.insert(req.body)
		.into("bears")
		.then(id => {
			res.status(200).json(id);
		})
		.catch(err => {
			res.status(500).json({ msg: "Could not retrieve any bears." });
		});
});

server.get("/bears", (req, res) => {
	knex("bears")
		.then(bears => {
			if (bears.length > 0) {
				res.status(200).json(bears);
			} else {
				res.status(404).json({ msg: `Bear id: ${id} not found.` });
			}
		})
		.catch(err => {
			res.status(500).json({ err: "Error getting bears. Sorry." });
		});
});

server.get("/bears/:id", (req, res) => {
	const { id } = req.params;
	knex("bears")
		.where({ id })
		.then(bear => {
			if (bear.length > 0) {
				res.status(200).json(bear);
			} else {
				res.status(404).json({ msg: `Bear with id: ${id} not found.` });
			}
		})
		.catch(err => {
			res.status(500).json({ err: "Error getting the bear." });
		});
});

server.put("/bears/:id", (req, res) => {
	const { id } = req.params;
	const updatedBear = req.body;
	knex("bears")
		.where({ id })
		.then(bear => {
			if (bear.length > 0) {
				knex("bears")
					.where({ id })
					.update(updatedBear)
					.then(newBear => {
						knex("bears")
							.where({ id })
							.then(bear => {
								res.status(200).json(bear);
							})
							.catch(err => {
								res
									.status(404)
									.json({ msg: `Error finding updated Bear id: ${id}` });
							});
					})
					.catch(err => {
						res.status(500).json({ err: "Error updating bear" });
					});
			} else {
				res.status(404).json({ msg: `Bear with id: ${id} not found.` });
			}
		})
		.catch(err => {
			res.status(500).json({ err: "Error locating bear to be updated." });
		});
});

server.delete("/bears/:id", (req, res) => {
	const { id } = req.params;
	knex("bears")
		.where({ id })
		.then(bear => {
			if (bear.length > 0) {
				knex("bears")
					.where({ id })
					.del()
					.then(success => {
						res.status(200).json({ msg: "bear gone bye bye" });
					})
					.catch(err => {
						res.status(500).json({ msg: "Error deleting the bear." });
					});
			} else {
				res.status(404).json({ msg: "Error locating bear to delete." });
			}
		})
		.catch(err => {
			res
				.status(500)
				.json({ err: "Error locating bear at beginning of deletion process." });
		});
});

const port = 3000;
server.listen(port, function() {
	console.log(`Server Listening on ${port}`);
});
