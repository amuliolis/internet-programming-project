const dotenv = require('dotenv')
dotenv.config();
module.exports = {
	db_username: process.env.USERNAME,
	db_password: process.env.PASSWORD,
	server_hostname: process.env.HOSTNAME,
	server_port: process.env.PORT,
	ip_api_url: 'http://ip-api.com/json/',
}