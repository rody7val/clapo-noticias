// # Ghost Configuration
// Setup your Ghost install for various [environments](https://docs.ghost.org/v0.11.9/docs/configuring-ghost#section-about-environments).

// Ghost runs in `development` mode by default. Full documentation can be found
// at https://docs.ghost.org/v0.11.9/docs/configuring-ghost

var path = require('path'),
    config;

//Postgres DATABASE_URL = postgress://user:passwd@host:port/database
//Postgres DATABASE_URL = postgress://:@:/
var url = process.env.DATABASE_URL || null;

if (url) {
    url = url.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
    var DB_name  = (url[6]||null),
        user     = (url[2]||null),
        pwd      = (url[3]||null),
        protocol = (url[1]||null),
        dialect  = (url[1]||null),
        port     = (url[5]||null),
        host     = (url[4]||null);
}

config = {
    // ### Production
    // When running Ghost in the wild, use the production environment.
    // Configure your URL and mail settings here
    production: {
        url: 'https://clapo-noticias.herokuapp.com/',
        mail: {
            service: 'Gmail',
            from: '"C.L.A.Po Noticias" <noticias@clapo.com.ar>',
            transport: 'SMTP',
            options: {
                host: 'smtp.gmail.com',
                secureConnection: true,
                port: 465,
                auth:  {
                    user: process.env.USER_EMAIL,
                    pass: process.env.PASS_EMAIL
                }
            }
        },
        database: {
            client: 'postgres',
            connection: {
                  host: host,
                  user: user,
                  password: pwd,
                  database: DB_name,
                  port: port
            },
            debug: false
        },

        server: {
            host: '0.0.0.0',
            port: process.env.PORT || 3000
        }
    },

    // ### Development **(default)**
    development: {
        // The url to use when providing links to the site, E.g. in RSS and email.
        // Change this to your Ghost blog's published URL.
        url: 'http://localhost:2368',

        // Example refferer policy
        // Visit https://www.w3.org/TR/referrer-policy/ for instructions
        // default 'origin-when-cross-origin',
        // referrerPolicy: 'origin-when-cross-origin',

        // Example mail config
        // Visit https://docs.ghost.org/v0.11.9/docs/mail-config for instructions
        // ```
        mail: {
            service: 'Gmail',
            from: '"C.L.A.Po Noticias" <noticias@clapo.com.ar>',
            transport: 'SMTP',
            options: {
                host: 'smtp.gmail.com',
                secureConnection: true,
                port: 465,
                auth:  {
                    user: process.env.USER_EMAIL,
                    pass: process.env.PASS_EMAIL
                }
            }
        },
        // ```

        // #### Database
        // Ghost supports sqlite3 (default), MySQL & PostgreSQL
        database: {
            client: 'sqlite3',
            connection: {
                filename: path.join(__dirname, '/content/data/ghost-dev.db')
            },
            debug: false
        },
        // #### Server
        // Can be host & port (default), or socket
        server: {
            // Host to be passed to node's `net.Server#listen()`
            host: '127.0.0.1',
            // Port to be passed to node's `net.Server#listen()`, for iisnode set this to `process.env.PORT`
            port: '2368'
        },
        // #### Paths
        // Specify where your content directory lives
        paths: {
            contentPath: path.join(__dirname, '/content/')
        }
    },

    // **Developers only need to edit below here**

    // ### Testing
    // Used when developing Ghost to run tests and check the health of Ghost
    // Uses a different port number
    testing: {
        url: 'http://127.0.0.1:2369',
        database: {
            client: 'sqlite3',
            connection: {
                filename: path.join(__dirname, '/content/data/ghost-test.db')
            },
            pool: {
                afterCreate: function (conn, done) {
                    conn.run('PRAGMA synchronous=OFF;' +
                    'PRAGMA journal_mode=MEMORY;' +
                    'PRAGMA locking_mode=EXCLUSIVE;' +
                    'BEGIN EXCLUSIVE; COMMIT;', done);
                }
            },
            useNullAsDefault: true
        },
        server: {
            host: '127.0.0.1',
            port: '2369'
        },
        logging: false
    },

    // ### Testing MySQL
    // Used by Travis - Automated testing run through GitHub
    'testing-mysql': {
        url: 'http://127.0.0.1:2369',
        database: {
            client: 'mysql',
            connection: {
                host     : '127.0.0.1',
                user     : 'root',
                password : '',
                database : 'ghost_testing',
                charset  : 'utf8'
            }
        },
        server: {
            host: '127.0.0.1',
            port: '2369'
        },
        logging: false
    },

    // ### Testing pg
    // Used by Travis - Automated testing run through GitHub
    'testing-pg': {
        url: 'http://127.0.0.1:2369',
        database: {
            client: 'pg',
            connection: {
                host     : '127.0.0.1',
                user     : 'postgres',
                password : '',
                database : 'ghost_testing',
                charset  : 'utf8'
            }
        },
        server: {
            host: '127.0.0.1',
            port: '2369'
        },
        logging: false
    }
};

module.exports = config;
