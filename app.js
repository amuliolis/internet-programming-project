const express = require('express');
const app = express();

const http = require('http');
const { MongoClient, ServerApiVersion } = require('mongodb');

const { db_username, db_password, server_hostname, server_port, ip_api_url } = require('./config');

const db_uri = "mongodb+srv://" + db_username + ":" + db_password + "@cluster0.sqr0ch0.mongodb.net/?retryWrites=true&w=majority";
const db_client = new MongoClient(db_uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const max_life = 30*24*60*60;

main().catch(console.error);

async function main() {
	await db_client.connect().then(() => {
		var db = db_client.db('Locations').collection('LocationsCollection');
		console.log("connected to database");
		
		app.use(express.static(__dirname + '/webapp/dist/webapp'));

		app.get('/api/getLocations', (req, res) => {
			let now = Math.floor(Date.now() / 1000);
			let ip = req.socket.remoteAddress;

			let full_response = {
				status: 'success',
				self_address: ip,
				list: []
			};

			console.log(ip);

			db.find({ timestamp: {$gt: now - max_life} }).toArray().then(documents => {
				let found = false;
				documents.forEach((doc, index, arr) => {
					delete doc._id;
					if (doc.address == ip) {
						found = true;
						doc.timestamp = now;
						console.log('exists');
						console.log(doc);
						db.replaceOne({ address: ip }, doc);
					}
					full_response.list.push(doc);
				});

				if (found) {
					res.json(full_response);
					return;
				}

				get(ip_api_url + ip, (data) => {
					if (data.status != 'success') {
						console.log('error');
						full_response.status = 'error';
						res.json(full_response);
						return;
					}
					let obj = {
						location: {
							lat: data.lat,
							lon: data.lon
						},
						address: ip,
						timestamp: now,
					};
					console.log(obj);
					
					full_response.list.push(obj);
					res.json(full_response);
					db.insertOne(obj);
				});
			}).then(() => {
				db.deleteMany({ timestamp: {$lt: now - max_life} });
			});
		});
		
		app.listen(server_port, () => {
			console.log(`server running at http://${server_hostname}:${server_port}`);
		});
	});
}

function get(url, callback) {
	var request = http.get(url, (response) => {
		let data = '';
		response.on('data', (chunk) => { data += chunk; });
		response.on('end', () => {
			try {
				var parsed = JSON.parse(data);
				callback(parsed);
			} catch (e) {
				console.error(e.message);
			}
		});
	});
}
