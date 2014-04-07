exports.settings = {
	TodoPgDbConfig: function(){
		return {
			client: 'postgres',
			connection: {
				host     : '54.244.241.130',
				//host     : 'localhost',
				port     : '5432',
				user     : 'postgres',
				password: 'P%ssword39',
				//password : 'geopostgres',
				database : global.UnitTestMode !== undefined ? 'Todo_UnitTest' : 'Todo',
				//database : 'Todo_UnitTest',
				charset  : 'utf8'
			},
			debug: false
	}},
	TodoSqliteDbConfig: {
		client: 'sqlite3',
		connection: {
			filename: "./../database/todo.sqlt"
		},
		debug: false
	}
}